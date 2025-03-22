"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { trpc } from "@/lib/trpc";

export const HiringForm = ({
  freelancerId,
  employerId,
  onClose,
}: {
  freelancerId: string;
  employerId: string ;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    amount: "",
    deadline: "per-month",
  });

  const mutation = trpc.empl.hireFreelancer.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        employerId ? ,
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
          console.log(error);
          alert("Failed to send request.");
        },
      }
    );
  };

  return (
    <>
      {/* Background Blur Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" onClick={onClose}></div>

      {/* Popup Card */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md shadow-lg bg-gray-900 text-white relative">
          <CardHeader>
            <h2 className="text-xl font-semibold">Hire Freelancer</h2>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600"
                required
              />
              <textarea
                name="message"
                placeholder="Job Description"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Budget ($)"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600"
                required
              />
              <select
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600"
              >
                <option value="per-month">Per Month</option>
                <option value="one-time">One-Time</option>
                <option value="weekly">Weekly</option>
              </select>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Sending..." : "Send Request"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
