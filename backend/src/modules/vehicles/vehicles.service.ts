import { prisma } from "../../lib/prisma";
import type { VehicleCategory, VehicleStatus } from "@prisma/client";

export const vehiclesService = {
  async list(filters?: {
    category?: VehicleCategory;
    status?: VehicleStatus;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.minPrice || filters?.maxPrice) {
      where.dailyPrice = {};
      if (filters.minPrice) where.dailyPrice.gte = filters.minPrice;
      if (filters.maxPrice) where.dailyPrice.lte = filters.maxPrice;
    }
    if (filters?.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: "insensitive" } },
        { model: { contains: filters.search, mode: "insensitive" } },
        { plateNo: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  },

  async create(data: {
    plateNo: string;
    brand: string;
    model: string;
    category: VehicleCategory;
    dailyPrice: number;
    imageUrl?: string;
  }) {
    return prisma.vehicle.create({ data });
  },

  async update(
    id: string,
    data: {
      plateNo?: string;
      brand?: string;
      model?: string;
      category?: VehicleCategory;
      dailyPrice?: number;
      imageUrl?: string;
      status?: VehicleStatus;
    }
  ) {
    return prisma.vehicle.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },

  async getAvailability(vehicleId: string) {
    const reservations = await prisma.reservation.findMany({
      where: {
        vehicleId,
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: {
        pickupDate: true,
        returnDate: true,
        status: true,
      },
      orderBy: { pickupDate: "asc" },
    });

    return reservations.map((r) => ({
      pickupDate: r.pickupDate.toISOString(),
      returnDate: r.returnDate.toISOString(),
      status: r.status,
    }));
  },
};
