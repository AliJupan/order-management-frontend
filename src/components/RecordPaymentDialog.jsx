import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function RecordPaymentDialog({
  open,
  onClose,
  balanceDue,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setAmount("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    if (value > balanceDue) {
      setError(
        `Amount cannot exceed balance due of $${balanceDue.toFixed(2)}.`,
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(value);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to record payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          slotProps={{
            input: { inputProps: { min: 0, max: balanceDue, step: 0.01 } },
          }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Recording..." : "Record Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
