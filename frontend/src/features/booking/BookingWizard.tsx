import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking.store";
import { DateSelection } from "./DateSelection";
import { BookingCheckout } from "./BookingCheckout";

const steps = [
  { id: 1, title: "Select Vehicle" },
  { id: 2, title: "Choose Dates" },
  { id: 3, title: "Checkout" },
];

export function BookingWizard() {
  const navigate = useNavigate();
  const { step, selectedVehicle } = useBookingStore();

  useEffect(() => {
    if (!selectedVehicle) {
      navigate("/");
    }
  }, [selectedVehicle, navigate]);

  if (!selectedVehicle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Stepper */}
      <nav className="flex items-center justify-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 transition-colors",
                step > s.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : step === s.id
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              )}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium hidden sm:inline",
                step >= s.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.title}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight className="mx-2 sm:mx-4 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </nav>

      {/* Step Content */}
      {step === 2 && <DateSelection />}
      {step === 3 && <BookingCheckout />}
    </div>
  );
}
