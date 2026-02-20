import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:123456@127.0.0.1:5432/cardb?schema=public",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.paymentRecord.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();

  // ─── Employees ───
  const admin = await prisma.employee.create({
    data: {
      firstName: "Somchai",
      lastName: "Jaidee",
      phone: "081-234-5678",
      email: "admin@carrental.com",
      password: await Bun.password.hash("admin123"),
      role: "ADMIN",
    },
  });

  const staff = await prisma.employee.create({
    data: {
      firstName: "Nattapong",
      lastName: "Suksai",
      phone: "082-345-6789",
      email: "staff@carrental.com",
      password: await Bun.password.hash("staff123"),
      role: "STAFF",
    },
  });

  console.log("✅ Employees created");

  // ─── Customers ───
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: "Wichai",
        lastName: "Thongkham",
        phone: "091-111-2222",
        email: "wichai@email.com",
        password: await Bun.password.hash("customer123"),
        drivingLicense: "DL-TH-001234",
        addressText: "123 Sukhumvit Rd, Bangkok 10110",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Siriporn",
        lastName: "Kaewmanee",
        phone: "091-222-3333",
        email: "siriporn@email.com",
        password: await Bun.password.hash("customer123"),
        drivingLicense: "DL-TH-005678",
        addressText: "456 Ratchadaphisek Rd, Bangkok 10400",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Prasit",
        lastName: "Wongsawat",
        phone: "091-333-4444",
        email: "prasit@email.com",
        password: await Bun.password.hash("customer123"),
        drivingLicense: "DL-TH-009012",
        addressText: "789 Phahonyothin Rd, Bangkok 10900",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Kannika",
        lastName: "Rattanaporn",
        phone: "091-444-5555",
        email: "kannika@email.com",
        password: await Bun.password.hash("customer123"),
        drivingLicense: "DL-TH-003456",
        addressText: "321 Rama IV Rd, Bangkok 10500",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Tanawat",
        lastName: "Petchsri",
        phone: "091-555-6666",
        email: "tanawat@email.com",
        password: await Bun.password.hash("customer123"),
        drivingLicense: "DL-TH-007890",
        addressText: "654 Silom Rd, Bangkok 10500",
      },
    }),
  ]);

  console.log("✅ Customers created");

  // ─── Vehicles ───
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNo: "กข-1234",
        brand: "Toyota",
        model: "Camry",
        category: "SEDAN",
        dailyPrice: 1500,
        imageUrl:
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กค-5678",
        brand: "Honda",
        model: "Civic",
        category: "SEDAN",
        dailyPrice: 1200,
        imageUrl:
          "https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กง-9012",
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        dailyPrice: 2500,
        imageUrl:
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กจ-3456",
        brand: "Honda",
        model: "CR-V",
        category: "SUV",
        dailyPrice: 2200,
        imageUrl:
          "https://images.unsplash.com/photo-1568844293986-8d0400f4f36b?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กฉ-7890",
        brand: "Ford",
        model: "Everest",
        category: "SUV",
        dailyPrice: 2800,
        imageUrl:
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        status: "RENTED",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กช-1111",
        brand: "Toyota",
        model: "Hiace",
        category: "VAN",
        dailyPrice: 3000,
        imageUrl:
          "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กซ-2222",
        brand: "Hyundai",
        model: "Staria",
        category: "VAN",
        dailyPrice: 3500,
        imageUrl:
          "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กฌ-3333",
        brand: "Mazda",
        model: "3",
        category: "SEDAN",
        dailyPrice: 1300,
        imageUrl:
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
        status: "MAINTENANCE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กญ-4444",
        brand: "BMW",
        model: "X3",
        category: "SUV",
        dailyPrice: 4500,
        imageUrl:
          "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กฎ-5555",
        brand: "Mercedes-Benz",
        model: "C-Class",
        category: "SEDAN",
        dailyPrice: 4000,
        imageUrl:
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กฏ-6666",
        brand: "Nissan",
        model: "Urvan",
        category: "VAN",
        dailyPrice: 2800,
        imageUrl:
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNo: "กฐ-7777",
        brand: "Honda",
        model: "Accord",
        category: "SEDAN",
        dailyPrice: 1800,
        imageUrl:
          "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
        status: "AVAILABLE",
      },
    }),
  ]);

  console.log("✅ Vehicles created");

  // ─── Reservations with Payment Records ───
  const now = new Date();
  const dayMs = 86400000;

  // Reservation 1: CONFIRMED — upcoming pickup (tomorrow)
  const res1 = await prisma.reservation.create({
    data: {
      customerId: customers[0].id,
      vehicleId: vehicles[0].id,
      approvedById: admin.id,
      pickupDate: new Date(now.getTime() + 1 * dayMs),
      returnDate: new Date(now.getTime() + 4 * dayMs),
      pickupLocation: "Suvarnabhumi Airport",
      status: "CONFIRMED",
      totalCalculatedPrice: 4500,
      paymentRecord: {
        create: {
          payMethod: "CREDIT_CARD",
          downPayment: 1350,
          finalPayment: 3150,
          status: "PAID",
          paidAt: new Date(),
        },
      },
    },
  });

  // Reservation 2: CONFIRMED — pickup today
  const res2 = await prisma.reservation.create({
    data: {
      customerId: customers[1].id,
      vehicleId: vehicles[4].id,
      approvedById: admin.id,
      pickupDate: new Date(now.getTime() - 2 * dayMs),
      returnDate: new Date(now.getTime() + 1 * dayMs),
      pickupLocation: "Don Mueang Airport",
      status: "CONFIRMED",
      totalCalculatedPrice: 8400,
      paymentRecord: {
        create: {
          payMethod: "PROMPTPAY",
          downPayment: 2520,
          finalPayment: 5880,
          status: "PAID",
          paidAt: new Date(now.getTime() - 2 * dayMs),
        },
      },
    },
  });

  // Reservation 3: PENDING — awaiting confirmation
  const res3 = await prisma.reservation.create({
    data: {
      customerId: customers[2].id,
      vehicleId: vehicles[2].id,
      pickupDate: new Date(now.getTime() + 3 * dayMs),
      returnDate: new Date(now.getTime() + 7 * dayMs),
      pickupLocation: "Central World",
      status: "PENDING",
      totalCalculatedPrice: 10000,
      paymentRecord: {
        create: {
          payMethod: "CREDIT_CARD",
          downPayment: 3000,
          finalPayment: 7000,
          status: "PENDING",
        },
      },
    },
  });

  // Reservation 4: COMPLETED — returned on time
  const res4 = await prisma.reservation.create({
    data: {
      customerId: customers[3].id,
      vehicleId: vehicles[1].id,
      approvedById: staff.id,
      pickupDate: new Date(now.getTime() - 10 * dayMs),
      returnDate: new Date(now.getTime() - 5 * dayMs),
      pickupLocation: "Siam Paragon",
      status: "COMPLETED",
      totalCalculatedPrice: 6000,
      paymentRecord: {
        create: {
          payMethod: "PROMPTPAY",
          downPayment: 1800,
          finalPayment: 4200,
          refundAmount: 1800,
          status: "REFUNDED",
          paidAt: new Date(now.getTime() - 10 * dayMs),
        },
      },
    },
  });

  // Reservation 5: COMPLETED — returned late with penalty
  const res5 = await prisma.reservation.create({
    data: {
      customerId: customers[4].id,
      vehicleId: vehicles[3].id,
      approvedById: admin.id,
      pickupDate: new Date(now.getTime() - 14 * dayMs),
      returnDate: new Date(now.getTime() - 10 * dayMs),
      pickupLocation: "Chatuchak",
      status: "COMPLETED",
      totalCalculatedPrice: 8800,
      paymentRecord: {
        create: {
          payMethod: "CREDIT_CARD",
          downPayment: 2640,
          finalPayment: 6160,
          lateFeePenalty: 6600,
          status: "PAID",
          paidAt: new Date(now.getTime() - 14 * dayMs),
        },
      },
    },
  });

  // Reservation 6: CANCELLED
  const res6 = await prisma.reservation.create({
    data: {
      customerId: customers[0].id,
      vehicleId: vehicles[5].id,
      pickupDate: new Date(now.getTime() + 5 * dayMs),
      returnDate: new Date(now.getTime() + 8 * dayMs),
      pickupLocation: "MBK Center",
      status: "CANCELLED",
      totalCalculatedPrice: 9000,
      paymentRecord: {
        create: {
          payMethod: "PROMPTPAY",
          downPayment: 2700,
          finalPayment: 0,
          refundAmount: 2700,
          status: "REFUNDED",
        },
      },
    },
  });

  console.log("✅ Reservations & Payments created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
