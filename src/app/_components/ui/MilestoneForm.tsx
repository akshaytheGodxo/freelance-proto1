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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Add Milestone</h2>
        <input type="text" placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <input type="date" onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
        <input type="number" placeholder="Amount" onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
        <Button onClick={handleSubmit} className="mt-4 w-full">Submit</Button>
        <Button onClick={onClose} className="mt-2 w-full bg-gray-700">Cancel</Button>
      </div>
    </div>
  );
};

export default MilestoneForm;
