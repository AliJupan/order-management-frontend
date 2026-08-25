import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InventoryIcon from "@mui/icons-material/Inventory2";
import productsApi from "../../api/productsApi.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  barcode: "",
};

export default function ProductFormDialog({
  open,
  onClose,
  onSuccess,
  product,
  initialBarcode,
}) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        barcode: product.barcode ?? "",
      });
      setImagePreview(product.imageUrl ?? null);
    } else {
      setForm({ ...emptyForm, barcode: initialBarcode ?? "" });
      setImagePreview(null);
    }
    setImageFile(null);
    setError(null);
  }, [product, open, initialBarcode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", parseFloat(form.price) || 0);
    if (!isEditMode) {
      formData.append("quantity", parseInt(form.quantity, 10) || 0);
    }
    formData.append("barcode", form.barcode);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let result;
      if (isEditMode) {
        result = await productsApi.update(product.id, formData);
      } else {
        result = await productsApi.create(formData);
      }
      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.response?.data?.title || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              variant="rounded"
              src={
                import.meta.env.VITE_API_FILE_URL + imagePreview || undefined
              }
              sx={{ width: 64, height: 64 }}
            >
              {!imagePreview && <InventoryIcon />}
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
            >
              {imagePreview ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Barcode"
            value={form.barcode}
            onChange={handleChange("barcode")}
            fullWidth
            required={!isEditMode}
            disabled={isEditMode}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={handleChange("price")}
            fullWidth
            required
            slotProps={{ htmlInput: { step: "0.01", min: "0" } }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange("quantity")}
            fullWidth
            required={!isEditMode}
            disabled={isEditMode}
            slotProps={{ htmlInput: { min: "0" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !form.name || !form.price}
        >
          {submitting ? (
            <CircularProgress size={20} />
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Add Product"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
