"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Scissors, X } from "lucide-react";
import type { SelectRangeProps } from "@/types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TimeInput from "@/components/ui/time-input";
const SelectRange = ({
  selectedRange,
  onRangeChange,
  handleCancelRangeSelection,
  duration,
  handleAddAnalysis,
}: SelectRangeProps) => {
  const handleTimeRangeChange = (field: "start" | "end", value: number) => {
    const newRange = { ...selectedRange };
    if (field === "start") {
      newRange.start = Math.max(0, value);
      // Ensure start is less than end
      if (newRange.start >= newRange.end) {
        newRange.end = newRange.start + 1;
      }
    } else {
      newRange.end = Math.max(value, newRange.start + 0.1);
    }
    onRangeChange(newRange);
  };

  return (
    <div className="flex items-center flex-wrap gap-4 p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
      <Scissors className="h-4 w-4" />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="flex-1">
          <div className="text-sm font-medium">Selected Segment (hh:mm:ss)</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Label
                htmlFor="start-time"
                className="text-xs text-muted-foreground"
              >
                Start:
              </Label>
              <TimeInput
                value={selectedRange.start}
                onChange={(value) => handleTimeRangeChange("start", value)}
                max={duration}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor="end-time"
                className="text-xs text-muted-foreground"
              >
                End:
              </Label>
              <TimeInput
                value={selectedRange.end}
                onChange={(value) => handleTimeRangeChange("end", value)}
                max={duration}
              />
            </div>{" "}
            {/* todo: add duration */}
            {/* todo: play region button and logic */}
            {/* <div className="text-xs">
              Duration: {formatTime(selectedRange.end - selectedRange.start)}
            </div> */}
          </div>
        </div>
      </LocalizationProvider>

      <Button size="sm" onClick={handleAddAnalysis}>
        Add
      </Button>

      <Button
        onClick={handleCancelRangeSelection}
        size="sm"
        variant="destructive"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SelectRange;
