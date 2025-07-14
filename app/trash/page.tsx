// app/trash/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import Header from "../applications/components/Header";
import { Application } from "../types";
import {
  fetchDeletedApplications,
  permanentlyDeleteApplication,
  restoreApplication,
} from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Trash2, Undo2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Trash() {
  const [trashedApps, setTrashedApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;
    
    const loadTrashedApps = async () => {
      try {
        const data = await fetchDeletedApplications(userEmail);
        setTrashedApps(data);
      } catch (error) {
        toast.error("Failed to load trash");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadTrashedApps();
  }, [userEmail]);

  const handleRestore = async (id: string) => {
    try {
      await restoreApplication(id);
      setTrashedApps((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application restored successfully");
    } catch (error) {
      toast.error("Failed to restore application");
      console.error(error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await permanentlyDeleteApplication(id);
      setTrashedApps((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application permanently deleted");
    } catch (error) {
      toast.error("Failed to delete permanently");
      console.error(error);
    } finally {
      setConfirmOpen(false);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header />
        <div className="p-8 text-center">Loading trash...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trash Bin</h2>
        <Badge variant="outline" className="px-3 py-1">
          {trashedApps.length} items
        </Badge>
      </div>

      {trashedApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">Trash is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trashedApps.map((app) => (
            <div
              key={app._id}
              className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Deleted: {format(new Date(app.deletedAt!), "PPpp")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(app._id!)}
                  >
                    <Undo2 className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteConfirm(app._id!)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              application from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedId && handlePermanentDelete(selectedId)}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}