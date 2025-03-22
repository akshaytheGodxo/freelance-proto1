"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { HiringForm } from "@/app/_components/employers/hiring";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "next-auth/react";
const FreelancerProfile =  ({ params }: { params: { id: string } }) => {
  const session = useSession();
const userId = session.data?.user.id; // Might be undefined initially
const skipToken = "anbc";
const { data: freelancer, isLoading, error } = trpc.frel.showProfile.useQuery({ id: params.id });

const { data: employer } = trpc.empl.getEmployerByUserId.useQuery(
  userId ? { userId } : skipToken, // Only query when `userId` is available
);

console.log("Employer id:",employer?.id);
  const [open, setOpen] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error || !freelancer) return <p>Error: Freelancer not found</p>;

  return (
    <div className="p-4 relative">
      <div className="relative h-64 w-full">
        <Image src={freelancer.bg} alt="Background" fill className="object-cover" />
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
          <AvatarFallback>{freelancer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{freelancer.name}</h1>
          <p className="text-muted-foreground">{freelancer.education}</p>
        </div>
      </div>

      <p className="mt-4 text-lg">Experience: {freelancer.experience} years</p>
      <p className="mt-2 text-lg">Projects Completed: {freelancer.projects}</p>
      <p className="mt-2 text-lg">Rate: ${freelancer.rate}/hr</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {freelancer.skills.map((skill, index) => (
            <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={() => setOpen(true)}>Hire Me</Button>
      </div>

      {/* Render the HiringForm only when 'open' is true */}
      {open && <HiringForm onClose={() => setOpen(false)} freelancerId={freelancer.id} employerId={employer?.id ?? ""}/>}
    </div>
  );
};

export default FreelancerProfile;
