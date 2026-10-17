import { Button } from "@mui/material";

const NEXT_STATUS = {
  Pending: { label: "Start Processing", next: "Processing" },
  Processing: { label: "Ship Order", next: "Shipped" },
  Shipped: { label: "Mark Delivered", next: "Delivered" },
};

function StatusChip({ status, onChange, disabled }) {
  const transition = NEXT_STATUS[status];

  if (!transition) return null;

  const handleClick = async () => {
    try {
      await onChange(transition.next);
    } catch {
      // updateStatus already stores the error in statusError; nothing to do here
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      sx={{ mt: 1 }}
      disabled={disabled}
      onClick={handleClick}
    >
      {transition.label}
    </Button>
  );
}

export default StatusChip;