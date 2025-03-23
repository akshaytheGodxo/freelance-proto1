import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";
import { trpc } from "@/lib/trpc";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    // ✅ Check if request has a valid JSON body
    if (!req.body) {
      console.error("❌ Error: Request body is empty!");
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    // ✅ Parse JSON safely
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("❌ Error: Invalid JSON input", error);
      return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
    }

    console.log("🔹 Received Request Body:", body);

    const { amount, metadata } = body;
    if (!amount || amount < 1) {
      console.error("❌ Invalid Amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    console.log("✅ Creating Payment Intent with amount:", amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: metadata || {},
    });

    console.log("✅ Payment Intent Created:", paymentIntent.client_secret);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("❌ Stripe Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
