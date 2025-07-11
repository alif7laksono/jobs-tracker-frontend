const BASE_URL = "https://jobs-tracker-backend.vercel.app/api/applications";

export async function fetchApplications() {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
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
  return res.json(); // optional, depending on what your backend returns
}
