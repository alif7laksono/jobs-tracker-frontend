// frontend/app/applications/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Application } from "@/app/types";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";
import Form from "@/app/components/Form";
import { toast } from "sonner";

export default function EditApplicationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch application by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/applications/${id}`);
        if (!res.ok) throw new Error("Application not found");
        const data = await res.json();
        setApplication(data);
      } catch (error) {
        toast("Failed to load application data.");
        console.log(error);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: ApplicationFormValues) => {
    try {
      const res = await fetch(`http://localhost:5001/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Update failed");

      toast("Application updated!");
      router.push("/applications");
    } catch (error) {
      toast("Failed to update application.");
      console.log(error);
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
