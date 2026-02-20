import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Car } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";
import type { Vehicle, VehicleCategory, ApiResponse } from "@/types";

const categoryKeys = [
  { value: "" as VehicleCategory | "", key: "catalog.allTypes" as const },
  { value: "SEDAN" as VehicleCategory | "", key: "catalog.sedan" as const },
  { value: "SUV" as VehicleCategory | "", key: "catalog.suv" as const },
  { value: "VAN" as VehicleCategory | "", key: "catalog.van" as const },
];

const statusColors: Record<string, "success" | "destructive" | "warning"> = {
  AVAILABLE: "success",
  RENTED: "destructive",
  MAINTENANCE: "warning",
};

export function VehicleCatalog() {
  const navigate = useNavigate();
  const { selectVehicle } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const { locale } = useLocaleStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<VehicleCategory | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles", { search, category }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await api.get<ApiResponse<Vehicle[]>>(`/vehicles?${params}`);
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    selectVehicle(vehicle);
    navigate("/booking");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t("catalog.title", locale)}</h1>
          <p className="text-muted-foreground">{t("catalog.subtitle", locale)}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("catalog.search", locale)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className={`flex flex-wrap gap-2 ${showFilters ? "" : "hidden md:flex"}`}>
        {categoryKeys.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(cat.value)}
          >
            {t(cat.key, locale)}
          </Button>
        ))}
      </div>

      {/* Vehicle Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t("catalog.noVehicles", locale)}</h3>
          <p className="text-muted-foreground">{t("catalog.noVehiclesDesc", locale)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted overflow-hidden">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  variant={statusColors[vehicle.status]}
                  className="absolute top-2 right-2"
                >
                  {t(`status.${vehicle.status}`, locale)}
                </Badge>
                <Badge variant="secondary" className="absolute top-2 left-2">
                  {vehicle.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.plateNo}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(vehicle.dailyPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground">{t("catalog.perDay", locale)}</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={vehicle.status !== "AVAILABLE"}
                    onClick={() => handleSelectVehicle(vehicle)}
                  >
                    {vehicle.status === "AVAILABLE" ? t("catalog.select", locale) : t("catalog.unavailable", locale)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
