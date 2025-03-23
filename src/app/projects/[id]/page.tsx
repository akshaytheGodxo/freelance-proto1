"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/app/_components/ui/button";
import { motion } from "framer-motion";

const ViewMilestones = () => {
  const params = useParams();
  const projectId = params.id as string;

  console.log("Project ID:", projectId);

  // ✅ Fetch project details to get employerId & freelancerId
  const { data: project, isLoading: isProjectLoading } = trpc.empl.getProjectById.useQuery({
    projectId: projectId,
  });

  // ✅ Fetch milestones for the project
  const { data: milestones, isLoading: isMilestoneLoading } = trpc.empl.getProjectMilestones.useQuery({
    projectId: projectId,
  });

  const router = useRouter();

  if (isProjectLoading || isMilestoneLoading) return <p className="text-gray-400 text-center mt-10">Loading milestones...</p>;
  if (!milestones?.length) return <p className="text-gray-400 text-center mt-10">No milestones found.</p>;

  return (
    <div className="p-6 bg-neutral-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Project Milestones</h1>

      <div className="space-y-6">
        {milestones.map((milestone) => (
          <motion.div key={milestone.id} className="p-4 bg-neutral-900 rounded-lg shadow-lg transition hover:scale-105">
            <h2 className="text-xl font-semibold">{milestone.description}</h2>
            <p className="text-gray-400 text-sm">Deadline: {new Date(milestone.deadline).toLocaleDateString()}</p>
            <p className="text-green-400 font-bold">${milestone.amount}</p>

            <p
              className={`mt-2 text-sm font-bold ${
                milestone.status === "pending" ? "text-yellow-400" : milestone.status === "completed" ? "text-green-400" : "text-blue-400"
              }`}
            >
              {milestone.status}
            </p>

            {/* ✅ Pay Button (Enabled Only for Completed Milestones) */}
            <Button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition"
              disabled={milestone.status === "paid"}
              onClick={() => {
                if (!project?.employerId || !project?.freelancerId) {
                  console.error("❌ Missing employerId or freelancerId");
                  return;
                }

                router.push(
                  `/payement-checkout?amount=${milestone.amount}&milestoneId=${milestone.id}&employerId=${project.employerId}&freelancerId=${project.freelancerId}`
                );
              }}
            >
              {milestone.status === "completed" ? "Pay Now" : "Pending Completion"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ViewMilestones;
