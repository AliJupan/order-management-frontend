import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import { decodeToken } from "../utils/jwt.js";
import useAuth from "../hooks/useAuth.js";
import useDashboard from "../hooks/useDashboard.js";
import StatCard from "../components/StatCard.jsx";

import useDashboardCharts from "../hooks/useDashboardCharts.js";
import RevenueTrendChart from "../components/RevenueTrendChart.jsx";
import OrdersByStatusChart from "../components/OrdersByStatusChart.jsx";
import OrderTypeChart from "../components/OrderTypeChart.jsx";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { token } = useAuth();
  const displayName = decodeToken(token)?.name ?? "User";
  const { summary, loading, error } = useDashboard();
  const {
    charts,
    loading: chartsLoading,
    error: chartsError,
  } = useDashboardCharts();

  const stats = summary
    ? [
        {
          label: "Total Products",
          value: summary.totalProducts,
          icon: (
            <Inventory2OutlinedIcon color="primary" sx={{ fontSize: 42 }} />
          ),
        },
        {
          label: "Total Orders",
          value: summary.totalOrders,
          icon: (
            <ReceiptLongOutlinedIcon color="primary" sx={{ fontSize: 42 }} />
          ),
        },
        {
          label: "Total Revenue",
          value: `$${summary.totalRevenue.toFixed(2)}`,
          icon: <PaidOutlinedIcon color="success" sx={{ fontSize: 42 }} />,
        },
        {
          label: "Low Stock Products",
          value: summary.lowStockProducts,
          icon: (
            <WarningAmberOutlinedIcon color="warning" sx={{ fontSize: 42 }} />
          ),
        },
        {
          label: "Pending Orders",
          value: summary.pendingOrders,
          icon: (
            <HourglassEmptyOutlinedIcon color="action" sx={{ fontSize: 42 }} />
          ),
        },
        {
          label: "Total Spend",
          value: `$${summary.totalSpend.toFixed(2)}`,
          icon: (
            <TrendingDownOutlinedIcon color="error" sx={{ fontSize: 42 }} />
          ),
        },
        {
          label: "Net Profit",
          value: `$${summary.netProfit.toFixed(2)}`,
          icon: (
            <TrendingUpOutlinedIcon
              color={summary.netProfit >= 0 ? "success" : "error"}
              sx={{ fontSize: 42 }}
            />
          ),
        },
      ]
    : [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {getGreeting()}, {displayName}
        </Typography>
        <Typography color="text.secondary">
          Here is an overview of your business.
        </Typography>
      </Box>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error">Failed to load dashboard data.</Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!chartsLoading && !chartsError && charts && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <RevenueTrendChart data={charts.revenueTrend} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <OrderTypeChart data={charts.ordersByType} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <OrdersByStatusChart data={charts.ordersByStatus} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
