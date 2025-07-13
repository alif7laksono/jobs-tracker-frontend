// frontend/app/lib/ZodSchemas.ts

import { z } from "zod";

export const applicationSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title too long"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company name too long"),
  location: z.string(),
  jobType: z.enum([
    "Full-time",
    "Internship",
    "Contract",
    "Part-time",
    "Freelance",
  ]),
  status: z.enum(["Applied", "Interviewing", "Rejected", "Offer", "Accepted"]),
  applicationDate: z.string().min(1, "Date is required"),
  jobLink: z.string().url("Invalid URL").optional(),
  notes: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
