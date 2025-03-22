"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { HiringForm } from "@/app/_components/employers/hiring";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const FreelancerProfile = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const employerName = session.data?.user?.name ?? "";

  // Fetch Freelancer Data
  const { data: freelancer, isLoading, error } = trpc.frel.showProfile.useQuery({ id: params.id });

  const [open, setOpen] = useState(false);

  if (isLoading) return <p className="text-gray-400 text-center mt-10">Loading...</p>;
  if (error || !freelancer) return <p className="text-red-500 text-center mt-10">Error: Freelancer not found</p>;

  return (
    <div className="min-h-screen bg-neutral-800 py-8 px-4 text-white">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-neutral-900 shadow-lg rounded-lg overflow-hidden">
        {/* Background Image */}
        <div className="relative w-full h-48 md:h-64">
          <Image src={freelancer.bg} alt="Background" fill className="object-cover opacity-75" />
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center">
          <Avatar className="h-24 w-24 mx-auto border-4 border-neutral-700 shadow-md -mt-16">
            <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
            <AvatarFallback>{freelancer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mt-4">{freelancer.name}</h1>
          <p className="text-gray-400">{freelancer.education}</p>

          {/* Freelancer Info Cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className="bg-neutral-800 p-4 rounded-lg shadow" whileHover={{ scale: 1.05 }}>
              <p className="text-sm text-gray-400">Experience</p>
              <p className="text-lg font-semibold text-white">{freelancer.experience} years</p>
            </motion.div>

            <motion.div className="bg-neutral-800 p-4 rounded-lg shadow" whileHover={{ scale: 1.05 }}>
              <p className="text-sm text-gray-400">Projects Completed</p>
              <p className="text-lg font-semibold text-white">{freelancer.projects}</p>
            </motion.div>

            <motion.div className="bg-neutral-800 p-4 rounded-lg shadow" whileHover={{ scale: 1.05 }}>
              <p className="text-sm text-gray-400">Rate</p>
              <p className="text-lg font-semibold text-white">${freelancer.rate}/hr</p>
            </motion.div>
          </div>

          {/* Skills Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-300">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {freelancer.skills.map((skill, index) => (
                <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Hire Button */}
          <div className="mt-6">
            <Button
              className="bg-neutral-600 hover:bg-neutral-700 px-6 py-3 rounded-lg text-lg transition shadow-lg"
              onClick={() => setOpen(true)}
            >
              Hire Me
            </Button>
          </div>
        </div>
      </div>

      {/* Hiring Form (Popup) */}
      {open && (
        <HiringForm
          onClose={() => setOpen(false)}
          freelancerId={freelancer.id}
          employerName={employerName}
        />
      )}
    </div>
  );
};

export default FreelancerProfile;
