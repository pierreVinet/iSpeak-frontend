"use client";

import React from "react";
import { TimeField } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { getTimeValueFromSeconds, validateTimeMinMax } from "@/lib/utils";
import { TimeInputProps } from "@/types";

// Create a styled version of TimeField
const StyledTimeField = styled(TimeField)({
  "& .MuiPickersInputBase-root": {
    paddingRight: "12px !important",
    paddingLeft: "12px !important",

    "& fieldset": {
      borderColor: "var(--color-border) !important", // Remove border
      borderRadius: "var(--radius)",
    },
    "&:hover fieldset": {
      borderColor: "transparent", // Remove border on hover
    },
    "&.Mui-focused fieldset": {
      outlineColor: "transparent",
      borderRadius: "var(--radius)",
      borderColor: "var(--color-primary) !important",
    },
  },
  "& .MuiPickersSectionList-root": {
    paddingTop: "5px !important",
    paddingBottom: "5px !important",
  },
});

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  min,
  max,
}) => {
  const handleTimeChange = (newValue: Date | null) => {
    if (!newValue) {
      onChange(0);
      return;
    }

    // Convert the Date to total seconds
    const totalSeconds =
      newValue.getHours() * 3600 +
      newValue.getMinutes() * 60 +
      newValue.getSeconds();

    if (validateTimeMinMax(totalSeconds)) {
      onChange(totalSeconds);
    }
  };
  return (
    <StyledTimeField
      className="w-[90px] bg-white  rounded-[var(--radius)] "
      value={getTimeValueFromSeconds(value)}
      onChange={handleTimeChange}
      hiddenLabel
      format="HH:mm:ss"
      size="small"
      variant="outlined"
      disabled={disabled}
      slotProps={{
        textField: {
          error: !!error,
          helperText: error,
        },
      }}
      // selectedSections={"all"}
      minTime={min ? getTimeValueFromSeconds(min) : undefined}
      maxTime={max ? getTimeValueFromSeconds(max) : undefined}
    />
  );
};

export default TimeInput;
