import { AnalysisResultData, ScalarMetric } from "@/types";
import React from "react";
import TypeHeader from "../type-header";
import { type ChartConfig } from "@/components/ui/chart";
import AcousticCard from "./acoustic-card";

interface AcousticSectionProps {
  assessment: AnalysisResultData;
}

const AcousticSection = ({ assessment }: AcousticSectionProps) => {
  const acousticResults = Object.values(assessment.acoustic_results || {});
  const acousticData = acousticResults[0].acoustic_features;

  const isFundamentalFrequency = !!acousticData?.fundamental_frequency;
  const isIntensity = !!acousticData?.intensity;
  const isFormants = !!acousticData?.formants;

  // Prepare chart data for fundamental frequency
  const f0ChartData = acousticData.fundamental_frequency?.time_series.time.map(
    (time, index) => ({
      time,
      value:
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.fundamental_frequency?.time_series.frequency[index],
    })
  );

  const f0ChartConfig: ChartConfig = {
    value: {
      label: "Frequency (Hz)",
      color: "var(--chart-1)",
    },
  };

  const f0Scalars: ScalarMetric[] | undefined =
    !!acousticData?.fundamental_frequency
      ? [
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
            label: "Voiced",
            value: Math.round(
              acousticData.fundamental_frequency.voiced_fraction * 100
            ),
            unit: "%",
            color: "var(--chart-4)",
          },
        ]
      : undefined;

  // Prepare chart data for intensity
  const intensityChartData = acousticData.intensity?.time_series.time.map(
    (time, index) => ({
      time,
      value: Math.max(
        acousticData.intensity?.time_series.intensity[index] ?? 0,
        0
      ),
    })
  );

  const intensityChartConfig: ChartConfig = {
    value: {
      label: "Intensity (dB)",
      color: "var(--chart-2)",
    },
  };

  const intensityScalars: ScalarMetric[] | undefined = !!acousticData?.intensity
    ? [
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
      ]
    : undefined;

  // Prepare chart data for formants
  const formantsChartData = acousticData.formants?.time_series.time.map(
    (time, index) => ({
      time,
      F1:
        acousticData.formants?.time_series.F1[index] === 0 ||
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.formants?.time_series.F1[index],
      F2:
        acousticData.formants?.time_series.F2[index] === 0 ||
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.formants?.time_series.F2[index],
      F3:
        acousticData.formants?.time_series.F3[index] === 0 ||
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.formants?.time_series.F3[index],
      F4:
        acousticData.formants?.time_series.F4[index] === 0 ||
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.formants?.time_series.F4[index],
      F5:
        acousticData.formants?.time_series.F5[index] === 0 ||
        acousticData.fundamental_frequency?.time_series.frequency[index] === 0
          ? null
          : acousticData.formants?.time_series.F5[index],
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
      color: "var(--chart-3)",
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

  const formantScalars: ScalarMetric[] | undefined = !!acousticData?.formants
    ? [
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
        {
          label: "F5 Mean",
          value: Math.round(acousticData.formants.F5.mean),
          unit: "Hz",
          color: "var(--chart-5)",
        },
      ]
    : undefined;

  return (
    <div className="space-y-6">
      <TypeHeader
        title="Acoustic Analysis"
        description="Analysis of the acoustic properties of the speech"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fundamental Frequency */}
        {isFundamentalFrequency && (
          <AcousticCard
            title="Fundamental Frequency (F0)"
            description="Voice pitch characteristics and vocal fold vibration patterns"
            scalars={f0Scalars as ScalarMetric[]}
            chartData={f0ChartData as any[]}
            chartConfig={f0ChartConfig}
            chartType="line"
          />
        )}
        {isIntensity && (
          <AcousticCard
            title="Intensity"
            description="Voice loudness and amplitude characteristics"
            scalars={intensityScalars as ScalarMetric[]}
            chartData={intensityChartData as any[]}
            chartConfig={intensityChartConfig}
            chartType="area"
          />
        )}
        {isFormants && (
          <AcousticCard
            title="Formants (F1-F5)"
            description="Vocal tract resonance frequencies"
            scalars={formantScalars as ScalarMetric[]}
            chartData={formantsChartData as any[]}
            chartConfig={formantsChartConfig}
            chartType="formants"
          />
        )}
      </div>
    </div>
  );
};

export default AcousticSection;
