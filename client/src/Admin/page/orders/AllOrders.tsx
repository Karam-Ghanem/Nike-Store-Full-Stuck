import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MainTitle from "@/components/PublicCompontents/MainTitle";
import { commerceApi, type ApiOrder } from "@/api/commerce";

const statusColor = (status: string) => {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "returned") return "info";
  return "warning";
};

const AllOrders = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await commerceApi.getOrders());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesSearch = !query || [
        String(order.id), order.full_name, order.email, order.phone,
      ].some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  return (
    <Box>
      <MainTitle title="ALL ORDERS" />
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} gap={2} mb={2}>
        <Typography color="text.secondary">View and monitor all customer orders from the live store.</Typography>
        <Button variant="outlined" onClick={() => void loadOrders()} disabled={loading}>Refresh</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction={{ xs: "column", sm: "row" }} gap={2} mb={2}>
        <TextField label="Search by order, customer, email or phone" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="order-status-filter">Status</InputLabel>
          <Select labelId="order-status-filter" value={status} label="Status" onChange={(event) => setStatus(event.target.value)}>
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="returned">Returned</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {loading ? (
        <Stack alignItems="center" py={6}><CircularProgress /></Stack>
      ) : filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4 }}><Typography color="text.secondary">No orders match the current filters.</Typography></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Returns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography fontWeight={700}>#{order.id}</Typography>
                    {order.coupon_code && <Typography variant="caption" color="text.secondary">Coupon: {order.coupon_code}</Typography>}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{order.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.phone}</Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 220 }}>
                    {order.items.map((item) => (
                      <Typography key={item.id} variant="body2">{item.product.name} · {item.product_size.size} · x{item.quantity}</Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={700}>${Number(order.total_amount).toFixed(2)}</Typography>
                    {Number(order.discount_amount) > 0 && <Typography variant="caption" color="success.main">-${Number(order.discount_amount).toFixed(2)} discount</Typography>}
                  </TableCell>
                  <TableCell><Chip size="small" label={order.status} color={statusColor(order.status)} /></TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {order.return_requested ? <Chip size="small" label="Requested" color="warning" /> : <Typography variant="body2" color="text.secondary">None</Typography>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllOrders;
