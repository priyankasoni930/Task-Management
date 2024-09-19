"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, List } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/tasks");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-blue-800">
            Task Management Simplified
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your workflow, boost productivity, and achieve your goals
            with our intuitive task management platform.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <FeatureCard
            icon={<List className="w-12 h-12 text-blue-500" />}
            title="Organize Tasks"
            description="Easily create, categorize, and prioritize your tasks to stay on top of your workload."
          />
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-blue-500" />}
            title="Achieve Goals"
            description="Set and accomplish your goals by breaking them down into manageable tasks and tracking your progress."
          />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Ready to boost your productivity?
          </h2>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
