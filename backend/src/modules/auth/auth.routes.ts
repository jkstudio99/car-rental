import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { authService } from "./auth.service";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "car-rental-jwt-secret-key-2024",
    }),
  )
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const customer = await authService.registerCustomer(body);
        set.status = 201;
        return { success: true, data: customer };
      } catch (error: unknown) {
        const err = error as Record<string, unknown>;
        if (err?.code === "P2002") {
          set.status = 409;
          return {
            success: false,
            error: "Email or driving license already exists",
          };
        }
        set.status = 500;
        return { success: false, error: "Registration failed" };
      }
    },
    {
      body: t.Object({
        firstName: t.String({ minLength: 1 }),
        lastName: t.String({ minLength: 1 }),
        phone: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        drivingLicense: t.String({ minLength: 1 }),
        addressText: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Register a new customer",
      },
    },
  )
  .post(
    "/login",
    async ({ body, set, jwt, cookie: { auth } }) => {
      const { email, password, loginAs } = body;

      let user;
      if (loginAs === "EMPLOYEE") {
        user = await authService.loginEmployee(email, password);
      } else {
        user = await authService.loginCustomer(email, password);
      }

      if (!user) {
        set.status = 401;
        return { success: false, error: "Invalid email or password" };
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: "role" in user ? user.role : "CUSTOMER",
      });

      auth.set({
        value: token,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/",
        sameSite: "lax",
      });

      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
        loginAs: t.Optional(
          t.Union([t.Literal("CUSTOMER"), t.Literal("EMPLOYEE")]),
        ),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Login as customer or employee",
      },
    },
  )
  .get(
    "/profile",
    async ({ jwt, cookie: { auth }, set, headers }) => {
      const token =
        auth?.value || headers.authorization?.replace("Bearer ", "");
      if (!token) {
        set.status = 401;
        return { success: false, error: "Not authenticated" };
      }

      const payload = await jwt.verify(token as string);
      if (!payload) {
        set.status = 401;
        return { success: false, error: "Invalid token" };
      }

      const { id, role } = payload as unknown as { id: string; role: string };

      let user;
      if (role === "CUSTOMER") {
        user = await authService.getCustomerById(id);
      } else {
        user = await authService.getEmployeeById(id);
      }

      if (!user) {
        set.status = 404;
        return { success: false, error: "User not found" };
      }

      return { success: true, data: { ...user, role } };
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Get current user profile",
      },
    },
  )
  .post(
    "/logout",
    async ({ cookie: { auth } }) => {
      auth?.remove();
      return { success: true, message: "Logged out" };
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Logout and clear auth cookie",
      },
    },
  );
