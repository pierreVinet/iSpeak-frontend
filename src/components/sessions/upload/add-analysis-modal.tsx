"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CornerDownLeft, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  AnalysisType,
  AnalysisSegment,
  AddAnalysisModalProps,
} from "@/types";
import {
  formatTime,
  parseIntelligibilitySentences,
  parseIntelligibilityWords,
  validateTimeRange,
} from "@/lib/utils";
import { analysisTypeDescriptions } from "@/app/dashboard/costants";
import { formAnalysisModalSchema } from "@/lib/zod";
import ComingSoonBadge from "@/components/general/coming-soon-badge";

type FormData = z.infer<typeof formAnalysisModalSchema>;

export function AddAnalysisModal({
  open,
  onOpenChange,
  selectedRange,
  duration,
  segments,
  onAddAnalysis,
}: AddAnalysisModalProps) {
  const [hasUserEditedName, setHasUserEditedName] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formAnalysisModalSchema),
    defaultValues: {
      name: "",
      type: "intelligibility",
      referenceType: "words",
      referenceWords: "",
      referenceSentences: "",
    },
  });

  const watchedType = form.watch("type");
  const watchedReferenceType = form.watch("referenceType");
  const watchedReferenceWords = form.watch("referenceWords");
  const watchedReferenceSentences = form.watch("referenceSentences");

  // Get parsed counts
  const parsedWords = parseIntelligibilityWords(watchedReferenceWords || "");
  const parsedSentences = parseIntelligibilitySentences(
    watchedReferenceSentences || ""
  );

  // Generate unique name for analysis
  const generateAnalysisName = (type: AnalysisType): string => {
    const baseName =
      type === "acoustic"
        ? "Acoustic Analysis"
        : "Intelligibility Assessment (FDA2)";

    // Find existing segments with similar names
    const existingNames = segments
      .filter((segment: AnalysisSegment) => segment.name.startsWith(baseName))
      .map((segment: AnalysisSegment) => segment.name);

    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    // Find the highest number suffix
    let counter = 2;
    while (existingNames.includes(`${baseName} ${counter}`)) {
      counter++;
    }

    return `${baseName} ${counter}`;
  };

  // Reset form and set default values when modal opens
  useEffect(() => {
    if (open && !hasUserEditedName) {
      const defaultName = generateAnalysisName(watchedType);
      form.reset({
        name: defaultName,
        type: watchedType,
        referenceType: "words",
        referenceWords: "",
        referenceSentences: "",
      });
    }
  }, [open, watchedType, segments, form, hasUserEditedName]);

  // Get time validation error
  const timeError = validateTimeRange(selectedRange, duration);

  const onSubmit = (data: FormData) => {
    if (timeError) return;

    let referenceData = undefined;

    if (data.type === "intelligibility") {
      const words =
        data.referenceType === "words" && data.referenceWords?.trim()
          ? parseIntelligibilityWords(data.referenceWords)
          : [];

      const sentences =
        data.referenceType === "sentences" && data.referenceSentences?.trim()
          ? parseIntelligibilitySentences(data.referenceSentences)
          : [];

      if (words.length > 0 || sentences.length > 0) {
        referenceData = { words, sentences };
      }
    }

    onAddAnalysis({
      name: data.name.trim(),
      type: data.type,
      timeRange: selectedRange,
      referenceData,
    });

    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setHasUserEditedName(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Analysis</DialogTitle>
          <DialogDescription>
            {formatTime(selectedRange.start)} - {formatTime(selectedRange.end)}{" "}
            (Duration:{" "}
            {formatTime(selectedRange.end - selectedRange.start, true)})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Vowel Production Analysis"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setHasUserEditedName(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="acoustic"
                          id="acoustic"
                          disabled
                        />
                        <Label
                          className="text-muted-foreground"
                          htmlFor="acoustic"
                        >
                          Acoustic Analysis
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {analysisTypeDescriptions.acoustic}
                          </TooltipContent>
                        </Tooltip>
                        <ComingSoonBadge />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="intelligibility"
                          id="intelligibility"
                        />
                        <Label htmlFor="intelligibility">
                          Intelligibility Assessment (FDA2)
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {analysisTypeDescriptions.intelligibility}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedType === "intelligibility" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="referenceType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Reference Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="words" id="words" />
                            <Label htmlFor="words">Reference Words</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sentences" id="sentences" />
                            <Label htmlFor="sentences">
                              Reference Sentences
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedReferenceType === "words" && (
                  <FormField
                    control={form.control}
                    name="referenceWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="office, throw, leaf, ..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter words separated by commas
                        </FormDescription>
                        {watchedReferenceWords && (
                          <p className="text-sm text-green-600">
                            {parsedWords.length} words found
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watchedReferenceType === "sentences" && (
                  <FormField
                    control={form.control}
                    name="referenceSentences"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="My new van. My daughter is a nurse. ..."
                            className="resize-none"
                            rows={7}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="">
                          Enter sentences separated by periods{" "}
                          <PonctuationBadge ponctuation="." />, exclamation
                          marks <PonctuationBadge ponctuation="!" />, question
                          marks <PonctuationBadge ponctuation="?" /> or line
                          breaks
                          <CornerDownLeft className="inline w-5.5 h-5.5 ml-1 bg-muted p-1 rounded-sm" />
                        </FormDescription>
                        {watchedReferenceSentences && (
                          <p className="text-sm text-green-600">
                            {parsedSentences.length} sentences found
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <DialogFooter className="w-full flex sm:flex-col items-end">
              {timeError && (
                <p className="text-sm text-destructive mt-1">{timeError}</p>
              )}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || !!timeError}
                >
                  Add
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const PonctuationBadge = ({ ponctuation }: { ponctuation: string }) => {
  return (
    <span className="inline  px-2  ml-1 bg-muted p-1 rounded-sm">
      {ponctuation}
    </span>
  );
};
