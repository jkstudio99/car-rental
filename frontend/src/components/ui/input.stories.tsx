import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const Email: Story = {
  args: { type: "email", placeholder: "your@email.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "••••••••" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled input", value: "Cannot edit" },
};

export const WithValue: Story = {
  args: { value: "admin@carrental.com", readOnly: true },
};

export const Search: Story = {
  args: { type: "search", placeholder: "ค้นหาแบรนด์ รุ่น..." },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input placeholder="ชื่อ" />
      <Input type="email" placeholder="อีเมล" />
      <Input type="password" placeholder="รหัสผ่าน" />
      <Input type="number" placeholder="ราคา/วัน" min={0} />
      <Input disabled placeholder="ปิดใช้งาน" />
    </div>
  ),
};
