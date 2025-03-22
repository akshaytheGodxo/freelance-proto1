"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

export const HiringForm = ({
  freelancerId,
  employerName,
  onClose,
}: {
  freelancerId: string;
  employerName: string;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    amount: "",
    deadline: "per-month",
  });

  const mutation = trpc.empl.hireFreelancer.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message || !formData.amount) {
      alert("Please fill in all fields.");
      return;
    }

    mutation.mutate(
      {
        freelancerId,
        employerName,
        amount: Number(formData.amount),
        deadline: formData.deadline,
        title: formData.title,
        message: formData.message,
      },
      {
        onSuccess: () => {
          alert("Request sent successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Error:", error);
          alert("Failed to send request.");
        },
      }
    );
  };

  return (
    <>
      {/* Background Overlay with Smooth Fade-In */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Popup Card with Slide-In Animation */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="p-6 w-full max-w-md shadow-lg bg-neutral-800 text-white rounded-lg">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Hire Freelancer</h2>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Job Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter job title..."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-neutral-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Job Description</label>
                <textarea
                  name="message"
                  placeholder="Describe the job..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-neutral-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Budget ($)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount..."
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-neutral-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">Deadline</label>
                <select
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-neutral-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per-month">Per Month</option>
                  <option value="one-time">One-Time</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <Button type="submit" disabled={mutation.isLoading} className="w-full bg-blue-600 hover:bg-blue-700 transition">
                {mutation.isLoading ? "Sending..." : "Send Request"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={onClose} className="border-gray-500 text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};
