import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
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

export function AdminReservations() {
  const { user } = useAuthStore();
  const { locale } = useLocaleStore();
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Reservation[]>>("/reservations");
      return res.data.data || [];
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/reservations/${id}/confirm`, { approvedById: user?.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/reservations/${id}/cancel`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/reservations/${id}/complete`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t("adminRes.title", locale)}</h1>
        <p className="text-muted-foreground">{t("adminRes.subtitle", locale)}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-4 bg-muted rounded w-1/2" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <Card key={res.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Vehicle Info */}
                  <div className="flex gap-3 flex-1">
                    {res.vehicle?.imageUrl && (
                      <img
                        src={res.vehicle.imageUrl}
                        alt={`${res.vehicle?.brand} ${res.vehicle?.model}`}
                        className="w-20 h-14 object-cover rounded hidden sm:block"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">
                          {res.vehicle?.brand} {res.vehicle?.model}
                        </h3>
                        <Badge variant={statusVariant[res.status]} className="text-xs">
                          {t(`status.${res.status}`, locale)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {res.customer?.firstName} {res.customer?.lastName} — {res.customer?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(res.pickupDate)} → {formatDate(res.returnDate)} | {res.pickupLocation}
                      </p>
                    </div>
                  </div>

                  {/* Price + Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-primary whitespace-nowrap">
                      {formatCurrency(res.totalCalculatedPrice)}
                    </span>
                    <div className="flex gap-1">
                      {res.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => confirmMutation.mutate(res.id)}
                            disabled={confirmMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t("adminRes.confirm", locale)}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelMutation.mutate(res.id)}
                            disabled={cancelMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {t("adminRes.cancel", locale)}
                          </Button>
                        </>
                      )}
                      {res.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => completeMutation.mutate(res.id)}
                          disabled={completeMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          {t("adminRes.return", locale)}
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
