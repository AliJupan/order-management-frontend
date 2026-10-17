import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import useOrders from "../hooks/useOrders.js";
import OrdersTable from "../features/orders/OrdersTable";

import {
  OrderStatus,
  PaidStatus,
  OrderType,
} from "../features/orders/orderEnum.js";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch,

    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize,

    setSearchTerm,

    orderStatus,
    setOrderStatus,

    paidStatus,
    setPaidStatus,

    orderType,
    setOrderType,

    removeOrder,
  } = useOrders();

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput, setSearchTerm]);

  const handleDelete = async (id) => {
    await removeOrder(id);
  };

  const handleEdit = (order) => {
    console.log("Edit order:", order);
  };

  const hasOrders = orders.length > 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Orders
        </Typography>

        <Typography color="text.secondary">
          View, search, and manage customer orders.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by order ID"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={orderStatus ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                setOrderStatus(value === "" ? undefined : Number(value));
              }}
            >
              <MenuItem value="">All statuses</MenuItem>

              {Object.entries(OrderStatus).map(([key, { value, label }]) => (
                <MenuItem key={key} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={paidStatus ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                setPaidStatus(value === "" ? undefined : Number(value));
              }}
            >
              <MenuItem value="">All payment statuses</MenuItem>

              {Object.entries(PaidStatus).map(([key, { value, label }]) => (
                <MenuItem key={key} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={orderType ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                setOrderType(value === "" ? undefined : Number(value));
              }}
            >
              <MenuItem value="">All order types</MenuItem>

              {Object.entries(OrderType).map(([key, { value, label }]) => (
                <MenuItem key={key} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
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
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refetch}
            >
              Retry
            </Button>
          }
        >
          Failed to load orders. Please try again.
        </Alert>
      )}

      {!loading && !error && !hasOrders && (
        <Box
          sx={{
            py: 9,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No orders found
          </Typography>

          <Typography color="text.secondary">
            Try changing your search or filter options.
          </Typography>
        </Box>
      )}

      {!loading && !error && hasOrders && (
        <>
          <OrdersTable
            orders={orders}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <TablePagination
            component="div"
            count={totalCount}
            page={pageNumber}
            onPageChange={(_, newPage) => {
              setPageNumber(newPage);
            }}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(event) => {
              setPageSize(parseInt(event.target.value, 10));
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Box>
  );
}
