import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc"; // ⬅ Change to publicProcedure
import { z } from "zod";
import { db } from "@/server/db";
export const notificationRouter = createTRPCRouter({
  sendNotification: protectedProcedure
  .input(
    z.object({
      userId: z.string().optional(),  // ✅ userId is optional
      freelancerId: z.string().optional(), // ✅ freelancerId is optional
      message: z.string().min(1, "Message cannot be empty"), // ✅ Ensure message is not empty
    })
  )
  .mutation(async ({ input }) => {
    try {
      console.log("📡 Sending Notification Request...");
      console.log("🔔 userId:", input.userId);
      console.log("🔔 freelancerId:", input.freelancerId);
      console.log("🔔 Message:", input.message);

      // ✅ Ensure at least one valid ID is provided
      if (!input.userId && !input.freelancerId) {
        throw new Error("❌ BAD_REQUEST: Missing both userId and freelancerId!");
      }

      // ✅ Check if the user or freelancer exists
      let existingUser = input.userId
        ? await db.user.findUnique({ where: { id: input.userId } })
        : null;

      let existingFreelancer = input.freelancerId
        ? await db.freelancer.findUnique({ where: { id: input.freelancerId } })
        : null;

      if (!existingUser && !existingFreelancer) {
        console.error("❌ BAD_REQUEST: No valid user or freelancer found!");
        throw new Error("❌ BAD_REQUEST: Invalid userId or freelancerId.");
      }

      // ✅ Create Notification
      const notification = await db.notification.create({
        data: {
          userId: existingUser ? input.userId : null,
          freelancerId: existingFreelancer ? input.freelancerId : null,
          message: input.message,
        },
      });

      console.log("✅ Notification Created:", notification);
      return notification;
    } catch (error) {
      console.error("❌ Failed to send notification:", error.message);
      throw new Error(error.message);
    }
  }),

});
