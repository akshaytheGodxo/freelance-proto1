"use client"; // ✅ Ensures this is a Client Component

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

interface CheckoutFormProps {
  milestoneId: string | null;
  employerId: string | null;
  freelancerId: string | null;
  amount: string | null;
}


const CheckoutForm: React.FC<CheckoutFormProps> = ({ milestoneId, employerId, freelancerId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not initialized.");
      setLoading(false);
      return;
    }

    const { error } = await elements.submit();
    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // Confirm payment
    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment-success?milestoneId=${milestoneId}&employerId=${employerId}&freelancerId=${freelancerId}&amount=${amount}` },
    });

    if (paymentError) {
      setErrorMessage(paymentError.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md bg-neutral-800 p-6 rounded-lg shadow-lg">
      <PaymentElement />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 mt-4 rounded-md transition"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
