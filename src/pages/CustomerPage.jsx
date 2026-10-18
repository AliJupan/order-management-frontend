import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import useCustomers from "../hooks/useCustomer";
import CustomersTable from "../features/customer/CustomerTable";

import CustomerCreateDialog from "../components/CustomerCreateDialog.jsx";

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    refetch,
    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize,
    setSearchTerm,
    removeCustomer,
  } = useCustomers();

  const [searchInput, setSearchInput] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput, setSearchTerm]);

  const handleDelete = async (id) => {
    await removeCustomer(id);
  };

  const handleEdit = (customer) => {
    console.log("Edit customer:", customer);
  };

  const hasCustomers = customers.length > 0;

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
          Customers
        </Typography>

        <Typography color="text.secondary">
          View, search, and manage your customers.
        </Typography>

        <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
          Add customer
        </Button>
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
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer name, email, or phone"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPageNumber(0);
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
          Failed to load customers. Please try again.
        </Alert>
      )}

      {!loading && !error && !hasCustomers && (
        <Box
          sx={{
            py: 9,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No customers found
          </Typography>

          <Typography color="text.secondary">
            Try changing your search or add a new customer.
          </Typography>
        </Box>
      )}

      {!loading && !error && hasCustomers && (
        <>
          <CustomersTable
            customers={customers}
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
              setPageNumber(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}

      <CustomerCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={refetch}
      />
    </Box>
  );
}
