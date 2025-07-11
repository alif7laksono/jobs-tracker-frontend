// app/types/index.ts

export type Application = {
  _id?: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobType: "Full-time" | "Internship" | "Contract";
  status: "Applied" | "Interviewing" | "Rejected" | "Offer";
  applicationDate: string;
  jobLink?: string;
  notes?: string;
};
