import "dotenv/config";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";

import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { reservationsRoutes } from "./modules/reservations/reservations.routes";
import { paymentsRoutes } from "./modules/payments/payments.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://car-rental-roan-kappa.vercel.app",
        process.env.FRONTEND_URL || "",
      ].filter(Boolean),
      credentials: true,
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Car Rental API",
          version: "1.0.0",
          description: "Modern Car Rental System — RESTful API",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Vehicles", description: "Vehicle management" },
          { name: "Reservations", description: "Reservation management" },
          { name: "Payments", description: "Payment & penalty management" },
          { name: "Admin", description: "Admin dashboard & analytics" },
        ],
      },
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "car-rental-jwt-secret-key-2024",
    }),
  )
  .use(cookie())
  .use(authRoutes)
  .use(vehiclesRoutes)
  .use(reservationsRoutes)
  .use(paymentsRoutes)
  .use(adminRoutes)
  .get(
    "/api/health",
    () => ({ status: "ok", timestamp: new Date().toISOString() }),
    {
      detail: { tags: ["Health"], summary: "Health check" },
    },
  )
  .listen({
    port: Number(process.env.PORT) || 3000,
    hostname: "0.0.0.0",
  });

console.log(
  `🚗 Car Rental API running at http://localhost:${app.server?.port}`,
);
console.log(`📚 Swagger docs at http://localhost:${app.server?.port}/swagger`);
