"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const milestoneId = searchParams.get("milestoneId");
  const employerId = searchParams.get("employerId");
  const freelancerId = searchParams.get("freelancerId");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const sendNotification = trpc.notif.sendNotification.useMutation({
    onSuccess: () => {
      setSuccessMessage("✅ Notification sent successfully!");
      setLoading(false);
    },
    onError: (error) => {
      console.error("❌ Notification Error:", error.message);
      setSuccessMessage("❌ Failed to send notification.");
      setLoading(false);
    },
  });

  const handleSendNotification = () => {
    if (!milestoneId || !employerId || !freelancerId || !amount) {
      setSuccessMessage("❌ Missing payment details.");
      return;
    }

    setLoading(true);
    sendNotification.mutate({
      userId: freelancerId,
      message: `🎉 Payment of $${amount} has been completed for your milestone!`,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
      <h1 className="text-3xl font-bold">✅ Payment Successful!</h1>
      <p className="text-gray-400 mt-2">Click below to notify your freelancer.</p>

      <button
        onClick={handleSendNotification}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>

      {successMessage && <p className="mt-4 text-lg">{successMessage}</p>}
    </div>
  );
};

export default PaymentSuccess;
