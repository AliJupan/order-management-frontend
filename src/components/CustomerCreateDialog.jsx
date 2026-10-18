
import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import customersApi from "../api/customerApi";

const initialForm = {
  Name: "",
  Email: "",
  Phone: "",
  Address: "",
};

export default function CustomerCreateDialog({
  open,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (loading) return;

    setForm(initialForm);
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await customersApi.create({
        Name: form.Name.trim(),
        Email: form.Email.trim(),
        Phone: form.Phone.trim(),
        Address: form.Address.trim(),
      });

      setForm(initialForm);
      onCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create customer:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create customer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create customer</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            name="Name"
            label="Customer name"
            value={form.Name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            margin="normal"
          />

          <TextField
            name="Email"
            label="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            name="Phone"
            label="Phone"
            value={form.Phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="Address"
            label="Address"
            value={form.Address}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            margin="normal"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create customer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
