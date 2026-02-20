import { prisma } from "../../lib/prisma";
import {
  calculateBaseCost,
  calculateDownPayment,
  calculateFinalPayment,
} from "../../lib/pricing.utils";
import type { ReservationStatus, PayMethod } from "@prisma/client";

export const reservationsService = {
  async checkAvailability(
    vehicleId: string,
    pickupDate: Date,
    returnDate: Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    const overlapping = await prisma.reservation.findFirst({
      where: {
        vehicleId,
        status: { in: ["CONFIRMED", "COMPLETED"] },
        pickupDate: { lt: returnDate },
        returnDate: { gt: pickupDate },
        ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
      },
    });
    return !overlapping;
  },

  async list(filters?: {
    customerId?: string;
    status?: ReservationStatus;
    vehicleId?: string;
  }) {
    const where: any = {};
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.status) where.status = filters.status;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;

    return prisma.reservation.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            plateNo: true,
            brand: true,
            model: true,
            category: true,
            dailyPrice: true,
            imageUrl: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        paymentRecord: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            drivingLicense: true,
          },
        },
        vehicle: true,
        approvedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        paymentRecord: true,
      },
    });
  },

  async create(data: {
    customerId: string;
    vehicleId: string;
    pickupDate: Date;
    returnDate: Date;
    pickupLocation: string;
    payMethod: PayMethod;
  }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });
    if (!vehicle) throw new Error("Vehicle not found");

    const isAvailable = await this.checkAvailability(
      data.vehicleId,
      data.pickupDate,
      data.returnDate
    );
    if (!isAvailable) throw new Error("Vehicle is not available for the selected dates");

    const totalPrice = calculateBaseCost(
      data.pickupDate,
      data.returnDate,
      vehicle.dailyPrice
    );
    const downPayment = calculateDownPayment(totalPrice);
    const finalPayment = calculateFinalPayment(totalPrice);

    return prisma.reservation.create({
      data: {
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        pickupLocation: data.pickupLocation,
        totalCalculatedPrice: totalPrice,
        status: "PENDING",
        paymentRecord: {
          create: {
            payMethod: data.payMethod,
            downPayment,
            finalPayment,
            status: "PENDING",
          },
        },
      },
      include: {
        vehicle: true,
        paymentRecord: true,
      },
    });
  },

  async confirm(id: string, approvedById: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { vehicle: true },
    });
    if (!reservation) throw new Error("Reservation not found");
    if (reservation.status !== "PENDING")
      throw new Error("Only PENDING reservations can be confirmed");

    const isAvailable = await this.checkAvailability(
      reservation.vehicleId,
      reservation.pickupDate,
      reservation.returnDate,
      id
    );
    if (!isAvailable) throw new Error("Vehicle is no longer available for these dates");

    return prisma.$transaction([
      prisma.reservation.update({
        where: { id },
        data: { status: "CONFIRMED", approvedById },
      }),
      prisma.vehicle.update({
        where: { id: reservation.vehicleId },
        data: { status: "RENTED" },
      }),
    ]);
  },

  async cancel(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { paymentRecord: true },
    });
    if (!reservation) throw new Error("Reservation not found");
    if (!["PENDING", "CONFIRMED"].includes(reservation.status))
      throw new Error("Only PENDING or CONFIRMED reservations can be cancelled");

    const updates: any[] = [
      prisma.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
      }),
    ];

    if (reservation.paymentRecord && reservation.paymentRecord.downPayment > 0) {
      updates.push(
        prisma.paymentRecord.update({
          where: { id: reservation.paymentRecord.id },
          data: {
            refundAmount: reservation.paymentRecord.downPayment,
            status: "REFUNDED",
          },
        })
      );
    }

    if (reservation.status === "CONFIRMED") {
      updates.push(
        prisma.vehicle.update({
          where: { id: reservation.vehicleId },
          data: { status: "AVAILABLE" },
        })
      );
    }

    return prisma.$transaction(updates);
  },

  async complete(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation) throw new Error("Reservation not found");
    if (reservation.status !== "CONFIRMED")
      throw new Error("Only CONFIRMED reservations can be completed");

    return prisma.$transaction([
      prisma.reservation.update({
        where: { id },
        data: { status: "COMPLETED" },
      }),
      prisma.vehicle.update({
        where: { id: reservation.vehicleId },
        data: { status: "AVAILABLE" },
      }),
    ]);
  },
};
