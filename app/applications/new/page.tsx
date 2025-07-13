// frontend/app/applications/new/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@/app/components/Form";
import { createApplication } from "@/app/lib/api";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";

export default function NewApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (data: ApplicationFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (!session?.user?.email) {
        throw new Error("User email is missing");
      }

      await createApplication(data, session.user.email);
      toast.success("Application created!");
      router.push("/applications");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create application");
      } else {
        toast.error("Failed to create application");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Form onSubmit={handleSubmit} />
    </div>
  );
}
