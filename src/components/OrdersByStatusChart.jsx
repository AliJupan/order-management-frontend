import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { OrderStatus } from "../features/orders/orderEnum.js";

const MUI_COLOR_HEX = {
  default: "#9e9e9e",
  primary: "#1976d2",
  secondary: "#9c27b0",
  success: "#2e7d32",
  error: "#d32f2f",
  warning: "#ed6c02",
  info: "#0288d1",
};

export default function OrdersByStatusChart({ data }) {
  const labels = data.map((d) => {
    const status = Object.values(OrderStatus).find(
      (s) => s.value === d.status
    );

    return status?.label ?? d.status;
  });

  const counts = data.map((d) => d.count);

  const colors = data.map((d) => {
    const status = Object.values(OrderStatus).find(
      (s) => s.value === d.status
    );

    return MUI_COLOR_HEX[status?.color] ?? MUI_COLOR_HEX.default;
  });

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
        Orders by Status
      </Typography>

      <BarChart
        height={280}
        xAxis={[
          {
            data: labels,
            scaleType: "band",
            colorMap: {
              type: "ordinal",
              colors: colors,
            },
          },
        ]}
        series={[{ data: counts, label: "Orders" }]}
      />
    </Paper>
  );
}