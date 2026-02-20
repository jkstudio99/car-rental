import { useQuery } from "@tanstack/react-query";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Car, DollarSign, CalendarClock, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";
import type { DashboardData, UpcomingAction, ApiResponse } from "@/types";

const FLEET_COLORS = ["#a78bfa", "#ef4444", "#f59e0b"];

export function AdminDashboard() {
  const { locale } = useLocaleStore();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardData>>("/admin/dashboard");
      return res.data.data!;
    },
    refetchInterval: 30000,
  });

  const { data: actions = [] } = useQuery({
    queryKey: ["admin", "upcoming-actions"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<UpcomingAction[]>>("/admin/upcoming-actions");
      return res.data.data || [];
    },
    refetchInterval: 30000,
  });

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const fleetData = [
    { name: "Available", value: dashboard.fleet.available, color: FLEET_COLORS[0] },
    { name: "Rented", value: dashboard.fleet.rented, color: FLEET_COLORS[1] },
    { name: "Maintenance", value: dashboard.fleet.maintenance, color: FLEET_COLORS[2] },
  ];

  const revenueData = dashboard.revenueHistory
    .slice(0, 14)
    .reverse()
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" }),
      amount: r.amount,
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t("admin.dashboard", locale)}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Car className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.totalFleet", locale)}</p>
                <p className="text-2xl font-bold">{dashboard.fleet.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.todayRevenue", locale)}</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboard.todayRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fuchsia-100 rounded-lg">
                <CalendarClock className="h-5 w-5 text-fuchsia-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.pending", locale)}</p>
                <p className="text-2xl font-bold">{dashboard.reservations.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin.totalBookings", locale)}</p>
                <p className="text-2xl font-bold">{dashboard.reservations.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fleet Utilization Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.fleetUtilization", locale)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={fleetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {fleetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.revenueTrend", locale)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("admin.upcomingActions", locale)}</CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("admin.noActions", locale)}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Vehicle</th>
                    <th className="text-left py-3 px-2 font-medium">Plate</th>
                    <th className="text-left py-3 px-2 font-medium">Action</th>
                    <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action) => (
                    <tr key={`${action.id}-${action.actionType}`} className="border-b last:border-0">
                      <td className="py-3 px-2">{action.customerName}</td>
                      <td className="py-3 px-2 hidden sm:table-cell">{action.vehicleName}</td>
                      <td className="py-3 px-2 font-mono text-xs">{action.vehiclePlate}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={action.actionType === "PICKUP" ? "default" : "warning"}
                        >
                          {action.actionType}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-muted-foreground">
                        {new Date(action.scheduledTime).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
