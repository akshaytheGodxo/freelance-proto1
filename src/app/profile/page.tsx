'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../_components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const handleEmp = () => {
        router.push("/authentication");
    }
    const handleFree = () => {
        router.push("/freelancer_registration");
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#2b2b2b] p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">What describes you?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employer Card */}
                <Card className="p-6 w-80 shadow-lg bg-[#333333] cursor-pointer hover:shadow-xl transition text-white"> 
                    <CardHeader>
                        <CardTitle>Employer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            I am looking for employees or workers.
                        </CardDescription>
                    </CardContent>
                    <div className="flex justify-end mt-4">
                        <ArrowRight className="w-6 h-6 text-gray-300" onClick={handleEmp}/>
                    </div>
                </Card>
                
                {/* Freelancer Card */}
                <Card className="p-6 w-80 shadow-lg bg-[#333333] cursor-pointer hover:shadow-xl transition text-white"> 
                    <CardHeader>
                        <CardTitle>Freelancer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            I am looking for freelance work and projects.
                        </CardDescription>
                    </CardContent>
                    <div className="flex justify-end mt-4">
                        <ArrowRight className="w-6 h-6 text-gray-300" onClick={handleFree}/>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Page;
