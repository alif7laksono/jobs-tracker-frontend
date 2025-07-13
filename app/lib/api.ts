import { getSession } from "next-auth/react";
import { ApplicationFormValues } from "./ZodSchemas";

const BASE_URL = "https://jobs-tracker-backend.vercel.app/api/applications";

export async function fetchApplications(userEmail: string) {
  const session = await getSession();
  const res = await fetch(`${BASE_URL}?userEmail=${userEmail}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function deleteApplication(id: string) {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("No access token available");
  }
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete application");
  }
  return res.json();
}

export async function createApplication(
  data: ApplicationFormValues,
  userEmail: string
) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, userEmail }),
  });
  if (!res.ok) throw new Error("Failed to create application");
  return res.json();
}

export async function updateApplication(id: string, data: unknown) {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("No access token available");
  }
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update application");
  }
  return res.json();
}

export async function getApplicationById(id: string) {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("No access token available");
  }
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
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
