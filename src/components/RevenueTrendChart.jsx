import { Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

export default function RevenueTrendChart({ data }) {
  const dates = data.map((d) => new Date(d.date));
  const revenues = data.map((d) => d.revenue);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Revenue — Last 30 Days
      </Typography>
      <LineChart
        height={280}
        xAxis={[
          {
            data: dates,
            scaleType: "time",
            valueFormatter: (d) =>
              d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
          },
        ]}
        series={[
          {
            data: revenues,
            area: true,
            label: "Revenue",
            valueFormatter: (v) => `$${v.toFixed(2)}`,
          },
        ]}
      />
    </Paper>
  );
}
