// frontend/app/aplications/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ApplicationFormValues } from "@/app/lib/ZodSchemas";
import Form from "@/app/components/Form";
import { toast } from "sonner";

export default function NewApplicationPage() {
  const router = useRouter();

  const handleSubmit = async (data: ApplicationFormValues) => {
    try {
      const res = await fetch("http://localhost:5001/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
