"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  statusCounts: Record<string, number>;
  totalCount: number;
}

const Filters: FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  statusCounts,
  totalCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs or companies..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
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

      {/* Badge Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Badge
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          className="cursor-pointer"
        >
          All ({totalCount})
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
  );
};

export default Filters;
