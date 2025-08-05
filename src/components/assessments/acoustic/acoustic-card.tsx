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
        <ChartContainer config={chartConfig}>
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
              labelFormatter={(value) => `Time: ${Number(value).toFixed(2)}s`}
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F1"
              stroke="var(--color-F1)"
              strokeWidth={2}
              dot={false}
              name="F1 (Hz)"
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F2"
              stroke="var(--color-F2)"
              strokeWidth={2}
              dot={false}
              name="F2 (Hz)"
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F3"
              stroke="var(--color-F3)"
              strokeWidth={2}
              dot={false}
              name="F3 (Hz)"
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F4"
              stroke="var(--color-F4)"
              strokeWidth={2}
              dot={false}
              name="F4 (Hz)"
            />
            <RechartsPrimitive.Line
              type="monotone"
              dataKey="F5"
              stroke="var(--color-F5)"
              strokeWidth={2}
              dot={false}
              name="F5 (Hz)"
            />
          </RechartsPrimitive.LineChart>
        </ChartContainer>
      );
    } else if (chartType === "area") {
      return (
        <ChartContainer config={chartConfig}>
          <RechartsPrimitive.AreaChart data={chartData}>
            <RechartsPrimitive.XAxis
              dataKey="time"
              tickFormatter={(value) => `${value.toFixed(1)}s`}
            />
            <RechartsPrimitive.YAxis
              tickFormatter={(value) => `${value.toFixed(1)}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Time: ${Number(value).toFixed(2)}s`}
            />
            <RechartsPrimitive.Area
              type="monotone"
              dataKey="value"
              stroke={Object.values(chartConfig)[0]?.color}
              fill={Object.values(chartConfig)[0]?.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
