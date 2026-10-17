import { Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { OrderType } from "../features/orders/orderEnum.js";

export default function OrderTypeChart({ data }) {
  const pieData = data.map((d, i) => {
    const orderType = Object.values(OrderType).find(
      (type) => type.value === d.type
    );

    return {
      id: i,
      value: d.count,
      label: orderType?.label ?? d.type,
    };
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
        Orders by Type
      </Typography>

      <PieChart
        height={280}
        series={[
          {
            data: pieData,
            innerRadius: 50,
          },
        ]}
      />
    </Paper>
  );
}