"use client"; // ✅ Ensures this is a Client Component

import { useSearchParams } from "next/navigation";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/app/_components/ui/CheckoutForm";
const stripePromise = loadStripe("pk_test_51R5WTDCFKgrgEYa6GklKsRGdAECKkrJm2jNA6Am28w8INVObmPfw5TfgNvlnG4Ztqhl04gRp1ffsGHWMdNQPqIFC00EFZd1XAu");

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const milestoneId = searchParams.get("milestoneId");
  const employerId = searchParams.get("employerId");
  const freelancerId = searchParams.get("freelancerId");

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!amount || !milestoneId || !employerId || !freelancerId) return;
    
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        metadata: { milestoneId, employerId, freelancerId },
      }),
    })
    .then((res) => res.json())
    .then((data) => setClientSecret(data.clientSecret));
  }, [amount, milestoneId, employerId, freelancerId]);
  console.log("Amount: " , amount);
    console.log("mileStoneId: " , milestoneId);
    console.log("employerId: " , employerId);
    console.log("freelancerId: " , freelancerId);
  console.log("Client Secret",clientSecret);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="text-gray-400">Amount to Pay: ${amount}</p>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} milestoneId={milestoneId} employerId={employerId} freelancerId={freelancerId} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;
