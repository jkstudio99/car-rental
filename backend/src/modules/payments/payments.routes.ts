import { Elysia, t } from "elysia";
import { paymentsService } from "./payments.service";

export const paymentsRoutes = new Elysia({ prefix: "/api/payments" })
  .get(
    "/:reservationId",
    async ({ params, set }) => {
      const payment = await paymentsService.getByReservationId(
        params.reservationId
      );
      if (!payment) {
        set.status = 404;
        return { success: false, error: "Payment record not found" };
      }
      return { success: true, data: payment };
    },
    {
      params: t.Object({ reservationId: t.String() }),
      detail: {
        tags: ["Payments"],
        summary: "Get payment record by reservation ID",
      },
    }
  )
  .patch(
    "/:id/pay-down",
    async ({ params, set }) => {
      try {
        const payment = await paymentsService.recordDownPayment(params.id);
        return { success: true, data: payment };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to record payment";
        set.status = 400;
        return { success: false, error: message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Payments"],
        summary: "Record down payment",
      },
    }
  )
  .patch(
    "/:id/pay-final",
    async ({ params, set }) => {
      try {
        const payment = await paymentsService.recordFinalPayment(params.id);
        return { success: true, data: payment };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to record payment";
        set.status = 400;
        return { success: false, error: message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Payments"],
        summary: "Record final payment at pickup",
      },
    }
  )
  .patch(
    "/:id/process-return",
    async ({ params, body, set }) => {
      try {
        const result = await paymentsService.processReturn(params.id, {
          actualReturnDate: new Date(body.actualReturnDate),
          damageFee: body.damageFee,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to process return";
        set.status = 400;
        return { success: false, error: message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        actualReturnDate: t.String(),
        damageFee: t.Optional(t.Number({ minimum: 0 })),
      }),
      detail: {
        tags: ["Payments"],
        summary: "Process vehicle return with penalty/refund calculation",
      },
    }
  );
