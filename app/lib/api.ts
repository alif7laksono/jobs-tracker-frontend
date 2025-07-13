// app/lib/api.ts
import { Application } from "../types";
import { ApplicationFormValues } from "./ZodSchemas";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/applications";

export async function fetchApplications(userEmail: string) {
  const res = await fetch(`${BASE_URL}?userEmail=${userEmail}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      res.status === 400 ? "Invalid user email" : "Failed to fetch applications"
    );
  }

  console.log("Fetching from:", `${BASE_URL}?userEmail=${userEmail}`);

  return res.json();
}

export async function createApplication(
  data: ApplicationFormValues,
  userEmail: string
) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, userEmail }),
  });

  if (!res.ok) {
    throw new Error("Failed to create application");
  }

  return res.json();
}

export async function deleteApplication(id: string) {
  const res = await fetch(`/api/applications/${id}/soft-delete`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to move application to trash");
  }

  return res.json();
}

export async function updateApplication(id: string, data: unknown) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update application");
  }

  return res.json();
}

export async function getApplicationById(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Application not found"
        : "Failed to fetch application"
    );
  }

  return res.json();
}

export async function fetchDeletedApplications(): Promise<Application[]> {
  const res = await fetch(
    "https://jobs-tracker-backend.vercel.app/api/applications/deleted",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Jika butuh token, tambahkan Authorization: `Bearer ${token}`
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch deleted applications");
  }

  return res.json();
}

export async function permanentlyDeleteApplication(id: string): Promise<void> {
  const res = await fetch(
    `https://jobs-tracker-backend.vercel.app/api/applications/${id}/permanent`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to permanently delete application");
  }
}
