"use client";

import { LineChart } from "@/app/_components/tremor/LineChart";
import { formatLargeNumber } from "@/utils/utils";

export default function UseageChart({
  data,
}: {
  data: Array<Record<string, unknown>>;
}) {
  return (
    <LineChart
      className="h-80 w-full"
      intervalType="preserveStartEnd"
      data={data}
      index="date"
      valueFormatter={(v) => formatLargeNumber(v)}
      yAxisLabel="Request Count"
      showLegend={false}
      categories={["Count"]}
    />
  );
}
