"use client";
import Image from "next/image"
import { Star, StarHalf } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { useRouter } from "next/navigation";
const EmployeeContents = () => {
  const { data: freelancers } = trpc.frel.showFreelancers.useQuery()
  const router = useRouter();
  const handleProfile = (id: string) => {
    router.push(`/freelancers/${id}`);
  }

  // Function to render rating stars
  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    return stars
  }

  return (
    <div className="p-4">
      {/* Headings */}
      <div className="text-white font-poppins text-4xl mb-4">
        <span>Hello Sir!</span>
      </div>
      <span className="text-white text-2xl block mb-8">Look for your interests</span>

      {/* Freelancer Cards */}
      {!freelancers || freelancers.length === 0 ? (
        <div className="text-white text-center py-10">No freelancers found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="overflow-hidden h-full flex flex-col bg-white text-black">
              {/* Card Header with Background Image */}
              <CardHeader className="p-0 h-32 relative">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={freelancer.bg || "bg1.png"}
                    alt=""
                    fill
                  
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 transform translate-y-1/2 left-4">
                  <Avatar className="h-16 w-16 border-4 border-background">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="pt-10 flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{freelancer.name}</h3>
                  <div className="flex items-center mt-1">
                    {renderRating(freelancer.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">({freelancer.rating.toFixed(1)})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-medium">${freelancer.rate}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{freelancer.experience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="font-medium">{freelancer.projects}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="font-medium truncate" title={freelancer.education}>
                      {freelancer.education}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <button className="w-full bg-primary text-primary-foreground bg-black text-white py-2 rounded-md transition-colors"  onClick={() => handleProfile(freelancer.id)} 
                >
                  View Profile
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeContents

