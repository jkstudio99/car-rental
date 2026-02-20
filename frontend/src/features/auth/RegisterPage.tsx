import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, Car } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";

export function RegisterPage() {
  const navigate = useNavigate();
  const { locale } = useLocaleStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    drivingLicense: "",
    addressText: "",
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/register", form);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        navigate("/login");
      }
    },
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("auth.createAccount", locale)}</CardTitle>
          <CardDescription>{t("auth.registerDesc", locale)}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.firstName", locale)}</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.lastName", locale)}</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.email", locale)}</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.password", locale)}</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.phone", locale)}</label>
              <Input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.drivingLicense", locale)}</label>
              <Input
                value={form.drivingLicense}
                onChange={(e) => updateField("drivingLicense", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.address", locale)}</label>
              <Input
                value={form.addressText}
                onChange={(e) => updateField("addressText", e.target.value)}
              />
            </div>

            {registerMutation.isError && (
              <p className="text-sm text-destructive">
                {t("auth.registerFailed", locale)}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {registerMutation.isPending ? t("auth.creating", locale) : t("auth.createAccount", locale)}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.hasAccount", locale)}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t("auth.signIn", locale)}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
