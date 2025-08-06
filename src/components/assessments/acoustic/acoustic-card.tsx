"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { Separator } from "@/components/ui/separator";
import { AcousticCardProps } from "@/types";
import { cn } from "@/lib/utils";

interface FormantLineProps {
  dataKey: string;
  name: string;
  stroke: string;
}

const createFormantLine = ({ dataKey, name, stroke }: FormantLineProps) => (
  <RechartsPrimitive.Line
    key={dataKey}
    type="monotone"
    isAnimationActive={false}
    dataKey={dataKey}
    name={name}
    stroke={stroke}
    strokeWidth={0}
    dot={{
      fill: stroke,
      r: 2,
    }}
    activeDot={{
      r: 4,
    }}
  />
);

const AcousticCard = ({
  title,
  description,
  scalars,
  chartData,
  chartConfig,
  chartType,
}: AcousticCardProps) => {
  const renderChart = () => {
    if (chartType === "formants") {
      return (
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <RechartsPrimitive.LineChart data={chartData}>
            <RechartsPrimitive.XAxis
              dataKey="time"
              tickFormatter={(value) => `${value.toFixed(1)}s`}
            >
              <RechartsPrimitive.Label
                value="Time (s)"
                offset={0}
                position="insideBottom"
              />
            </RechartsPrimitive.XAxis>
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(0)}`}
            >
              <RechartsPrimitive.Label
                value="Frequency (Hz)"
                offset={0}
                position="insideLeft"
                angle={-90}
              />
            </RechartsPrimitive.YAxis>
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Formants`}
            />
            {["F1", "F2", "F3", "F4", "F5"].map((formant) =>
              createFormantLine({
                dataKey: formant,
                name: `${formant} (Hz)`,
                stroke: `var(--color-${formant})`,
              })
            )}
          </RechartsPrimitive.LineChart>
        </ChartContainer>
      );
    } else if (chartType === "area") {
      return (
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <RechartsPrimitive.AreaChart data={chartData}>
            <RechartsPrimitive.XAxis
              dataKey="time"
              tickFormatter={(value) => `${value.toFixed(1)}s`}
            >
              <RechartsPrimitive.Label
                value="Time (s)"
                offset={0}
                position="insideBottom"
              />
            </RechartsPrimitive.XAxis>
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(1)}`}
            >
              <RechartsPrimitive.Label
                value="Intensity (dB)"
                offset={0}
                position="insideLeft"
                angle={-90}
              />
            </RechartsPrimitive.YAxis>
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" hideLabel />}
              // labelFormatter={(value) => `Time: ${Number(value).toFixed(2)}s`}
            />
            <RechartsPrimitive.Area
              type="monotone"
              dataKey="value"
              stroke={Object.values(chartConfig)[0]?.color}
              fill="url(#fillIntensity)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="fillIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={Object.values(chartConfig)[0]?.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={Object.values(chartConfig)[0]?.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
          </RechartsPrimitive.AreaChart>
        </ChartContainer>
      );
    } else {
      return (
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <RechartsPrimitive.LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <RechartsPrimitive.CartesianGrid vertical={false} />
            <RechartsPrimitive.XAxis
              dataKey="time"
              tickFormatter={(value) => `${value.toFixed(1)}`}
              minTickGap={50}
            >
              <RechartsPrimitive.Label
                value="Time (s)"
                offset={0}
                position="insideBottom"
              />
            </RechartsPrimitive.XAxis>
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(1)}`}
              type="number"
              scale="linear"
              domain={[
                (dataMin: number) => Math.max(dataMin - 5, 0),
                (dataMax: number) => dataMax + 5,
              ]}
              //   interval="preserveStartEnd"
            >
              <RechartsPrimitive.Label
                value="Frequency (Hz)"
                offset={0}
                position="insideLeft"
                angle={-90}
              />
            </RechartsPrimitive.YAxis>
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" hideLabel />}
              //   labelFormatter={(value) => `Time: ${value}s`}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="value"
              stroke={Object.values(chartConfig)[0]?.color}
              strokeWidth={2}
              dot={false}
            />
          </RechartsPrimitive.LineChart>
        </ChartContainer>
      );
    }
  };

  return (
    <Card className="border-gray-200 bg-white shadow-sm col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scalar Metrics */}
        <div
          className={cn(
            "grid grid-cols-2 gap-3",
            chartType === "formants" ? "md:grid-cols-5" : "md:grid-cols-4"
          )}
        >
          {scalars.map((metric, index) => (
            <div
              key={index}
              className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              <div className="text-xs font-medium text-gray-600 mb-1">
                {metric.label}
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: metric.color }}
              >
                {metric.label !== "Voiced"
                  ? metric.value?.toFixed(2)
                  : metric.value}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  {metric.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* <Separator /> */}

        {/* Chart */}
        <div className="">{renderChart()}</div>
      </CardContent>
    </Card>
  );
};

export default AcousticCard;
