"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

const Header: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Berhasil logout");
    router.push("/login");
  };

  return (
    <CardHeader>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Title Section */}
        <div className="flex-1 min-w-[200px]">
          <CardTitle className="text-2xl uppercase font-bold">
            Job Applications
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Track all your job applications in one place
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button
            onClick={() => router.push("/applications/new")}
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    {session.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {session.user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default Header;
