import { sql } from "drizzle-orm";

import { db } from "@/schema/db";
import ClientPage from "./ClientPage";

export const revalidate = 86400; // 60 * 60 * 24

export default async function Page() {
  const data = db.execute(sql`WITH daily_stats AS (
    SELECT 
        DATE_TRUNC('DAY', vr.timestamp) AS day,
        (mr.stats->>'wps')::DECIMAL AS wps
    FROM 
        miner_response mr
    JOIN 
        validator_request vr ON mr.r_nanoid = vr.r_nanoid
    WHERE 
        vr.timestamp >= NOW() - INTERVAL '7 days'
        AND (mr.stats->>'verified')::BOOLEAN = TRUE
        AND mr.stats->>'wps' IS NOT NULL
),
daily_aggregates AS (
    SELECT 
        day,
        MAX(wps) AS max_wps,
        PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY wps) AS percentile_80_wps
    FROM 
        daily_stats
    GROUP BY 
        day
    ORDER BY 
        day
),
final_aggregates AS (
    SELECT
        da.day,
        da.max_wps,
        da.percentile_80_wps,
        LAG(da.percentile_80_wps) OVER (ORDER BY da.day) AS previous_percentile_80_wps,
        ((da.percentile_80_wps - LAG(da.percentile_80_wps) OVER (ORDER BY da.day)) / LAG(da.percentile_80_wps) OVER (ORDER BY da.day) * 100) AS percent_change_percentile_80_wps
    FROM daily_aggregates da
    WHERE da.percentile_80_wps IS NOT NULL
)
SELECT 
    day, 
    max_wps,
    percentile_80_wps,
    percent_change_percentile_80_wps
FROM final_aggregates
WHERE previous_percentile_80_wps IS NOT NULL
ORDER BY day;`);
  return <ClientPage data={await data} />;
}
