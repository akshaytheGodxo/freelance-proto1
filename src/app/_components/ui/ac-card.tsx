import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const FreelancerCard = ({ freelancer }: { freelancer: any }) => {
  return (
    <Link href={`/freelancers/${freelancer.id}`}>
      <div className="max-w-xs w-full group/card cursor-pointer">
        <div
          className={cn(
            "overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 transition-transform transform hover:scale-105"
          )}
          style={{ backgroundImage: `url(${freelancer.bg})`, backgroundSize: "cover" }}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="flex flex-row items-center space-x-4 z-10">
            <Image
              height="100"
              width="100"
              alt={freelancer.name}
              src={freelancer.avatar}
              className="h-10 w-10 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {freelancer.name}
              </p>
              <p className="text-sm text-gray-400">⭐ {freelancer.rating} | 💰 ${freelancer.rate}/hr</p>
            </div>
          </div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              {freelancer.skills.join(", ")}
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              🕒 {freelancer.experience} years experience | 🏆 {freelancer.projects} projects
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default FreelancerCard;