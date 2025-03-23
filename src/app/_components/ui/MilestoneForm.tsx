"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/app/_components/ui/button";

const MilestoneForm = ({ projectId, onClose }: { projectId: string; onClose: () => void }) => {
  const mutation = trpc.empl.addMilestone.useMutation();
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    amount: "",
  });

  const handleSubmit = () => {
    mutation.mutate({
      projectId,
      description: formData.description,
      deadline: new Date(formData.deadline),
      amount: Number(formData.amount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <h2 className="text-lg font-semibold text-white mb-4 text-center">Add Milestone</h2>

        {/* Form Fields */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Milestone Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 rounded-md bg-neutral-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
          />

          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full p-2 rounded-md bg-neutral-700 border border-gray-600 text-white focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Amount ($)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 rounded-md bg-neutral-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-5">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full mr-2" onClick={handleSubmit}>
            Submit
          </Button>
          <Button className="bg-gray-700 w-full ml-2" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneForm;
