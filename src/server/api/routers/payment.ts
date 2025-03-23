import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
export const paymentRouter = createTRPCRouter({
  // ✅ Save Payment to DB
  savePayment: protectedProcedure
    .input(
      z.object({
        milestoneId: z.string(),
        employerId: z.string(),
        freelancerId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const payment = await db.payment.create({
          data: {
            milestoneId: input.milestoneId,
            employerId: input.employerId,
            freelancerId: input.freelancerId,
            amount: input.amount,
            status: "completed",
          },
        });

        // ✅ Mark Milestone as Paid
        await db.milestone.update({
          where: { id: input.milestoneId },
          data: { status: "paid" },
        });

        console.log("💰 Payment saved:", payment);
        return payment;
      } catch (error) {
        console.error("❌ Failed to save payment:", error);
        throw new Error("Failed to save payment");
      }
    }),
});
