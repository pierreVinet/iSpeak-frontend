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
            />
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Formants`}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F1"
              name="F1 (Hz)"
              stroke="var(--color-F1)"
              strokeWidth={0}
              dot={{
                fill: "var(--color-F1)",
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F2"
              name="F2 (Hz)"
              stroke="var(--color-F2)"
              strokeWidth={0}
              dot={{
                fill: "var(--color-F2)",
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F3"
              name="F3 (Hz)"
              stroke="var(--color-F3)"
              strokeWidth={0}
              dot={{
                fill: "var(--color-F3)",
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F4"
              stroke="var(--color-F4)"
              name="F4 (Hz)"
              strokeWidth={0}
              dot={{
                fill: "var(--color-F4)",
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F5"
              name="F5 (Hz)"
              stroke="var(--color-F5)"
              strokeWidth={0}
              dot={{
                fill: "var(--color-F5)",
                r: 2,
              }}
              activeDot={{
                r: 4,
              }}
            />
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
            />
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(1)}`}
            />
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
            />
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(1)}`}
              type="number"
              scale="linear"
              domain={[
                (dataMin: number) => Math.max(dataMin - 5, 0),
                (dataMax: number) => dataMax + 5,
              ]}
              //   interval="preserveStartEnd"
            />
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
