import { Elysia, t } from "elysia";
import { vehiclesService } from "./vehicles.service";

export const vehiclesRoutes = new Elysia({ prefix: "/api/vehicles" })
  .get(
    "/",
    async ({ query }) => {
      const vehicles = await vehiclesService.list({
        category: query.category as any,
        status: query.status as any,
        minPrice: query.minPrice ? Number(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
        search: query.search,
      });
      return { success: true, data: vehicles };
    },
    {
      query: t.Object({
        category: t.Optional(t.String()),
        status: t.Optional(t.String()),
        minPrice: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),
        search: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Vehicles"],
        summary: "List all vehicles with optional filters",
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const vehicle = await vehiclesService.getById(params.id);
      if (!vehicle) {
        set.status = 404;
        return { success: false, error: "Vehicle not found" };
      }
      return { success: true, data: vehicle };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Vehicles"],
        summary: "Get vehicle by ID",
      },
    }
  )
  .get(
    "/:id/availability",
    async ({ params }) => {
      const bookedDates = await vehiclesService.getAvailability(params.id);
      return { success: true, data: bookedDates };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Vehicles"],
        summary: "Get booked date ranges for a vehicle",
      },
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const vehicle = await vehiclesService.create(body as any);
        set.status = 201;
        return { success: true, data: vehicle };
      } catch (error: any) {
        if (error?.code === "P2002") {
          set.status = 409;
          return { success: false, error: "Plate number already exists" };
        }
        set.status = 500;
        return { success: false, error: "Failed to create vehicle" };
      }
    },
    {
      body: t.Object({
        plateNo: t.String({ minLength: 1 }),
        brand: t.String({ minLength: 1 }),
        model: t.String({ minLength: 1 }),
        category: t.Union([
          t.Literal("SEDAN"),
          t.Literal("SUV"),
          t.Literal("VAN"),
        ]),
        dailyPrice: t.Number({ minimum: 0 }),
        imageUrl: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Vehicles"],
        summary: "Create a new vehicle (Admin)",
      },
    }
  )
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const vehicle = await vehiclesService.update(params.id, body as any);
        return { success: true, data: vehicle };
      } catch (error: any) {
        if (error?.code === "P2025") {
          set.status = 404;
          return { success: false, error: "Vehicle not found" };
        }
        set.status = 500;
        return { success: false, error: "Failed to update vehicle" };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        plateNo: t.Optional(t.String()),
        brand: t.Optional(t.String()),
        model: t.Optional(t.String()),
        category: t.Optional(
          t.Union([t.Literal("SEDAN"), t.Literal("SUV"), t.Literal("VAN")])
        ),
        dailyPrice: t.Optional(t.Number({ minimum: 0 })),
        imageUrl: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal("AVAILABLE"),
            t.Literal("RENTED"),
            t.Literal("MAINTENANCE"),
          ])
        ),
      }),
      detail: {
        tags: ["Vehicles"],
        summary: "Update a vehicle (Admin)",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await vehiclesService.delete(params.id);
        return { success: true, message: "Vehicle deleted" };
      } catch (error: any) {
        if (error?.code === "P2025") {
          set.status = 404;
          return { success: false, error: "Vehicle not found" };
        }
        set.status = 500;
        return { success: false, error: "Failed to delete vehicle" };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Vehicles"],
        summary: "Delete a vehicle (Admin)",
      },
    }
  );
