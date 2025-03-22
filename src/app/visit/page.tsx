"use client";
import React, {useState} from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/_components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconChartLine 
  } from "@tabler/icons-react";
  import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Logo, LogoIcon } from "../dashboard/page";
import { useRouter } from "next/router";
import FreelancerProfile from "@/app/freelancers/[id]/page";
 function ShowEmployee() {


  const router = useRouter();
    const logout = () => {
      router.push("/api/auth/signout");
    }
    const links = [
        {
          label: "Dashboard",
          href: "#",
          icon: (
            <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Profile",
          href: "#",
          icon: (
            <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: "Settings",
          href: "#",
          icon: (
            <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
            label: "Post Acvtivity",
            href: "/manage-jobs",
            icon: (
                <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200"/>
            ),
        },
        {
          label: "Logout",
          href: "/api/auth/signout",
          icon: (
            <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" onClick={() => logout}/>
          ),
        },
      ];
    const [open, setOpen] = useState(false);
    return (
        <div className={cn("flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800", "h-screen")}>
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
                                label: "Akshay Singh",
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
                    <FreelancerProfile />
                </SidebarBody>
            </Sidebar>
        </div>
    );
}

export default ShowEmployee;