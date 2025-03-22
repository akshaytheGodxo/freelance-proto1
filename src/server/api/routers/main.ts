import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const mainRouter = createTRPCRouter({
    findAccount: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .query(async ({ input }) => {
            const email = input.email; // ✅ Correctly extracting the email

            const existingUser = await db.user.findFirst({
                where: { email },
                select: { accountType: true } // ✅ Only fetch `accountType`
            });

            if (!existingUser) {
                return { message: "User not found", accountType: null };
            }

            return {
                message: "Account Found",
                accountType: existingUser.accountType, // ✅ Correctly return only `accountType`
            };
        }),
});
