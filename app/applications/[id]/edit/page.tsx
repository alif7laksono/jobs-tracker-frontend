// frontend/app/applications/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Application } from "@/app/types";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";
import Form from "@/app/components/Form";
import { toast } from "sonner";
import { getApplicationById, updateApplication } from "@/app/lib/api";

export default function EditApplicationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to fetch application detail.");
        } else {
          toast.error("Failed to fetch application detail.");
        }
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: ApplicationFormValues) => {
    try {
      await updateApplication(id, data);
      toast.success("Application updated!");
      router.push("/applications");
    } catch (error) {
      toast.error((error as Error).message || "Failed update application.");
      setApplication(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading application data...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold">Application not found</h1>
        <p className="text-muted-foreground">
          Please check the ID or go back to the list.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Form onSubmit={handleSubmit} defaultValues={application} mode="edit" />
    </div>
  );
}
