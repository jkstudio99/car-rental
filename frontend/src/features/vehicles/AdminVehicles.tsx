import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Car } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";
import type { Vehicle, ApiResponse, VehicleCategory } from "@/types";

const statusColors: Record<string, "success" | "destructive" | "warning"> = {
  AVAILABLE: "success",
  RENTED: "destructive",
  MAINTENANCE: "warning",
};

const emptyForm = {
  plateNo: "",
  brand: "",
  model: "",
  category: "SEDAN" as VehicleCategory,
  dailyPrice: 0,
  imageUrl: "",
};

export function AdminVehicles() {
  const { locale } = useLocaleStore();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Vehicle[]>>("/vehicles");
      return res.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        await api.patch(`/vehicles/${editId}`, form);
      } else {
        await api.post("/vehicles", form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/vehicles/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (v: Vehicle) => {
    setForm({
      plateNo: v.plateNo,
      brand: v.brand,
      model: v.model,
      category: v.category,
      dailyPrice: v.dailyPrice,
      imageUrl: v.imageUrl || "",
    });
    setEditId(v.id);
    setShowForm(true);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t("adminVeh.title", locale)}</h1>
          <p className="text-muted-foreground">{vehicles.length} {t("adminVeh.vehiclesInFleet", locale)}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-1" />
          {t("adminVeh.addVehicle", locale)}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editId ? t("adminVeh.editVehicle", locale) : t("adminVeh.addNew", locale)}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <Input placeholder={t("adminVeh.plateNo", locale)} value={form.plateNo} onChange={(e) => updateField("plateNo", e.target.value)} required />
              <Input placeholder={t("adminVeh.brand", locale)} value={form.brand} onChange={(e) => updateField("brand", e.target.value)} required />
              <Input placeholder={t("adminVeh.model", locale)} value={form.model} onChange={(e) => updateField("model", e.target.value)} required />
              <Select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                options={[
                  { value: "SEDAN", label: "Sedan" },
                  { value: "SUV", label: "SUV" },
                  { value: "VAN", label: "Van" },
                ]}
              />
              <Input type="number" placeholder={t("adminVeh.dailyPrice", locale)} value={form.dailyPrice || ""} onChange={(e) => updateField("dailyPrice", Number(e.target.value))} required min={0} />
              <Input placeholder={t("adminVeh.imageUrl", locale)} value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />
              <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? t("adminVeh.saving", locale) : editId ? t("adminVeh.update", locale) : t("adminVeh.create", locale)}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>{t("common.cancel", locale)}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <CardContent className="p-4"><div className="h-4 bg-muted rounded w-3/4" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="relative h-40 bg-muted">
                {v.imageUrl ? (
                  <img src={v.imageUrl} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><Car className="h-12 w-12 text-muted-foreground" /></div>
                )}
                <Badge variant={statusColors[v.status]} className="absolute top-2 right-2">{t(`status.${v.status}`, locale)}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{v.brand} {v.model}</h3>
                <p className="text-sm text-muted-foreground">{v.plateNo} · {v.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-primary">{formatCurrency(v.dailyPrice)}/day</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(v)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(v.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
