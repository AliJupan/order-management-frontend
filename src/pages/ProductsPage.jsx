import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import useProducts from "../hooks/useProducts.js";
import ProductsTable from "../features/products/ProductsTable";
import ProductFormDialog from "../features/products/ProductFormDialog";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    refetch,
    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize,
    setSearchTerm,
  } = useProducts();

  const [searchInput, setSearchInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput, setSearchTerm]);

  const handleAdd = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (product) => {
    console.log("Delete product:", product);

    // TODO:
    // await productsApi.remove(product.id);
    // refetch();
  };

  const hasProducts = products.length > 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Products
          </Typography>

          <Typography color="text.secondary">
            Manage your products and inventory.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          Add Product
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or barcode"
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        sx={{
          mb: 3,
          maxWidth: 420,
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

      {loading && (
        <Box
          sx={{
            minHeight: 250,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">
          Failed to load products. Please try again.
        </Alert>
      )}

      {!loading && !error && !hasProducts && (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {searchInput ? "No matching products found" : "No products yet"}
          </Typography>

          <Typography color="text.secondary">
            {searchInput
              ? "Try searching with a different name or barcode."
              : "Add your first product to get started."}
          </Typography>
        </Box>
      )}

      {!loading && !error && hasProducts && (
        <>
          <ProductsTable
            products={products}
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

      <ProductFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onSuccess={refetch}
        product={editingProduct}
      />
    </Box>
  );
}
