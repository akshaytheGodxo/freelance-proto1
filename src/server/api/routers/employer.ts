import { z } from "zod";
import bcrypt from "bcryptjs";
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const employerRouter = createTRPCRouter({
    register: publicProcedure
        .input(
            z.object({
                company_name: z.string().min(2, "Company name is too short"),
                company_mail: z.string().email(),
                password: z.string().min(4, "Password must be at least 4 characters"),
            })
        )
        .mutation(async ({ input }) => {
            const { company_name, company_mail, password } = input;

            // Check if employer already exists
            const existingUser = await db.user.findFirst({
                where: { email: company_mail }
            });

            if (existingUser) {
                throw new Error("Employer with this email already exists.");
            }

            // Hash password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new employer user
            const user = await db.user.create({
                data: {
                    email: company_mail,
                    name: company_name,
                    password: hashedPassword,
                    employer: { create: { companyName: company_name , } } // Create related employer entry
                }
            });

            

            return {
                message: "Employer registered successfully",
                userId: user.id,
            };
        }),


    showFreelancers: publicProcedure.query(async () => {
        try {
            const freelancers = await db.freelancer.findMany();
            return freelancers;
        } catch (error) {
            throw new Error("Failed to fetch freelancers");
        }
    }),


     hireFreelancer  : publicProcedure
        .input(
            z.object({
                freelancerId: z.string(),
                employerId: z.string(),
                amount: z.number(),
                deadline: z.string().optional().default("per-month"),
                title: z.string(),
                message: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { freelancerId, employerId, amount, deadline, title, message } = input;

            // Check if employer exists
            const employer = await db.employer.findFirst({
                where: { userId: employerId },
            });

            if (!employer) {
                throw new Error("Employer not found");
            }

            // Create a hiring request
            const request = await db.requests.create({
                data: {
                    freelancerId,
                    employerId,
                    amount,
                    deadline,
                    title,
                    message,
                    status: "pending",
                },
            });

            return request;
        }),



        getEmployerByUserId: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
          return await db.user.findFirst({
            where: { id: input.userId },
          });
        }),
    
});
