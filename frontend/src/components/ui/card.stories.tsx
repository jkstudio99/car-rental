import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Car } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>Review your reservation details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span>3 days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily Rate</span>
          <span>฿1,200</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">฿3,600</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Confirm Booking</Button>
      </CardFooter>
    </Card>
  ),
};

export const VehicleCard: Story = {
  render: () => (
    <Card className="w-72 overflow-hidden">
      <div className="relative h-40 bg-muted flex items-center justify-center">
        <Car className="h-16 w-16 text-muted-foreground" />
        <Badge variant="success" className="absolute top-2 right-2">ว่าง</Badge>
        <Badge variant="secondary" className="absolute top-2 left-2">SEDAN</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">Toyota Camry</h3>
        <p className="text-sm text-muted-foreground">กก-1234</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-primary">฿1,200/วัน</span>
          <Button size="sm">เลือก</Button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const KPICard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "รถทั้งหมด", value: "24", color: "bg-violet-100 text-violet-600" },
        { label: "รายได้วันนี้", value: "฿18,400", color: "bg-purple-100 text-purple-600" },
        { label: "รอดำเนินการ", value: "5", color: "bg-fuchsia-100 text-fuchsia-600" },
        { label: "การจองทั้งหมด", value: "142", color: "bg-indigo-100 text-indigo-600" },
      ].map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
