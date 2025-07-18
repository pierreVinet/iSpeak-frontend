"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreatePatientSchema } from "@/lib/zod";
import { CreatePatient, PatientSelect } from "@/types";
import { createPatient } from "@/data-access/patients";
import { createPatientUseCase } from "@/use-cases/patients";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated?: (patient: PatientSelect) => void;
  defaultAnonymizedId?: string;
}

type FormData = CreatePatient;

export function AddPatientDialog({
  open,
  onOpenChange,
  onPatientCreated,
  defaultAnonymizedId,
}: AddPatientDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(CreatePatientSchema),
    defaultValues: {
      anonymized_id: defaultAnonymizedId || "",
      notes: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset form when dialog opens/closes or defaultAnonymizedId changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        anonymized_id: defaultAnonymizedId || "",
        notes: "",
      });
      setError(null);
    }
  }, [open, defaultAnonymizedId, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    console.log("onSubmit", data);

    try {
      const newPatient = await createPatientUseCase(data);
      if (!newPatient) {
        throw new Error("Failed to create patient");
      }
      onPatientCreated?.(newPatient);
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to create patient:", error);
      setError(error.message || "Failed to create patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Create a new patient record. Only the anonymized ID and optional
            notes are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="anonymized_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anonymized ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., PAT001"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for the patient (visible in the system)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about the patient..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                // onClick={() => {
                //   console.log("clicked");
                //   form.handleSubmit(onSubmit)();
                // }}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
