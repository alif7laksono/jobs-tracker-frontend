export async function fetchApplications() {
  const res = await fetch("http://localhost:5001/api/applications", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }
  return res.json();
}

export async function deleteApplication(id: string) {
  const res = await fetch(`http://localhost:5001/api/applications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
}
