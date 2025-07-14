// app/applications/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Application } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchApplications, deleteApplication } from "@/app/lib/api";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import ApplicationList from "./components/ApplicationsList";
import CountdownToast from "./components/CountdownToast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;
    const loadData = async () => {
      try {
        const data = await fetchApplications(userEmail);
        setApplications(data);
      } catch (error) {
        toast("Failed to fetch applications");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userEmail]);

  const handleEdit = (id: string) => {
    router.push(`/applications/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.custom((t) => (
      <CountdownToast
        onComplete={async () => {
          toast.dismiss(t);
          try {
            await deleteApplication(id);
            setApplications((prev) => prev.filter((app) => app._id !== id));
            toast.success("Application moved to trash!");
          } catch (error) {
            toast.error("Failed to move to trash.");
            console.error("Delete error:", error);
          }
        }}
        onCancel={() => {
          toast.dismiss(t);
          toast.info("Deletion cancelled");
        }}
      />
    ));
    console.log(toastId);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pt-0 md:py-4 px-0 sm:px-6 lg:px-8">
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-4 shadow-sm"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-0 md:py-4 px-0 sm:px-6 lg:px-8">
      <Card className="border-0 shadow-none">
        <Header />

        <CardContent>
          {/* Filters */}
          <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusCounts={statusCounts}
            totalCount={applications.length}
          />

          {/* Application List */}
          <ApplicationList
            applications={filteredApplications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onClearFilters={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
