"use client";

import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const handleSignin = async () => {
    await signIn("credentials", {callbackUrl: "/employer_registration"})
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white gap-6">
      {/* Sign In Card */}
      <Card className="p-6 w-80 shadow-lg bg-gray-800 text-center">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sign In</h2>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => signIn()}>Sign In</Button>
        </CardContent>
      </Card>

      {/* Create Account Card */}
      <Card className="p-6 w-80 shadow-lg bg-gray-800 text-center">
        <CardHeader>
          <h2 className="text-xl font-semibold">Create Account</h2>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/employer_registration")}>Create Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}