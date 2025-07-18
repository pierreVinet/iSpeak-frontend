"use client";

import { CalendarIcon, Plus, UserPlus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormSessionSmallData, PatientSelect } from "@/types";
import { PatientCombobox } from "@/components/ui/patient-combobox";
import { AddPatientDialog } from "@/components/ui/add-patient-dialog";

interface DateNotesFormProps {
  form: UseFormReturn<FormSessionSmallData>;
  patients: PatientSelect[];
}

export function SessionForm({ form, patients }: DateNotesFormProps) {
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] =
    React.useState(false);
  const [defaultAnonymizedId, setDefaultAnonymizedId] = React.useState<
    string | undefined
  >();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleCreatePatientFromCombobox = (anonymizedId: string) => {
    setDefaultAnonymizedId(anonymizedId);
    setIsAddPatientDialogOpen(true);
  };

  const handleCreatePatientFromButton = () => {
    setDefaultAnonymizedId(undefined);
    setIsAddPatientDialogOpen(true);
  };

  const handlePatientCreated = (patient: PatientSelect) => {
    // Select the newly created patient
    form.setValue("patient_id", patient.id);
    console.log("patient_id", patient.id);
    // Refresh the combobox data
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full max-w-[250px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the date of the session.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Patient</FormLabel>
                <div className="w-full max-w-[294px] flex gap-2">
                  <div className="flex-1">
                    <FormControl>
                      <PatientCombobox
                        key={refreshKey}
                        patients={patients}
                        value={field.value}
                        onValueChange={field.onChange}
                        onCreatePatient={handleCreatePatientFromCombobox}
                        placeholder="Select patient..."
                        className="w-full"
                      />
                    </FormControl>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCreatePatientFromButton}
                    className="shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription>
                  Select a patient or create a new one. You can search by
                  anonymized ID.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes field commented out as per original file
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add your notes here. You can also add them later."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </form>
      </Form>

      <AddPatientDialog
        open={isAddPatientDialogOpen}
        onOpenChange={setIsAddPatientDialogOpen}
        onPatientCreated={handlePatientCreated}
        defaultAnonymizedId={defaultAnonymizedId}
      />
    </>
  );
}
