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
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    const toastId = toast.custom((t) => (
      <CountdownToast
        onComplete={async () => {
          toast.dismiss(t); // remove countdown toast
          try {
            await deleteApplication(id);
            setApplications((prev) => prev.filter((app) => app._id !== id));
            toast.success("Application deleted!");
          } catch (error) {
            toast.error("Failed to delete application.");
            console.error(error);
            console.log(toastId);
          }
        }}
      />
    ));
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
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading applications...</p>
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
