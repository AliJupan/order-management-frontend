
import { useNavigate } from "react-router-dom";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CustomersTable({
  customers,
  onEdit,
  onDelete,
}) {

  const navigate = useNavigate();

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        customer.name ?? customer.email ?? "this customer"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDelete(customer.id);
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>
              Customer
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Email
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Phone
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Address
            </TableCell>

            {/* <TableCell
              align="right"
              sx={{ fontWeight: 700 }}
            >
              Actions
            </TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              hover
              onClick={() => navigate(`/customer/${customer.id}`)}
              sx={{
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableCell>
                <Typography fontWeight={600}>
                  {customer.name ??
                    customer.fullName ??
                    "—"}
                </Typography>
              </TableCell>

              <TableCell>
                {customer.email || "—"}
              </TableCell>

              <TableCell>
                {customer.phone || "—"}
              </TableCell>

              <TableCell>
                {customer.address || "—"}
              </TableCell>

              {/* <TableCell align="right">
                <Tooltip title="Edit customer">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(customer)}
                    aria-label="Edit customer"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete customer">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(customer)}
                    aria-label="Delete customer"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell> */}
            </TableRow>
          ))}

          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No customers to display.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
