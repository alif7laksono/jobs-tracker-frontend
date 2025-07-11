// frontend/app/aplications/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";
import Form from "@/app/components/Form";
import { toast } from "sonner";

export default function NewApplicationPage() {
  const router = useRouter();

  const BASE_URL = "https://jobs-tracker-backend.vercel.app/api/applications";

  const handleSubmit = async (data: ApplicationFormValues) => {
    try {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to create application");

      toast("Application added successfully!");
      router.push("/applications");
    } catch (error) {
      toast("Failed to add application.");
      console.error(error);
    }
  };

  return (
    <div className="py-10">
      <Form onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
