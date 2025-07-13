"use client";

import { FC, useState } from "react";
import { Application } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ApplicationCard } from "@/app/components/ApplicationCard";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface ApplicationListProps {
  applications: Application[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  statusFilter: string;
  onClearFilters: () => void;
}

const ITEMS_PER_PAGE = 5;

const ApplicationList: FC<ApplicationListProps> = ({
  applications,
  onEdit,
  onDelete,
  searchTerm,
  statusFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApps = applications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
    <div className="space-y-6">
      <div className="grid gap-4">
        {paginatedApps.map((application, index) => (
          <ApplicationCard
            key={application._id || `app-${index}`}
            application={application}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="justify-end">
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ApplicationList;
