// frontend/app/applications/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationCard } from "@/app/components/ApplicationCard";
import { Application } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteApplication, fetchApplications } from "@/app/lib/api";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (error) {
        toast(
          `Failed to fetch job applications: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/applications/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast("Application deleted!");
    } catch (error) {
      toast("Failed to delete application.");
      console.log(error);
    }
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
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl uppercase font-bold">
                Job Applications
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track all your job applications in one place
              </p>
            </div>
            <Button
              onClick={() => router.push("/applications/new")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs or companies..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">
                  Applied ({statusCounts.Applied || 0})
                </SelectItem>
                <SelectItem value="Interviewing">
                  Interviewing ({statusCounts.Interviewing || 0})
                </SelectItem>
                <SelectItem value="Offer">
                  Offer ({statusCounts.Offer || 0})
                </SelectItem>
                <SelectItem value="Rejected">
                  Rejected ({statusCounts.Rejected || 0})
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Badge
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className="cursor-pointer"
              >
                All ({applications.length})
              </Badge>
              {Object.entries(statusCounts).map(([status, count]) => (
                <Badge
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className="cursor-pointer whitespace-nowrap"
                >
                  {status} ({count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Application List */}
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Search className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "No matching applications found"
                  : "No applications yet"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application, index) => (
                <ApplicationCard
                  key={application._id || `app-${index}`}
                  application={application}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
