import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Layout/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Unauthenticated: Story = {};

export const CustomerLoggedIn: Story = {
  decorators: [
    (Story) => {
      const { useAuthStore } = require("@/stores/auth.store");
      useAuthStore.setState({
        isAuthenticated: true,
        user: { id: "1", firstName: "วิชัย", lastName: "ทองคำ", role: "CUSTOMER", email: "wichai@email.com" },
      });
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const AdminLoggedIn: Story = {
  decorators: [
    (Story) => {
      const { useAuthStore } = require("@/stores/auth.store");
      useAuthStore.setState({
        isAuthenticated: true,
        user: { id: "2", firstName: "Admin", lastName: "User", role: "ADMIN", email: "admin@carrental.com" },
      });
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};
