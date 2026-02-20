import { prisma } from "../../lib/prisma";

export const authService = {
  async registerCustomer(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    drivingLicense: string;
    addressText?: string;
  }) {
    const hashedPassword = await Bun.password.hash(data.password);
    return prisma.customer.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        drivingLicense: true,
        addressText: true,
        createdAt: true,
      },
    });
  },

  async loginCustomer(email: string, password: string) {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return null;

    const valid = await Bun.password.verify(password, customer.password);
    if (!valid) return null;

    const { password: _, ...customerWithoutPassword } = customer;
    return { ...customerWithoutPassword, role: "CUSTOMER" as const };
  },

  async loginEmployee(email: string, password: string) {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return null;

    const valid = await Bun.password.verify(password, employee.password);
    if (!valid) return null;

    const { password: _, ...employeeWithoutPassword } = employee;
    return employeeWithoutPassword;
  },

  async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        drivingLicense: true,
        addressText: true,
        createdAt: true,
      },
    });
  },

  async getEmployeeById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  },
};
