// app/components/StatusTag.tsx

import { FC } from "react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

type Status = "Applied" | "Interviewing" | "Rejected" | "Offer";

interface Props {
  status: Status;
}

const statusVariantMap: Record<
  Status,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  Applied: "secondary",
  Interviewing: "info",
  Rejected: "destructive",
  Offer: "success",
};

export const StatusTag: FC<Props> = ({ status }) => {
  const variant = statusVariantMap[status] || "secondary";

  return <Badge variant={variant}>{status}</Badge>;
};
