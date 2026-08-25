import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OrderStatus, PaidStatus } from "./orderEnum";

export default function OrdersTable({ orders, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <CircularProgress sx={{ m: 3 }} />;
  }

  if (!orders.length) {
    return (
      <Typography color="text.secondary" sx={{ p: 2 }}>
        No orders found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Total Paid</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              hover
              onClick={() => navigate(`/orders/${order.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>#{order.orderNumber}</TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(order.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>${order.totalPaid.toFixed(2)}</TableCell>
              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={
                    OrderStatus[order.orderStatus]?.label ?? order.orderStatus
                  }
                  color={OrderStatus[order.orderStatus]?.color}
                />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={
                    PaidStatus[order.paidStatus]?.label ?? order.paidStatus
                  }
                  color={PaidStatus[order.paidStatus]?.color}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
