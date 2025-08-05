import { AnalysisResultData, ScalarMetric } from "@/types";
import React from "react";
import TypeHeader from "../type-header";
import { type ChartConfig } from "@/components/ui/chart";
import AcousticCard from "./acoustic-card";

interface AcousticSectionProps {
  assessment: AnalysisResultData;
}

const acousticData = {
  fundamental_frequency: {
    time_series: {
      time: Array.from({ length: 100 }, (_, i) => i * 0.05),
      frequency: Array.from(
        { length: 100 },
        () => 215.8 + (Math.random() - 0.5) * 30
      ),
    },
    mean_f0: 215.8,
    std_f0: 12.4,
    range_f0: 45.2,
    min_f0: 198.3,
    max_f0: 243.5,
    voiced_fraction: 0.82,
    total_frames: 500,
    voiced_frames: 410,
  },
  intensity: {
    time_series: {
      time: Array.from({ length: 100 }, (_, i) => i * 0.05),
      intensity: Array.from(
        { length: 100 },
        () => 65.4 + (Math.random() - 0.5) * 8
      ),
    },
    mean_intensity: 65.4,
    std_intensity: 3.2,
    range_intensity: 15.8,
    min_intensity: 58.1,
    max_intensity: 73.9,
    variability: 0.049,
    total_frames: 500,
    valid_frames: 485,
  },
  formants: {
    time_series: {
      time: Array.from({ length: 100 }, (_, i) => i * 0.05),
      F1: Array.from({ length: 100 }, () => 750.5 + (Math.random() - 0.5) * 40),
      F2: Array.from(
        { length: 100 },
        () => 1250.8 + (Math.random() - 0.5) * 100
      ),
      F3: Array.from(
        { length: 100 },
        () => 2300.4 + (Math.random() - 0.5) * 150
      ),
      F4: Array.from(
        { length: 100 },
        () => 3401.2 + (Math.random() - 0.5) * 200
      ),
      F5: Array.from(
        { length: 100 },
        () => 4201.7 + (Math.random() - 0.5) * 250
      ),
    },
    F1: {
      mean: 750.5,
      std: 15.2,
      range: 65.8,
      min: 720.1,
      max: 785.9,
      total_frames: 500,
      valid_frames: 485,
    },
    F2: {
      mean: 1250.8,
      std: 45.7,
      range: 180.3,
      min: 1180.2,
      max: 1360.5,
      total_frames: 500,
      valid_frames: 485,
    },
    F3: {
      mean: 2300.4,
      std: 78.9,
      range: 320.1,
      min: 2180.3,
      max: 2500.4,
      total_frames: 500,
      valid_frames: 485,
    },
    F4: {
      mean: 3401.2,
      std: 102.4,
      range: 410.6,
      min: 3200.9,
      max: 3611.5,
      total_frames: 500,
      valid_frames: 485,
    },
    F5: {
      mean: 4201.7,
      std: 125.8,
      range: 520.3,
      min: 3950.5,
      max: 4470.8,
      total_frames: 500,
      valid_frames: 485,
    },
  },
};

const AcousticSection = ({ assessment }: AcousticSectionProps) => {
  // Prepare chart data for fundamental frequency
  const f0ChartData = acousticData.fundamental_frequency.time_series.time.map(
    (time, index) => ({
      time,
      value: acousticData.fundamental_frequency.time_series.frequency[index],
    })
  );

  const f0ChartConfig: ChartConfig = {
    value: {
      label: "Frequency (Hz)",
      color: "var(--chart-1)",
    },
  };

  // Prepare chart data for intensity
  const intensityChartData = acousticData.intensity.time_series.time.map(
    (time, index) => ({
      time,
      value: acousticData.intensity.time_series.intensity[index],
    })
  );

  const intensityChartConfig: ChartConfig = {
    value: {
      label: "Intensity (dB)",
      color: "var(--chart-2)",
    },
  };

  // Prepare chart data for formants
  const formantsChartData = acousticData.formants.time_series.time.map(
    (time, index) => ({
      time,
      F1: acousticData.formants.time_series.F1[index],
      F2: acousticData.formants.time_series.F2[index],
      F3: acousticData.formants.time_series.F3[index],
      F4: acousticData.formants.time_series.F4[index],
      F5: acousticData.formants.time_series.F5[index],
    })
  );

  const formantsChartConfig: ChartConfig = {
    F1: {
      label: "F1",
      color: "var(--chart-1)",
    },
    F2: {
      label: "F2",
      color: "var(--chart-2)",
    },
    F3: {
      label: "F3",
      color: "(var(--chart-3)",
    },
    F4: {
      label: "F4",
      color: "var(--chart-4)",
    },
    F5: {
      label: "F5",
      color: "var(--chart-5)",
    },
  };

  // Prepare scalar data
  const f0Scalars: ScalarMetric[] = [
    {
      label: "Mean",
      value: acousticData.fundamental_frequency.mean_f0,
      unit: "Hz",
      color: "var(--chart-1)",
    },
    {
      label: "Std Dev",
      value: acousticData.fundamental_frequency.std_f0,
      unit: "Hz",
      color: "var(--chart-2)",
    },
    {
      label: "Range",
      value: acousticData.fundamental_frequency.range_f0,
      unit: "Hz",
      color: "var(--chart-3)",
    },
    {
      label: "Voiced %",
      value: Math.round(
        acousticData.fundamental_frequency.voiced_fraction * 100
      ),
      unit: "%",
      color: "var(--chart-4)",
    },
  ];

  const intensityScalars: ScalarMetric[] = [
    {
      label: "Mean",
      value: acousticData.intensity.mean_intensity,
      unit: "dB",
      color: "var(--chart-1)",
    },
    {
      label: "Std Dev",
      value: acousticData.intensity.std_intensity,
      unit: "dB",
      color: "var(--chart-2)",
    },
    {
      label: "Range",
      value: acousticData.intensity.range_intensity,
      unit: "dB",
      color: "var(--chart-3)",
    },
    {
      label: "Variability",
      value: Math.round(acousticData.intensity.variability * 1000) / 1000,
      unit: "",
      color: "var(--chart-4)",
    },
  ];

  const formantScalars: ScalarMetric[] = [
    {
      label: "F1 Mean",
      value: Math.round(acousticData.formants.F1.mean),
      unit: "Hz",
      color: "var(--chart-1)",
    },
    {
      label: "F2 Mean",
      value: Math.round(acousticData.formants.F2.mean),
      unit: "Hz",
      color: "var(--chart-2)",
    },
    {
      label: "F3 Mean",
      value: Math.round(acousticData.formants.F3.mean),
      unit: "Hz",
      color: "var(--chart-3)",
    },
    {
      label: "F4 Mean",
      value: Math.round(acousticData.formants.F4.mean),
      unit: "Hz",
      color: "var(--chart-4)",
    },
  ];
  return (
    <div className="space-y-6">
      <TypeHeader
        title="Acoustic Analysis"
        description="Analysis of the acoustic properties of the speech"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fundamental Frequency */}
        <AcousticCard
          title="Fundamental Frequency (F0)"
          description="Voice pitch characteristics and vocal fold vibration patterns"
          scalars={f0Scalars}
          chartData={f0ChartData}
          chartConfig={f0ChartConfig}
          chartType="line"
        />
      </div>
    </div>
  );
};

export default AcousticSection;
