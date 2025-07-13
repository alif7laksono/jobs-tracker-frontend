// app/lib/api.ts
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
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete application");
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
