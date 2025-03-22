"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../_components/ui/card";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
const Page = () => {
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const registerEmployer = trpc.empl.register.useMutation({
        onSuccess: (data) => {
            setMessage(data.message);
            reset();
        },
        onError: (error) => {
            setMessage(error.message);
        },
    });

    const onSubmit = async (formData: any) => {
        setLoading(true);
        setMessage("");
        const hashedPassword = await bcrypt.hash(formData.password, 10);

        try {
            await registerEmployer.mutateAsync({
                company_name: formData.company_name,
                company_mail: formData.company_mail,
                password: hashedPassword
            });

            router.push("/dashboard");

        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#2b2b2b] p-6 text-white">
            <Card className="w-96 bg-[#333333] p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Employer Registration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input {...register("company_name")} placeholder="Company Name" className="bg-[#444444] text-white border-none focus:ring-2 focus:ring-gray-500" />
                        <Input {...register("company_mail")} type="email" placeholder="Email Address" className="bg-[#444444] text-white border-none focus:ring-2 focus:ring-gray-500" />
                        <Input {...register("password")} type="password" placeholder="Password" className="bg-[#444444] text-white border-none focus:ring-2 focus:ring-gray-500" />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                        {message && <p className="text-sm text-center text-gray-300">{message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
