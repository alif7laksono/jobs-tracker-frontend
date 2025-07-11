// frontend/app/components/Form.tsx

"use client";

import {
  Form as ShadForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/app/lib/ZodSchemas";
import {
  Calendar,
  Link2,
  Briefcase,
  ClipboardList,
  MapPin,
  Building2,
} from "lucide-react";

type Props = {
  defaultValues?: Partial<ApplicationFormValues>;
  onSubmit: (data: ApplicationFormValues) => void;
  mode?: "create" | "edit";
};

export default function Form({
  defaultValues,
  onSubmit,
  mode = "create",
}: Props) {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      jobType: "Full-time",
      status: "Applied",
      applicationDate: "",
      jobLink: "",
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === "edit" ? "Edit Application" : "Add New Application"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ShadForm {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Frontend Developer"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Tokopedia"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Remote, Jakarta"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Type */}
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interviewing">
                          Interviewing
                        </SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Application Date */}
              <FormField
                control={form.control}
                name="applicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Application Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Link */}
              <FormField
                control={form.control}
                name="jobLink"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Job Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://company.com/job"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Interview notes, contacts, salary info, etc."
                      {...field}
                      className="bg-muted/50 min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto"
                variant={mode === "edit" ? "default" : "secondary"}
              >
                {mode === "edit" ? (
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Update Application
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Create Application
                  </span>
                )}
              </Button>
            </div>
          </form>
        </ShadForm>
      </CardContent>
    </Card>
  );
}
