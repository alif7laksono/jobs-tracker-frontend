"use client";
import React, { useEffect, useState } from "react";
import Header from "../applications/components/Header";
import { Application } from "../types";
import {
  fetchDeletedApplications,
  permanentlyDeleteApplication,
} from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Trash() {
  const [trashedApps, setTrashedApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrashedApps = async () => {
      try {
        const data = await fetchDeletedApplications();
        setTrashedApps(data);
      } catch (error) {
        toast("Failed to load trash");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadTrashedApps();
  }, []);

  const handlePermanentDelete = async (id: string) => {
    try {
      await permanentlyDeleteApplication(id);
      setTrashedApps((prev: Application[]) =>
        (prev || []).filter((app: Application) => app._id !== id)
      );
      toast("Application permanently deleted");
    } catch (error) {
      toast("Failed to delete permanently");
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading trash...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Header />
      <h2 className="text-2xl font-bold mb-4">Trash Bin</h2>
      {trashedApps.length === 0 ? (
        <p className="text-muted-foreground">Trash is empty</p>
      ) : (
        <div className="space-y-4">
          {trashedApps.map((app) => (
            <div key={app._id} className="border p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold uppercase">
                    {app.jobTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                  <p className="text-xs text-red-500">
                    Deleted At: {new Date(app.deletedAt!).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handlePermanentDelete(app._id!)}
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
