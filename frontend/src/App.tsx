import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { VehicleCatalog } from "@/features/catalog/VehicleCatalog";
import { BookingWizard } from "@/features/booking/BookingWizard";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { MyReservations } from "@/features/reservations/MyReservations";
import { AdminDashboard } from "@/features/dashboard/AdminDashboard";
import { AdminVehicles } from "@/features/vehicles/AdminVehicles";
import { AdminReservations } from "@/features/reservations/AdminReservations";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<VehicleCatalog />} />
            <Route path="/booking" element={<BookingWizard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
