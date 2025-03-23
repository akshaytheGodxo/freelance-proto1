"use client";
import React, {useState} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {Bell, BellDot} from "lucide-react";
const FreeLanceDash = () => {
  const { data: session } = useSession();
  const email = session?.user?.email;

  // Fetch Offers
  const { data: offers, isLoading } = trpc.frel.getOffers.useQuery(
    { email },
    { enabled: !!email }
  );

  // Accept / Deny Offer
  const acceptOffer = trpc.frel.acceptOffer.useMutation();
  const denyOffer = trpc.frel.denyOffer.useMutation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleAccept = (offerId: string) => {
    acceptOffer.mutate({ offerId });
  };

  const handleDeny = (offerId: string) => {
    denyOffer.mutate({ offerId });
  };

  const { data: projects, isLoading: loadingProjects } = trpc.frel.getProjects.useQuery(
    { email },
    { enabled: !!email }
  );
  
  return (
    <div className="flex flex-col flex-1 p-6 space-y-6 text-white min-h-screen">
      {/* Header */}
      <motion.h1
        className="text-3xl font-extrabold text-center md:text-left"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Freelancer Dashboard
      </motion.h1>

      {/* Tabs for Navigation */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="flex justify-center md:justify-start  text-white rounded-lg p-2">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-md px-4 py-2 transition"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="showOffers"
            className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-md px-4 py-2 transition"
          >
            Show Offers
          </TabsTrigger>
          <TabsTrigger
  value="projects"
  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-md px-4 py-2 transition"
>
  Projects
</TabsTrigger>
<Button
            variant="ghost"
            className="ml-auto relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell />
            {showNotifications && (
              <motion.div
                className="absolute right-0 mt-2 w-72 bg-neutral-800 text-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-neutral-700 text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>New Notification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">You have recieved your payment.</p>
                    <p className="text-gray-500 text-sm">Now</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Button>
        </TabsList>

        {/* Overview Section */}
        <TabsContent value="dashboard">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="bg-neutral-700 text-white shadow-lg">
              <CardHeader>
                <CardTitle>Welcome, {session?.user?.name || "Freelancer"}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Manage your job requests and projects easily.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-700 text-white shadow-lg">
              <CardHeader>
                <CardTitle>Current Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">You have {offers?.length || 0} pending offers.</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Show Offers Section */}
        <TabsContent value="showOffers">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-center md:text-left">Your Offers</h2>

            {isLoading ? (
              <p className="text-gray-400">Loading offers...</p>
            ) : offers?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    className="p-6 bg-neutral-700 text-white border border-neutral-600 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-semibold">{offer.title}</h3>
                    <p className="text-gray-400">{offer.message}</p>
                    <p className="text-gray-300 font-bold">Budget: ${offer.amount}</p>
                    <p className="text-gray-400 text-sm">Deadline: {offer.deadline}</p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="success"
                        className="w-full transition hover:bg-green-600"
                        onClick={() => handleAccept(offer.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full transition hover:bg-red-600"
                        onClick={() => handleDeny(offer.id)}
                      >
                        Deny
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No offers available.</p>
            )}
          </motion.div>
        </TabsContent>
        <TabsContent value="projects">
  <motion.div className="flex flex-col gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="text-xl font-semibold text-center md:text-left">Your Projects</h2>

    {loadingProjects ? (
      <p className="text-gray-400">Loading projects...</p>
    ) : projects?.length ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="p-6 bg-neutral-700 text-white border border-neutral-600 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="text-gray-400">{project.description}</p>
            <p className="text-gray-300 font-bold">Budget: ${project.amount}</p>
            <p className="text-gray-400 text-sm">Deadline: {project.deadline}</p>
            <p className="text-sm text-green-400 font-semibold">Status: {project.status}</p>
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400">No projects yet.</p>
    )}
  </motion.div>
</TabsContent>

      </Tabs>
    </div>
  );
};

export default FreeLanceDash;
