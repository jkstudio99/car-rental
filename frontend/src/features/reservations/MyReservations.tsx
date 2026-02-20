import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Clock } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth.store";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";
import type { Reservation, ApiResponse } from "@/types";

const statusVariant: Record<string, "default" | "success" | "destructive" | "warning" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export function MyReservations() {
  const { user } = useAuthStore();
  const { locale } = useLocaleStore();
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", { customerId: user?.id }],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Reservation[]>>(
        `/reservations?customerId=${user?.id}`
      );
      return res.data.data || [];
    },
    enabled: !!user?.id,
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/reservations/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t("myRes.title", locale)}</h1>
        <p className="text-muted-foreground">{t("myRes.subtitle", locale)}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t("myRes.noReservations", locale)}</h3>
            <p className="text-muted-foreground">{t("myRes.noReservationsDesc", locale)}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <Card key={res.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {res.vehicle?.imageUrl && (
                    <img
                      src={res.vehicle.imageUrl}
                      alt={`${res.vehicle?.brand} ${res.vehicle?.model}`}
                      className="w-full sm:w-32 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {res.vehicle?.brand} {res.vehicle?.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {res.vehicle?.plateNo}
                        </p>
                      </div>
                      <Badge variant={statusVariant[res.status]}>{t(`status.${res.status}`, locale)}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{t("myRes.pickup", locale)}: {formatDate(res.pickupDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{t("myRes.return", locale)}: {formatDate(res.returnDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-primary">
                        {formatCurrency(res.totalCalculatedPrice)}
                      </span>
                      {(res.status === "PENDING" || res.status === "CONFIRMED") && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelMutation.mutate(res.id)}
                          disabled={cancelMutation.isPending}
                        >
                          {t("myRes.cancel", locale)}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
