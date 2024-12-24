import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { TRPCError } from "@trpc/server";

import { env } from "@/env.mjs";

const influxClient = new InfluxDB({
  url: env.INFLUX_URL,
  token: env.INFLUX_TOKEN,
});
const writeApi = influxClient.getWriteApi(env.INFLUX_ORG, env.INFULX_BUCKET);

export async function reportErrorToInflux(error: Error | TRPCError) {
  if (env.NODE_ENV !== "production") {
    return;
  }
  if (error instanceof TRPCError) {
    // dont log some trpc errors
    switch (error.code) {
      case "UNAUTHORIZED":
        return;
      default:
        break;
    }
  }
  const point = new Point("targon-hub")
    .tag("level", "error")
    .stringField("msg", error)
    .timestamp(new Date());

  writeApi.writePoint(point);
  await writeApi.flush();
}
