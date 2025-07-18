"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PatientSelect } from "@/types";

interface PatientComboboxProps {
  patients: PatientSelect[];
  value?: string;
  onValueChange: (value: string) => void;
  onCreatePatient: (anonymizedId: string) => void;
  placeholder?: string;
  className?: string;
}

export function PatientCombobox({
  patients,
  value,
  onValueChange,
  onCreatePatient,
  placeholder = "Select patient...",
  className,
}: PatientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedPatient = patients.find((patient) => patient.id === value);

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) =>
    patient.anonymized_id.toLowerCase().includes(searchValue.toLowerCase())
  );

  const hasExactMatch = filteredPatients.some(
    (patient) =>
      patient.anonymized_id.toLowerCase() === searchValue.toLowerCase()
  );

  const showCreateOption = searchValue.length > 0 && !hasExactMatch;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedPatient ? selectedPatient.anonymized_id : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" side="bottom" align="center">
        <Command>
          <CommandInput
            placeholder="Search patients..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          {filteredPatients.length === 0 && !showCreateOption && (
            <CommandEmpty>No patients found.</CommandEmpty>
          )}
          <CommandGroup>
            {filteredPatients.map((patient) => (
              <CommandItem
                key={patient.id}
                value={patient.anonymized_id}
                onSelect={() => {
                  onValueChange(patient.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === patient.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {patient.anonymized_id}
              </CommandItem>
            ))}
            {showCreateOption && (
              <CommandItem
                onSelect={() => {
                  onCreatePatient(searchValue);
                  setOpen(false);
                }}
                className="text-blue-600 font-medium cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create patient "{searchValue}"
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
