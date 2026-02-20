import { Elysia, t } from "elysia";
import { reservationsService } from "./reservations.service";

export const reservationsRoutes = new Elysia({ prefix: "/api/reservations" })
  .get(
    "/",
    async ({ query }) => {
      const reservations = await reservationsService.list({
        customerId: query.customerId,
        status: query.status as any,
        vehicleId: query.vehicleId,
      });
      return { success: true, data: reservations };
    },
    {
      query: t.Object({
        customerId: t.Optional(t.String()),
        status: t.Optional(t.String()),
        vehicleId: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Reservations"],
        summary: "List reservations with optional filters",
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const reservation = await reservationsService.getById(params.id);
      if (!reservation) {
        set.status = 404;
        return { success: false, error: "Reservation not found" };
      }
      return { success: true, data: reservation };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Reservations"],
        summary: "Get reservation by ID",
      },
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const reservation = await reservationsService.create({
          ...body,
          pickupDate: new Date(body.pickupDate),
          returnDate: new Date(body.returnDate),
          payMethod: body.payMethod as any,
        });
        set.status = 201;
        return { success: true, data: reservation };
      } catch (error: any) {
        set.status = 400;
        return { success: false, error: error.message || "Failed to create reservation" };
      }
    },
    {
      body: t.Object({
        customerId: t.String(),
        vehicleId: t.String(),
        pickupDate: t.String(),
        returnDate: t.String(),
        pickupLocation: t.String({ minLength: 1 }),
        payMethod: t.Union([t.Literal("PROMPTPAY"), t.Literal("CREDIT_CARD")]),
      }),
      detail: {
        tags: ["Reservations"],
        summary: "Create a new reservation with availability check",
      },
    }
  )
  .patch(
    "/:id/confirm",
    async ({ params, body, set }) => {
      try {
        const result = await reservationsService.confirm(
          params.id,
          body.approvedById
        );
        return { success: true, data: result };
      } catch (error: any) {
        set.status = 400;
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        approvedById: t.String(),
      }),
      detail: {
        tags: ["Reservations"],
        summary: "Confirm a reservation (Admin)",
      },
    }
  )
  .patch(
    "/:id/cancel",
    async ({ params, set }) => {
      try {
        const result = await reservationsService.cancel(params.id);
        return { success: true, data: result };
      } catch (error: any) {
        set.status = 400;
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Reservations"],
        summary: "Cancel a reservation",
      },
    }
  )
  .patch(
    "/:id/complete",
    async ({ params, set }) => {
      try {
        const result = await reservationsService.complete(params.id);
        return { success: true, data: result };
      } catch (error: any) {
        set.status = 400;
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Reservations"],
        summary: "Complete a reservation / return vehicle (Admin)",
      },
    }
  );
