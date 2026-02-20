import { prisma } from "../../lib/prisma";
import { calculateLateFee } from "../../lib/pricing.utils";

export const paymentsService = {
  async getByReservationId(reservationId: string) {
    return prisma.paymentRecord.findUnique({
      where: { reservationId },
      include: {
        reservation: {
          include: {
            vehicle: {
              select: {
                id: true,
                plateNo: true,
                brand: true,
                model: true,
                dailyPrice: true,
              },
            },
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },

  async recordDownPayment(paymentId: string) {
    return prisma.paymentRecord.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
  },

  async recordFinalPayment(paymentId: string) {
    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new Error("Payment record not found");

    return prisma.paymentRecord.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
  },

  async processReturn(
    paymentId: string,
    data: {
      actualReturnDate: Date;
      damageFee?: number;
    }
  ) {
    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentId },
      include: {
        reservation: {
          include: { vehicle: true },
        },
      },
    });

    if (!payment) throw new Error("Payment record not found");
    if (payment.reservation.status !== "CONFIRMED")
      throw new Error("Reservation must be CONFIRMED to process return");

    const lateFee = calculateLateFee(
      payment.reservation.returnDate,
      data.actualReturnDate,
      payment.reservation.vehicle.dailyPrice
    );

    const damageFee = data.damageFee || 0;
    const totalPenalties = lateFee + damageFee;

    let refundAmount = 0;
    if (totalPenalties === 0) {
      refundAmount = payment.downPayment;
    } else if (totalPenalties < payment.downPayment) {
      refundAmount = payment.downPayment - totalPenalties;
    }

    const newStatus = refundAmount > 0 ? "REFUNDED" : "PAID";

    return prisma.$transaction([
      prisma.paymentRecord.update({
        where: { id: paymentId },
        data: {
          lateFeePenalty: lateFee,
          damageFee,
          refundAmount,
          status: newStatus as any,
        },
      }),
      prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: "COMPLETED" },
      }),
      prisma.vehicle.update({
        where: { id: payment.reservation.vehicleId },
        data: { status: "AVAILABLE" },
      }),
    ]);
  },
};
