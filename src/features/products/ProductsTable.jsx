import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export default function ProductsTable({ products, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={import.meta.env.VITE_API_FILE_URL + product.imageUrl}
                >
                  {!product.imageUrl && <InventoryIcon />}
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {product.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {product.barcode}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={product.quantity}
                  size="small"
                  color={product.quantity > 0 ? "success" : "error"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit?.(product)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete?.(product)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
