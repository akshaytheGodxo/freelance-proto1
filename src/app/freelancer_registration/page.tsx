"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
const freelancerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rate: z.number().min(1, "Rate must be greater than 0"),
  experience: z.number().min(0, "Experience cannot be negative"),
  projects: z.number().min(0, "Projects cannot be negative"),
  skills: z.string().min(1, "Enter at least one skill"), // Stored as comma-separated
  education: z.string().min(2, "Education must be valid"),
  avatar: z.string().url("Invalid avatar URL"),
  bg: z.string().url("Invalid background URL"),
});

type FreelancerFormData = z.infer<typeof freelancerSchema>;

export default function FreelancerRegisterForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FreelancerFormData>({
    resolver: zodResolver(freelancerSchema),
  });

  const mutation = trpc.frel.register.useMutation();

  const onSubmit = async (data: FreelancerFormData) => {
    try {
      await mutation.mutateAsync({
        ...data,
        skills: data.skills.split(",").map(skill => skill.trim()), // Convert to array
      });
      alert("Freelancer registered successfully!");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Freelancer Registration</h2>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input {...register("name")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block">Email</label>
          <input type="email" {...register("email")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block">Password</label>
          <input type="password" {...register("password")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.password?.message}</p>
        </div>

        <div>
          <label className="block">Rate (per hour)</label>
          <input type="number" {...register("rate", { valueAsNumber: true })} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.rate?.message}</p>
        </div>

        <div>
          <label className="block">Experience (years)</label>
          <input type="number" {...register("experience", { valueAsNumber: true })} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.experience?.message}</p>
        </div>

        <div>
          <label className="block">Projects Completed</label>
          <input type="number" {...register("projects", { valueAsNumber: true })} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.projects?.message}</p>
        </div>

        <div>
          <label className="block">Skills (comma-separated)</label>
          <input {...register("skills")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.skills?.message}</p>
        </div>

        <div>
          <label className="block">Education</label>
          <input {...register("education")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.education?.message}</p>
        </div>

        <div>
          <label className="block">Avatar URL</label>
          <input type="url" {...register("avatar")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.avatar?.message}</p>
        </div>

        <div>
          <label className="block">Background Image URL</label>
          <input type="url" {...register("bg")} className="w-full p-2 rounded bg-gray-700" />
          <p className="text-red-400">{errors.bg?.message}</p>
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
