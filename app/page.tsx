// app/page.tsx

import { getServerSession } from "next-auth";
import { authConfig } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Welcome 👋</h1>
        <p className="text-lg text-gray-600">
          Hello,{" "}
          <span className="font-semibold text-gray-800">
            {session.user?.email}
          </span>
          !
        </p>
        <p className="text-gray-500">
          This is your personal space to track and manage all your job
          applications.
        </p>
        <Button asChild className="w-full gap-2">
          <Link href="/applications">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
