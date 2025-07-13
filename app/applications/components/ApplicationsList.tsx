"use client";

import { FC } from "react";
import { Application } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ApplicationCard } from "@/app/components/ApplicationCard";
import Link from "next/link";

interface ApplicationListProps {
  applications: Application[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  statusFilter: string;
  onClearFilters: () => void;
}

const ApplicationList: FC<ApplicationListProps> = ({
  applications,
  onEdit,
  onDelete,
  searchTerm,
  statusFilter,
}) => {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Search className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          {searchTerm || statusFilter !== "all"
            ? "No matching applications found"
            : "No applications yet"}
        </p>
        <Button variant="link">
          <Link href="/applications/new">Create Application</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application, index) => (
        <ApplicationCard
          key={application._id || `app-${index}`}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ApplicationList;
