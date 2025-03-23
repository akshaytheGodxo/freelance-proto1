"use client";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import * as motion from "framer-motion";

 const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#2b2b2b] text-white flex flex-col items-center justify-center p-6">
      {/* <motion.h1
        className="text-5xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Manage Your Freelance Business Efficiently
      </motion.h1> */}
      <p className="text-lg text-center max-w-2xl mb-6">
        A powerful, all-in-one platform to track your projects, clients, and finances effortlessly.
      </p>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg">
        Get Started
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="bg-[#333333] p-6 shadow-lg rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold">Project Tracking</h2>
            <p className="mt-2 text-gray-300">
              Stay on top of your deadlines and deliverables with our intuitive project management system.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#333333] p-6 shadow-lg rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold">Client Management</h2>
            <p className="mt-2 text-gray-300">
              Keep track of your clients, communication history, and ongoing projects in one place.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#333333] p-6 shadow-lg rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold">Finance Insights</h2>
            <p className="mt-2 text-gray-300">
              Monitor your income, expenses, and get financial insights to grow your business.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default LandingPage;