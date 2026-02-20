import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, QrCode, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";

export function BookingCheckout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    selectedVehicle,
    pickupDate,
    returnDate,
    pickupLocation,
    payMethod,
    totalPrice,
    downPayment,
    finalPayment,
    setPayMethod,
    setStep,
    reset,
  } = useBookingStore();

  const [success, setSuccess] = useState(false);

  const createReservation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/reservations", {
        customerId: user?.id,
        vehicleId: selectedVehicle?.id,
        pickupDate: pickupDate?.toISOString(),
        returnDate: returnDate?.toISOString(),
        pickupLocation,
        payMethod,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
    },
  });

  if (success) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="p-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Your reservation has been submitted. An admin will confirm it shortly.
          </p>
          <div className="flex gap-2 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                navigate("/");
              }}
            >
              Browse More
            </Button>
            <Button
              onClick={() => {
                reset();
                navigate("/my-reservations");
              }}
            >
              My Reservations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const days =
    pickupDate && returnDate
      ? Math.max(
          Math.ceil(
            (returnDate.getTime() - pickupDate.getTime()) / 86400000
          ),
          1
        )
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedVehicle && (
            <div className="flex gap-4">
              {selectedVehicle.imageUrl && (
                <img
                  src={selectedVehicle.imageUrl}
                  alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                  className="w-32 h-20 object-cover rounded"
                />
              )}
              <div>
                <p className="font-semibold text-lg">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </p>
                <Badge variant="secondary">{selectedVehicle.category}</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVehicle.plateNo}
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup Date</span>
              <span>{pickupDate ? formatDate(pickupDate.toISOString()) : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Return Date</span>
              <span>{returnDate ? formatDate(returnDate.toISOString()) : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>{days} day(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup Location</span>
              <span>{pickupLocation}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(selectedVehicle?.dailyPrice || 0)} x {days} days
              </span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Down Payment (30%)</span>
              <span className="font-medium text-primary">
                {formatCurrency(downPayment)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining at Pickup</span>
              <span>{formatCurrency(finalPayment)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setPayMethod("CREDIT_CARD")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                payMethod === "CREDIT_CARD"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <CreditCard className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, JCB
                </p>
              </div>
            </button>
            <button
              onClick={() => setPayMethod("PROMPTPAY")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                payMethod === "PROMPTPAY"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <QrCode className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">PromptPay</p>
                <p className="text-sm text-muted-foreground">
                  Scan QR code to pay
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => createReservation.mutate()}
            disabled={createReservation.isPending}
            className="flex-1"
          >
            {createReservation.isPending ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>

        {createReservation.isError && (
          <p className="text-sm text-destructive text-center">
            {(createReservation.error as Error)?.message || "Booking failed. Please try again."}
          </p>
        )}
      </div>
    </div>
  );
}
