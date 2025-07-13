// frontend/app/applications/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Application } from "@/app/types";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";
import Form from "@/app/components/Form";
import { toast } from "sonner";
import { getApplicationById, updateApplication } from "@/app/lib/api";

export default function EditApplicationPage() {
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

    const fetchData = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        toast.error(
          (error as Error).message || "Failed to load application data."
        );
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, session, status, router]);

  const handleSubmit = async (data: ApplicationFormValues) => {
    try {
      await updateApplication(id, data);
      toast.success("Application updated!");
      router.push("/applications");
    } catch (error) {
      toast.error((error as Error).message || "Failed to upload application.");
    }
  };

  if (status === "loading" || loading) {
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
