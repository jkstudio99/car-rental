import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import { CalendarDays, MapPin } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/stores/booking.store";
import type { ApiResponse } from "@/types";
import "react-day-picker/style.css";

interface BookedRange {
  pickupDate: string;
  returnDate: string;
  status: string;
}

export function DateSelection() {
  const {
    selectedVehicle,
    pickupDate,
    returnDate,
    pickupLocation,
    totalPrice,
    setDates,
    setPickupLocation,
    setStep,
  } = useBookingStore();

  const [range, setRange] = useState<{ from?: Date; to?: Date }>({
    from: pickupDate || undefined,
    to: returnDate || undefined,
  });

  const { data: bookedRanges = [] } = useQuery({
    queryKey: ["vehicles", selectedVehicle?.id, "availability"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<BookedRange[]>>(
        `/vehicles/${selectedVehicle?.id}/availability`
      );
      return res.data.data || [];
    },
    enabled: !!selectedVehicle?.id,
    staleTime: 60 * 1000,
  });

  const disabledDays = useMemo(() => {
    const disabled: Date[] = [];
    for (const range of bookedRanges) {
      const start = new Date(range.pickupDate);
      const end = new Date(range.returnDate);
      const current = new Date(start);
      while (current <= end) {
        disabled.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }
    return disabled;
  }, [bookedRanges]);

  const handleSelect = (selected: { from?: Date; to?: Date } | undefined) => {
    if (!selected) return;
    setRange(selected);
    if (selected.from && selected.to) {
      setDates(selected.from, selected.to);
    }
  };

  const canProceed = pickupDate && returnDate && pickupLocation.trim().length > 0;

  const days = pickupDate && returnDate
    ? Math.max(Math.ceil((returnDate.getTime() - pickupDate.getTime()) / 86400000), 1)
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            Select Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <DayPicker
            mode="range"
            selected={range as { from: Date; to: Date }}
            onSelect={handleSelect as (range: { from?: Date; to?: Date } | undefined) => void}
            disabled={[{ before: new Date() }, ...disabledDays]}
            numberOfMonths={1}
            showOutsideDays
          />
        </CardContent>
      </Card>

      {/* Summary & Location */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVehicle && (
              <div className="flex gap-4">
                {selectedVehicle.imageUrl && (
                  <img
                    src={selectedVehicle.imageUrl}
                    alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(selectedVehicle.dailyPrice)}/day
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              Pickup Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g. Suvarnabhumi Airport"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </CardContent>
        </Card>

        {days > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between text-sm">
                <span>{days} day(s) rental</span>
                <span className="font-semibold">{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => setStep(3)}
            disabled={!canProceed}
            className="flex-1"
          >
            Continue to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
