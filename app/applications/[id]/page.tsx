// app/applications/[id]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { StatusTag } from "@/app/components/StatusTag";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Link2, MapPin, Notebook, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Application } from "@/app/types";
import { getApplicationById } from "@/app/lib/api";
import Header from "../components/Header";

export default function ApplicationDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: session, status } = useSession();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        toast.error(
          (error as Error).message || "Failed to fetch application detail."
        );
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading application...
      </div>
    );
  }

  if (!application) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Header />
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight capitalize">
                {application.jobTitle}
              </CardTitle>
              <p className="text-lg text-muted-foreground mt-1">
                {application.company}
              </p>
            </div>
            <StatusTag status={application.status} />
          </div>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{application.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Job Type</p>
                <p className="font-medium">{application.jobType}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Applied Date</p>
                <p className="font-medium">{application.applicationDate}</p>
              </div>
            </div>

            {application.jobLink && (
              <div className="flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Listing</p>
                  <Link
                    href={application.jobLink}
                    target="_blank"
                    className="font-medium text-primary hover:underline"
                  >
                    View original
                  </Link>
                </div>
              </div>
            )}
          </div>

          {application.notes && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Notebook className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Notes</h3>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm whitespace-pre-line">
                  {application.notes}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link href="/applications">Back to list</Link>
            </Button>
            <Button asChild>
              <Link href={`/applications/${id}/edit`}>Edit application</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
