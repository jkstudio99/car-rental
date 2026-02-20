import { Elysia } from "elysia";
import { adminService } from "./admin.service";

export const adminRoutes = new Elysia({ prefix: "/api/admin" })
  .get(
    "/dashboard",
    async () => {
      const dashboard = await adminService.getDashboard();
      return { success: true, data: dashboard };
    },
    {
      detail: {
        tags: ["Admin"],
        summary: "Get dashboard KPIs, fleet stats, and revenue data",
      },
    }
  )
  .get(
    "/upcoming-actions",
    async () => {
      const actions = await adminService.getUpcomingActions();
      return { success: true, data: actions };
    },
    {
      detail: {
        tags: ["Admin"],
        summary: "Get today's upcoming pickups and returns",
      },
    }
  );
