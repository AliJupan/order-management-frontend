import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import customerApi from "../api/customerApi";

import OrdersTable from "../features/orders/OrdersTable";

const formatPrice = (price) =>
  Number(price ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await customerApi.getById(id);
      setCustomer(data);

      setCustomer(data);
    } catch (err) {
      console.error("Failed to load customer:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/customer")}
          sx={{ mb: 3 }}
        >
          Back to customers
        </Button>

        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchCustomer}
            >
              Retry
            </Button>
          }
        >
          Failed to load customer details.
        </Alert>
      </Box>
    );
  }

  const orders = customer.orders ?? [];

  const totalOrdered = orders.reduce(
    (total, order) => total + Number(order.totalPrice ?? 0),
    0,
  );

  const totalPaid = orders.reduce(
    (total, order) => total + Number(order.totalPaid ?? 0),
    0,
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/customer")}
        sx={{ mb: 3 }}
      >
        Back to customers
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
          {customer.name}
        </Typography>

        <Typography color="text.secondary">
          Customer details and order history
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Contact information
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography>{customer.email || "—"}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <PhoneIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography>{customer.phone || "—"}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography>{customer.address || "—"}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Total orders
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    {orders.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Total order value
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    ${formatPrice(totalOrdered)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Total paid
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    ${formatPrice(totalPaid)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Order history
        </Typography>
        <Typography color="text.secondary">
          All orders associated with this customer.
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">No orders yet</Typography>
          <Typography color="text.secondary">
            This customer doesn't have any orders.
          </Typography>
        </Paper>
      ) : (
        <>
          <OrdersTable
            orders={orders}
          />
        </>
      )}
    </Box>
  );
}
