import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";
import { trpc } from "@/lib/trpc";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const milestoneId = paymentIntent.metadata?.milestoneId;
      const employerId = paymentIntent.metadata?.employerId;
      const freelancerId = paymentIntent.metadata?.freelancerId;

      if (!milestoneId || !employerId || !freelancerId) {
        console.error("❌ Missing metadata in Stripe payment.");
        return NextResponse.json({ error: "Invalid Payment Metadata" }, { status: 400 });
      }

      // ✅ Save Payment in Database
      await db.payment.create({
        data: {
          milestoneId,
          employerId,
          freelancerId,
          amount: paymentIntent.amount_received / 100, // Convert from cents
          status: "completed",
        },
      });

      // ✅ Mark Milestone as Paid
      await db.milestone.update({
        where: { id: milestoneId },
        data: { status: "paid" },
      });

      // ✅ Send Notification to Freelancer via tRPC
      trpc.notif.sendNotification.useMutation({
        userId: freelancerId,
        message: `🎉 Payment of $${paymentIntent.amount_received / 100} has been completed for your milestone!`,
      });

      console.log(`✅ Payment recorded for Milestone ${milestoneId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
