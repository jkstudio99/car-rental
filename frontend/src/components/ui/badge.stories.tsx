import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "success", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Default" },
};

export const Success: Story = {
  args: { variant: "success", children: "Available" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Pending" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Cancelled" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Confirmed</Badge>
      <Badge variant="success">Available</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Cancelled</Badge>
      <Badge variant="secondary">SEDAN</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const VehicleStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">ว่าง</Badge>
      <Badge variant="destructive">ถูกเช่า</Badge>
      <Badge variant="warning">ซ่อมบำรุง</Badge>
    </div>
  ),
};

export const ReservationStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="warning">รอดำเนินการ</Badge>
      <Badge>ยืนยันแล้ว</Badge>
      <Badge variant="success">เสร็จสิ้น</Badge>
      <Badge variant="destructive">ยกเลิกแล้ว</Badge>
    </div>
  ),
};
