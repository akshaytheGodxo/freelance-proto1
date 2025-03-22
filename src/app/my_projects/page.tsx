"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/app/_components/ui/button";
import { motion } from "framer-motion";

const MyProjects = () => {
    const markMilestoneComplete = trpc.frel.markMilestoneComplete.useMutation();
  const session = useSession();
  const freelancerEmail = session.data?.user?.email;

  const { data: projects, isLoading } = trpc.frel.getMyProjects.useQuery({ freelancerEmail: freelancerEmail ?? "" });

  if (isLoading) return <p className="text-gray-400 text-center mt-10">Loading projects...</p>;
  if (!projects?.length) return <p className="text-gray-400 text-center mt-10">No active projects.</p>;

  return (
    <div className="p-6 bg-neutral-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div key={project.id} className="p-6 bg-neutral-900 rounded-lg shadow-lg hover:scale-105 transition">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-400 mt-2">{project.description}</p>
            <p className="text-sm text-gray-500">Client: {project.employer.companyName}</p>

            {/* Milestones Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Milestones</h3>
              {project.milestones.length ? (
                <div className="mt-2 space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="bg-neutral-700 p-3 rounded-md">
                      <p className="text-sm">{milestone.description}</p>
                      <p className="text-xs text-gray-400">Deadline: {new Date(milestone.deadline).toLocaleDateString()}</p>
                      <p className="text-xs text-green-400 font-bold">${milestone.amount}</p>
                      <p className={`text-xs font-bold ${milestone.status === "pending" ? "text-yellow-400" : "text-green-400"}`}>
                        {milestone.status}
                      </p>

                      {/* Mark as Completed Button */}
                      {milestone.status === "pending" && (
                        <Button
                        className="mt-2 w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          markMilestoneComplete.mutate(
                            { milestoneId: milestone.id },
                            {
                              onSuccess: () => {
                                alert("Milestone marked as completed! ✅");
                                 
                              },
                              onError: (error) => {
                                console.error("Error marking milestone as completed:", error);
                                alert("Failed to mark milestone as completed ❌");
                              },
                            }
                          );
                        }}
                      >
                        Mark as Completed
                      </Button>
                      
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No milestones added.</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
