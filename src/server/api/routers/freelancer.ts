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
            

            // Create user first
            const user = await db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: input.password,
                    accountType: "Freelancer",
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
                    avatar: "/john.webp",
                    bg: "/bg1.png",
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

          getOffers: publicProcedure
          .input(
            z.object({
              email: z.string().email(),
            })
          )
          .query(async ({ input }) => {
            try {
              // Get freelancer ID from User's email
              const freelancer = await db.user.findUnique({
                where: { email: input.email },
                select: { freelancer: { select: { id: true } } },
              });
      
              if (!freelancer?.freelancer) {
                throw new Error("Freelancer profile not found");
              }
      
              // Fetch requests (offers) for this freelancer
              const offers = await db.requests.findMany({
                where: { freelancerId: freelancer.freelancer.id, status: "pending" },
                select: {
                  id: true,
                  title: true,
                  message: true,
                  amount: true,
                  deadline: true,
                  employer: {
                    select: {
                      companyName: true,
                    },
                  },
                  createdAt: true,
                },
                orderBy: { createdAt: "desc" },
              });
      
              return offers;
            } catch (error) {
              console.error("Error fetching offers:", error);
              throw new Error("Failed to fetch offers");
            }
          }),
      
          acceptOffer: publicProcedure
          .input(
            z.object({
              offerId: z.string(),
            })
          )
          .mutation(async ({ input }) => {
            try {
              // Get the offer details
              const offer = await db.requests.findUnique({
                where: { id: input.offerId },
                include: { freelancer: true, employer: true },
              });
        
              if (!offer) throw new Error("Offer not found");
        
              // Create a new project
              await db.projects.create({
                data: {
                  freelancerId: offer.freelancerId,
                  employerId: offer.employerId,
                  title: offer.title,
                  description: offer.message,
                  amount: offer.amount,
                  deadline: offer.deadline,
                },
              });
        
              // Mark the offer as accepted
              await db.requests.update({
                where: { id: input.offerId },
                data: { status: "accepted" },
              });
        
              return { success: true, message: "Offer accepted and project created!" };
            } catch (error) {
              console.error("Error accepting offer:", error);
              throw new Error("Failed to accept offer");
            }
          }),
        
        denyOffer: publicProcedure
          .input(
            z.object({
              offerId: z.string(),
            })
          )
          .mutation(async ({ input }) => {
            try {
              await db.requests.update({
                where: { id: input.offerId },
                data: { status: "rejected" },
              });
      
              return { success: true, message: "Offer rejected!" };
            } catch (error) {
              console.error("Error rejecting offer:", error);
              throw new Error("Failed to reject offer");
            }
          }),
      
          getProjects: publicProcedure
          .input(
            z.object({
              email: z.string().email(),
            })
          )
          .query(async ({ input }) => {
            try {
              // Get Freelancer ID
              const freelancer = await db.user.findUnique({
                where: { email: input.email },
                select: { freelancer: { select: { id: true } } },
              });
        
              if (!freelancer?.freelancer) {
                throw new Error("Freelancer profile not found");
              }
        
              // Fetch projects linked to this freelancer
              const projects = await db.projects.findMany({
                where: { freelancerId: freelancer.freelancer.id },
                orderBy: { createdAt: "desc" },
              });
        
              return projects;
            } catch (error) {
              console.error("Error fetching projects:", error);
              throw new Error("Failed to fetch projects");
            }
          }),
          getMilestones: publicProcedure
          .input(z.object({ freelancerId: z.string() }))
          .query(async ({ input }) => {
            return await db.milestone.findMany({
              where: {
                project: {
                  freelancerId: input.freelancerId,
                },
              },
            });
          }),

          markMilestoneComplete: publicProcedure
  .input(z.object({ milestoneId: z.string() }))
  .mutation(async ({ input }) => {
    return await db.milestone.update({
      where: { id: input.milestoneId },
      data: { status: "completed" },
    });
  }),

        
});
