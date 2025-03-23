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


      // Create new employer user
      const user = await db.user.create({
        data: {
          email: company_mail,
          name: company_name,
          password: password,

          // Create related employer entry
          accountType: "Employer",
        }
      });

      const employer = await db.employer.create({
        data: {
          companyName: company_name,
          userId: user.id,
        }
      })

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


  hireFreelancer: publicProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        employerName: z.string(),
        amount: z.number(),
        deadline: z.string().optional().default("per-month"),
        title: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { freelancerId, employerName, amount, deadline, title, message } = input;

      // Check if employer exists
      console.log("Employer Name: ", employerName);

      const employer = await db.employer.findFirst({
        where: { companyName: employerName },
        select: { id: true } // ✅ Select employer ID
      });

      if (!employer) {
        throw new Error("Employer not found");
      }

      console.log("Employer ID Found: ", employer.id);

      // Create a hiring request
      const request = await db.requests.create({
        data: {
          freelancerId,
          employerId: employer.id, // ✅ Correctly assign employer ID
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
      return await db.employer.findFirst({
        where: { userId: input.userId },
      });
    }),
  getHiredFreelancers: publicProcedure
    .input(z.object({ employerId: z.string() }))
    .query(async ({ input }) => {
      return await db.projects.findMany({
        where: { employerId: input.employerId },
        include: { freelancer: true, milestones: true },
      });
    }),

  addMilestone: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        description: z.string(),
        deadline: z.date(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.milestone.create({
        data: {
          projectId: input.projectId,
          description: input.description,
          deadline: input.deadline,
          amount: input.amount,
        },
      });
    }),
  approveMilestonePayment: publicProcedure
    .input(z.object({ milestoneId: z.string() }))
    .mutation(async ({ input }) => {
      return await db.milestone.update({
        where: { id: input.milestoneId },
        data: { status: "approved" },
      });
    }),

    getProjectMilestones: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return await db.milestone.findMany({
        where: { projectId: input.projectId },
        orderBy: { deadline: "asc" },
      });
    }),
    getProjectById: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const project = await db.projects.findUnique({
        where: { id: input.projectId },
        select: {
          id: true,
          title: true,
          employerId: true,
          freelancerId: true,
        },
      });

      if (!project) throw new Error("Project not found");
      return project;
    }),
  });
