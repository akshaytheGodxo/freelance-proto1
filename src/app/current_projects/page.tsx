"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/_components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconChartLine } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/app/_components/ui/button";
import MilestoneForm from "@/app/_components/ui/MilestoneForm";

export function OnGoingProjects() {
  const router = useRouter();
  const session = useSession();
  const email = session.data?.user?.email;
  const id = session.data?.user.id
  console.log(id);

  const {data: employer} = trpc.empl.getEmployerByUserId.useQuery({ userId: id ?? "" });

  const employerId = employer?.id;
  console.log(employerId);
  // Fetch ongoing projects for the employer
  const { data: projects, isLoading } = trpc.empl.getHiredFreelancers.useQuery({ employerId:employerId ?? "" });

  const [openMilestone, setOpenMilestone] = useState<string | null>(null);
    console.log(projects);
  const logout = () => {
    router.push("/api/auth/signout");
  };

  const links = [
    { label: "Dashboard", href: "#", icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" /> },
    { label: "Profile", href: "#", icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" /> },
    { label: "Settings", href: "#", icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-200" /> },
    { label: "Ongoing Projects", href: "/manage-jobs", icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-200" /> },
    {
      label: "Logout",
      href: "/api/auth/signout",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-200" onClick={logout} />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-1 flex-col md:flex-row overflow-hidden border border-neutral-700 bg-neutral-800 text-white h-screen">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: session.data?.user?.name ?? "User",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Ongoing Projects</h1>

        {isLoading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : projects?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="p-6 bg-neutral-900 rounded-lg shadow-lg transition hover:scale-105"
              >
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-gray-400 mt-2">{project.description}</p>

                {/* Freelancer Info */}
                <div className="flex items-center gap-4 mt-4">
                  <Image
                    src={project.freelancer.avatar}
                    alt={project.freelancer.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{project.freelancer.name}</p>
                    <p className="text-sm text-gray-400">{project.freelancer.experience} years experience</p>
                  </div>
                </div>

                {/* Project Status */}
                <p className={`mt-4 text-sm font-semibold ${project.status === "in-progress" ? "text-yellow-400" : "text-green-400"}`}>
                  {project.status === "in-progress" ? "Ongoing" : "Completed"}
                </p>

                {/* View Milestones Button */}
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition" asChild>
                  <Link href={`/projects/${project.id}`}>View Milestones</Link>
                </Button>

                {/* Give Milestone Button */}
                <Button
                  className="mt-2 w-full bg-green-600 hover:bg-green-700 transition"
                  onClick={() => setOpenMilestone(project.id)}
                >
                  Give Milestone
                </Button>

                {/* Milestone Form Popup */}
                {openMilestone === project.id && (
                  <MilestoneForm projectId={project.id} onClose={() => setOpenMilestone(null)} />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have no ongoing projects.</p>
        )}
      </div>
    </div>
  );
}

export const Logo = () => {
    return (
      <Link
        href="#"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      >
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-black dark:text-white"
        >
          Acet Labs
        </motion.span>
      </Link>
    );
  };
  export const LogoIcon= () => {
    return (
      <Link
        href="#"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      >
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      </Link>
    );
  };
  

export default OnGoingProjects;
