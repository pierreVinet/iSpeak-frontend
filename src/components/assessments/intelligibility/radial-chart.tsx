"use client";
import React from "react";
import { ChartConfig, ChartContainer } from "../../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { clampPercentage, cn } from "@/lib/utils";

const chartConfig = {
  //   intelligibility: {
  //     label: "Intelligibility",
  //   },
  intelligibility: {
    label: "Intelligibility",
    color: "var(--chart-2)",
  },
  value: {
    label: "Intelligibility",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const RadialChart = ({
  title,
  value,
  fill,
  size = "md",
}: {
  title: string;
  value: number;
  fill: string;
  size?: "sm" | "md";
}) => {
  const clampedValue = clampPercentage(value);
  const valueAngle = (clampedValue / 100) * 360;
  const endAngle = Math.min(valueAngle - 270, 90);
  const chartData = [
    {
      intelligibility: 1,
      fill: fill,
    },
  ];
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[200px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={-270}
        endAngle={endAngle}
        innerRadius={size === "sm" ? 48 : 80}
        outerRadius={size === "sm" ? 70 : 110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[size === "sm" ? 51.5 : 86, size === "sm" ? 43.5 : 74]}
        />
        <RadialBar dataKey="intelligibility" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={cn(
                        "fill-foreground font-bold",
                        size === "sm" ? "text-2xl" : "text-4xl"
                      )}
                    >
                      {Math.round(clampedValue)}%
                    </tspan>
                    {size !== "sm" && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {title}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

export default RadialChart;
