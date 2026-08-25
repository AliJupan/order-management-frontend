import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import RemoveIcon from "@mui/icons-material/Remove";

import customersApi from "../api/customersApi.js";
import useOrderForm from "../features/orders/useOrderForm.js";
import ProductFormDialog from "../features/products/ProductFormDialog.jsx";

const currency = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);
};

export default function OrderFormPage({ onOrderCreated }) {
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);

  const [customersError, setCustomersError] = useState("");

  const barcodeRef = useRef(null);

  const {
    customerId,
    setCustomerId,

    dueDate,
    setDueDate,

    totalPaid,
    setTotalPaid,

    orderType,
    setOrderType,

    discountPercentage,
    setDiscountPercentage,

    items,
    subTotal,
    orderTotal,

    barcodeInput,
    setBarcodeInput,

    barcodeError,
    barcodeLoading,

    addItemByBarcode,
    updateItemQuantity,
    removeItem,

    submitting,
    submitError,
    submit,

    newProductDialogOpen,
    pendingBarcode,
    handleNewProductCreated,
    closeNewProductDialog,
  } = useOrderForm();

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      try {
        const data = await customersApi.getAll();

        if (active) {
          setCustomers(data);
        }
      } catch {
        if (active) {
          setCustomersError("Couldn't load customers.");
        }
      } finally {
        if (active) {
          setCustomersLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      active = false;
    };
  }, []);

  const selectedCustomer =
    customers.find((customer) => customer.id === customerId) ?? null;

  const partyLabel = orderType === "Purchase" ? "Supplier" : "Customer";

  const handleBarcodeKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addItemByBarcode();
    }
  };

  const handleSave = async () => {
    const result = await submit();

    if (result.success) {
      onOrderCreated?.(result.order);

      barcodeRef.current?.focus();
    }
  };

  const canIncrement = (item) => {
    return orderType !== "Sale" || item.quantity < item.maxQuantity;
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      {/* Page header */}

      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{
          mb: 4,
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
            Create Order
          </Typography>

          <Typography color="text.secondary">
            Add products and complete a new sale or purchase.
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
            }}
          >
            Order type
          </Typography>

          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={(_, value) => {
              if (value) {
                setOrderType(value);
              }
            }}
            sx={{
              backgroundColor: "action.hover",

              borderRadius: "999px",

              p: 0.5,

              "& .MuiToggleButtonGroup-grouped": {
                border: 0,

                borderRadius: "999px !important",

                px: 2.5,

                py: 0.75,

                textTransform: "none",

                fontWeight: 600,

                color: "text.secondary",

                "&.Mui-selected": {
                  backgroundColor: "background.paper",

                  color: "text.primary",

                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",

                  "&:hover": {
                    backgroundColor: "background.paper",
                  },
                },
              },
            }}
          >
            <ToggleButton value="Sale">Sale</ToggleButton>

            <ToggleButton value="Purchase">Purchase</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>

      {/* Customer information and summary */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={3}
        alignItems="flex-start"
        sx={{
          mb: 3,
        }}
      >
        {/* Customer information */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            flex: 2,
            width: "100%",
            borderRadius: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {partyLabel}
            {" information"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Select the
            {` ${partyLabel.toLowerCase()}`}
            {" and enter payment details."}
          </Typography>

          <Stack
            spacing={2}
            sx={{
              mt: 3,
            }}
          >
            <Autocomplete
              options={customers}
              loading={customersLoading}
              value={selectedCustomer}
              getOptionLabel={(customer) =>
                customer?.name ?? customer?.fullName ?? customer?.email ?? ""
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => {
                setCustomerId(value?.id ?? null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={partyLabel}
                  placeholder={`Search ${partyLabel.toLowerCase()}s`}
                  slotProps={{
                    ...params.slotProps,

                    input: {
                      ...params.slotProps?.input,

                      endAdornment: (
                        <>
                          {customersLoading ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : null}

                          {params.slotProps?.input?.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Due date"
              type="datetime-local"
              fullWidth
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value);
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                label="Amount paid"
                type="number"
                fullWidth
                value={totalPaid}
                onChange={(event) => {
                  setTotalPaid(event.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },

                  htmlInput: {
                    min: 0,
                  },
                }}
              />

              <TextField
                label="Discount"
                type="number"
                fullWidth
                value={discountPercentage}
                onChange={(event) => {
                  setDiscountPercentage(event.target.value);
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },

                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </Stack>
          </Stack>

          {customersError && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
              }}
            >
              {customersError}
            </Alert>
          )}
        </Paper>

        {/* Order summary */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,

            flex: 1,

            width: "100%",

            display: "flex",

            flexDirection: "column",

            borderRadius: 3,

            alignSelf: "flex-start",

            position: {
              md: "sticky",
            },

            top: {
              md: 24,
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Order Summary
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Review the order before saving.
          </Typography>

          <Stack
            spacing={1.5}
            sx={{
              mt: 3,
              flexGrow: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>

              <Typography variant="body2">{currency(subTotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Discount
              </Typography>

              <Typography variant="body2">
                {discountPercentage || 0}%
              </Typography>
            </Stack>

            <Divider
              sx={{
                my: 1,
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Total
              </Typography>

              <Typography variant="h6" fontWeight={700}>
                {currency(orderTotal)}
              </Typography>
            </Stack>
          </Stack>

          {submitError && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
              }}
            >
              {submitError}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSave}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{
              mt: 3,
            }}
          >
            {submitting ? "Saving..." : "Save Order"}
          </Button>
        </Paper>
      </Stack>

      {/* Scan product */}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          borderColor: "primary.light",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 0.5,
          }}
        >
          <QrCodeScannerIcon color="primary" />

          <Typography variant="subtitle1" fontWeight={600}>
            Scan Product
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
          }}
        >
          Scan a barcode or enter it manually.
        </Typography>

        <TextField
          inputRef={barcodeRef}
          fullWidth
          autoFocus
          placeholder="Scan barcode or type manually..."
          value={barcodeInput}
          onChange={(event) => {
            setBarcodeInput(event.target.value);
          }}
          onKeyDown={handleBarcodeKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <QrCodeScannerIcon fontSize="small" />
                </InputAdornment>
              ),

              endAdornment: barcodeLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {barcodeError && (
          <Alert
            severity="warning"
            sx={{
              mt: 2,
            }}
          >
            {barcodeError}
          </Alert>
        )}
      </Paper>

      {/* Products */}

      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

          borderRadius: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Products
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mb: 2,
          }}
        >
          {items.length} {items.length === 1 ? "product" : "products"} added to
          this order.
        </Typography>

        {items.length === 0 ? (
          <Box
            sx={{
              py: 8,

              textAlign: "center",
            }}
          >
            <QrCodeScannerIcon
              sx={{
                fontSize: 48,

                color: "text.disabled",

                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              No products added
            </Typography>

            <Typography color="text.secondary">
              Scan a barcode or enter one manually to add your first product.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              overflowX: "auto",
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 700,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>

                  <TableCell align="right">Stock</TableCell>

                  <TableCell align="center">Qty</TableCell>

                  <TableCell align="right">Price</TableCell>

                  <TableCell align="right">Total</TableCell>

                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{item.name}</Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={
                          orderType === "Sale" &&
                          item.quantity >= item.maxQuantity
                            ? "error"
                            : "text.secondary"
                        }
                      >
                        {item.maxQuantity}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            updateItemQuantity(
                              item.productId,
                              item.quantity - 1,
                            );
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="inherit" />
                        </IconButton>

                        <Typography
                          sx={{
                            width: 28,

                            textAlign: "center",

                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() => {
                            updateItemQuantity(
                              item.productId,
                              item.quantity + 1,
                            );
                          }}
                          disabled={!canIncrement(item)}
                        >
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      {currency(item.unitPrice)}
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        {currency(item.quantity * item.unitPrice)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          removeItem(item.productId);
                        }}
                        aria-label={`Remove ${item.name || "item"}`}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* New product dialog */}

      <ProductFormDialog
        open={newProductDialogOpen}
        onClose={closeNewProductDialog}
        onSuccess={handleNewProductCreated}
        product={null}
        initialBarcode={pendingBarcode}
      />
    </Box>
  );
}
