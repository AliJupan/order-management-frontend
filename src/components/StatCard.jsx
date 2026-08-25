import { Box, Typography, Paper } from "@mui/material";

export default function StatCard({ label, value, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {value}
          </Typography>
        </Box>
        {icon}
      </Box>
    </Paper>
  );
}
