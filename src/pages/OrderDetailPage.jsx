import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useOrder from "../hooks/useOrder.js";
import {
  OrderStatus,
  OrderType,
  PaidStatus,
} from "../features/orders/orderEnum.js";

import RecordPaymentDialog from "../components/RecordPaymentDialog.jsx";
import StatusChip from "../components/StatusChip.jsx";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, error, recordPayment, updateStatus, statusLoading } =
    useOrder(id);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (loading) return <CircularProgress sx={{ m: 3 }} />;
  if (error)
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Failed to load order.
      </Typography>
    );
  if (!order) return <Typography sx={{ p: 3 }}>Order not found.</Typography>;

  const { customerDetail, orderItems } = order;
  const balanceDue = order.totalPrice - order.totalPaid;

  const handleStatusChange = async (newStatus) => {
    await updateStatus(newStatus);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/orders")}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Typography variant="h4" gutterBottom>
        {order.orderNumber}
      </Typography>

      <Grid container spacing={3}>
        {/* Order summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Info
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
              <Chip
                label={OrderType[order.orderType]?.label}
                color={OrderType[order.orderType]?.color}
                size="small"
              />
              <StatusChip
                status={order.orderStatus}
                options={OrderStatus}
                disabled={statusLoading}
                onChange={handleStatusChange}
              />
              <Chip
                label={PaidStatus[order.paidStatus]?.label}
                color={PaidStatus[order.paidStatus]?.color}
                size="small"
              />
            </Box>
            <Typography>
              Order Date: {new Date(order.orderDate).toLocaleString()}
            </Typography>
            <Typography>
              Due Date: {new Date(order.dueDate).toLocaleString()}
            </Typography>
            <Typography>
              Shipping Date:{" "}
              {order.shippedAt
                ? new Date(order.shippedAt).toLocaleString()
                : "Not shipped"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>Sub Total: ${order.subTotal.toFixed(2)}</Typography>
            <Typography>
              Discount Percentage: {order.discountPercentage}%
            </Typography>
            <Typography>Total Price: ${order.totalPrice.toFixed(2)}</Typography>
            <Typography>Total Paid: ${order.totalPaid.toFixed(2)}</Typography>
            <Typography color={balanceDue > 0 ? "error" : "success.main"}>
              Balance Due: ${balanceDue.toFixed(2)}
            </Typography>
            {balanceDue > 0 && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setPaymentDialogOpen(true)}
              >
                Record Payment
              </Button>
            )}

            <RecordPaymentDialog
              open={paymentDialogOpen}
              onClose={() => setPaymentDialogOpen(false)}
              balanceDue={balanceDue}
              onSubmit={recordPayment}
            />
          </Paper>
        </Grid>

        {/* Customer info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>{customerDetail.name}</Typography>
            <Typography color="text.secondary">
              {customerDetail.email}
            </Typography>
            <Typography color="text.secondary">
              {customerDetail.phone}
            </Typography>
            <Typography color="text.secondary">
              {customerDetail.address}
            </Typography>
          </Paper>
        </Grid>

        {/* Order items */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.description}</TableCell>
                    <TableCell align="right">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
