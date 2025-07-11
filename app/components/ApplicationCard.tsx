// app/components/ApplicationCard.tsx

import { FC } from "react";
import { Application } from "@/app/types";
import { StatusTag } from "./StatusTag";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  application: Application;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const ApplicationCard: FC<Props> = ({ application, onDelete }) => {
  const getId = application._id;

  if (!getId) return null;

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 capitalize">
        {/* Left Side: Job Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{application.jobTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {application.company} • {application.location}
          </p>

          <div className="text-sm text-gray-600 mt-2">
            <p>
              📅 Applied on:{" "}
              <span className="font-medium">{application.applicationDate}</span>
            </p>
            <p>💼 Job Type: {application.jobType}</p>
            {application.jobLink && (
              <a
                href={application.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Job Post
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Status + Buttons */}
        <div className="flex flex-col items-start sm:items-end gap-2 min-w-max">
          <StatusTag status={application.status} />
          <div className="flex gap-2 flex-wrap">
            <Link href={`/applications/${getId}`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/applications/${getId}/edit`}>
              <Button variant="secondary" size="sm">
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(getId)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
