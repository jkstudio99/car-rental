import { prisma } from "../../lib/prisma";

export const adminService = {
  async getDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 86400000);

    const [
      totalVehicles,
      availableCount,
      rentedCount,
      maintenanceCount,
      totalReservations,
      pendingReservations,
      todayRevenue,
      recentPayments,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { status: "RENTED" } }),
      prisma.vehicle.count({ where: { status: "MAINTENANCE" } }),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "PENDING" } }),
      prisma.paymentRecord.aggregate({
        _sum: { finalPayment: true, downPayment: true },
        where: {
          paidAt: { gte: startOfDay, lt: endOfDay },
          status: "PAID",
        },
      }),
      prisma.paymentRecord.findMany({
        where: { status: "PAID", paidAt: { not: null } },
        orderBy: { paidAt: "desc" },
        take: 30,
        select: {
          finalPayment: true,
          downPayment: true,
          paidAt: true,
        },
      }),
    ]);

    const todayRevenueTotal =
      (todayRevenue._sum.finalPayment || 0) +
      (todayRevenue._sum.downPayment || 0);

    return {
      fleet: {
        total: totalVehicles,
        available: availableCount,
        rented: rentedCount,
        maintenance: maintenanceCount,
      },
      reservations: {
        total: totalReservations,
        pending: pendingReservations,
      },
      todayRevenue: todayRevenueTotal,
      revenueHistory: recentPayments.map((p) => ({
        amount: (p.finalPayment || 0) + (p.downPayment || 0),
        date: p.paidAt?.toISOString() || "",
      })),
    };
  },

  async getUpcomingActions() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfTomorrow = new Date(startOfDay.getTime() + 2 * 86400000);

    const [pickups, returns] = await Promise.all([
      prisma.reservation.findMany({
        where: {
          status: "CONFIRMED",
          pickupDate: { gte: startOfDay, lt: endOfTomorrow },
        },
        include: {
          customer: {
            select: { firstName: true, lastName: true },
          },
          vehicle: {
            select: { plateNo: true, brand: true, model: true },
          },
        },
        orderBy: { pickupDate: "asc" },
      }),
      prisma.reservation.findMany({
        where: {
          status: "CONFIRMED",
          returnDate: { gte: startOfDay, lt: endOfTomorrow },
        },
        include: {
          customer: {
            select: { firstName: true, lastName: true },
          },
          vehicle: {
            select: { plateNo: true, brand: true, model: true },
          },
        },
        orderBy: { returnDate: "asc" },
      }),
    ]);

    return [
      ...pickups.map((r) => ({
        id: r.id,
        customerName: `${r.customer.firstName} ${r.customer.lastName}`,
        vehiclePlate: r.vehicle.plateNo,
        vehicleName: `${r.vehicle.brand} ${r.vehicle.model}`,
        actionType: "PICKUP" as const,
        scheduledTime: r.pickupDate.toISOString(),
        status: r.status,
      })),
      ...returns.map((r) => ({
        id: r.id,
        customerName: `${r.customer.firstName} ${r.customer.lastName}`,
        vehiclePlate: r.vehicle.plateNo,
        vehicleName: `${r.vehicle.brand} ${r.vehicle.model}`,
        actionType: "RETURN" as const,
        scheduledTime: r.returnDate.toISOString(),
        status: r.status,
      })),
    ];
  },
};
