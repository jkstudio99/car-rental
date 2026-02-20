import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LogIn, Car } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState<"CUSTOMER" | "EMPLOYEE">("CUSTOMER");
  const { locale } = useLocaleStore();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password, loginAs });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.user, data.data.token);
        const role = data.data.user.role;
        if (role === "ADMIN" || role === "STAFF") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("auth.welcomeBack", locale)}</CardTitle>
          <CardDescription>{t("auth.signInDesc", locale)}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate();
            }}
            className="space-y-4"
          >
            {/* Login As Toggle */}
            <div className="flex rounded-lg border overflow-hidden">
              <button
                type="button"
                onClick={() => setLoginAs("CUSTOMER")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  loginAs === "CUSTOMER"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t("auth.customer", locale)}
              </button>
              <button
                type="button"
                onClick={() => setLoginAs("EMPLOYEE")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  loginAs === "EMPLOYEE"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t("auth.employee", locale)}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.email", locale)}</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.password", locale)}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-destructive">
                {t("auth.invalidCredentials", locale)}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loginMutation.isPending ? t("auth.signingIn", locale) : t("auth.signIn", locale)}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.noAccount", locale)}{" "}
              <Link to="/register" className="text-primary hover:underline">
                {t("auth.register", locale)}
              </Link>
            </p>

            {/* Demo Credentials */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center mb-2">
                {t("auth.demoCredentials", locale)}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  className="p-2 rounded border hover:bg-muted text-left"
                  onClick={() => {
                    setEmail("admin@carrental.com");
                    setPassword("admin123");
                    setLoginAs("EMPLOYEE");
                  }}
                >
                  <p className="font-medium">Admin</p>
                  <p className="text-muted-foreground">admin@carrental.com</p>
                </button>
                <button
                  type="button"
                  className="p-2 rounded border hover:bg-muted text-left"
                  onClick={() => {
                    setEmail("wichai@email.com");
                    setPassword("customer123");
                    setLoginAs("CUSTOMER");
                  }}
                >
                  <p className="font-medium">Customer</p>
                  <p className="text-muted-foreground">wichai@email.com</p>
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
