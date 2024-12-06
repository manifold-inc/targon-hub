import { InfluxDB, Point } from "@influxdata/influxdb-client";

import { env } from "@/env.mjs";

const influxClient = new InfluxDB({
  url: env.INFLUX_URL,
  token: env.INFLUX_TOKEN,
});
const writeApi = influxClient.getWriteApi(env.INFLUX_ORG, env.INFULX_BUCKET);

export async function reportErrorToInflux(error: Error) {
  if (env.NODE_ENV !== "production") {
    return;
  }
  const point = new Point("targon-hub")
    .tag("level", "error")
    .stringField("error", error)
    .timestamp(new Date());

  writeApi.writePoint(point);
  await writeApi.flush();
}
