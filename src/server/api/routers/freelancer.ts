import { z } from "zod";
import bcrypt from "bcryptjs";
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const freelancerRouter = createTRPCRouter({
    register: publicProcedure
        .input(
            z.object({
                name: z.string().min(2, "Name is too short"),
                email: z.string().email("Invalid email"),
                password: z.string().min(6, "Password must be at least 6 characters"),
                rate: z.number().min(1, "Rate must be greater than 0"),
                experience: z.number().min(0, "Experience cannot be negative"),
                projects: z.number().min(0, "Projects cannot be negative"),
                skills: z.array(z.string()).nonempty("Skills cannot be empty"), // Stored as an array
                education: z.string().min(2, "Education must be valid"),
                avatar: z.string().url("Invalid avatar URL"),
                bg: z.string().url("Invalid background URL"),
            })
        )
        .mutation(async ({ input }) => {
            // Check if user already exists
            const existingUser = await db.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // Create user first
            const user = await db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                },
            });

            // Create freelancer profile
            const freelancer = await db.freelancer.create({
                data: {
                    name: input.name,
                    rate: input.rate,
                    rating: 5.0, // Default rating (can be changed later)
                    experience: input.experience,
                    projects: input.projects,
                    skills: input.skills, // Stored as a PostgreSQL text[]
                    education: input.education,
                    avatar: input.avatar,
                    bg: input.bg,
                    user: {
                        connect: { id: user.id }, // Linking freelancer to the user
                    },
                },
            });

            return { success: true, freelancer };
        }),


        showFreelancers: publicProcedure.query(async () => {
            return await db.freelancer.findMany();
          }),

          showProfile: publicProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input }) => {
              const freelancer = await db.freelancer.findUnique({
                  where: { id: input.id },
              });
  
              if (!freelancer) {
                  throw new Error("Freelancer not found");
              }
  
              return freelancer;
          }),
          
});
