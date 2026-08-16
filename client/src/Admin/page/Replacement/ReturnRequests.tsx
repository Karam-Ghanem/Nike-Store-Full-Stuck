import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MainTitle from "@/components/PublicCompontents/MainTitle";
import { commerceApi, type ApiReturnRequest } from "@/api/commerce";

const statusColor = (status: ApiReturnRequest["status"]) => {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  return "warning";
};

const ReturnRequests = () => {
  const [requests, setRequests] = useState<ApiReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      setRequests(await commerceApi.getReturns());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const updateRequest = async (request: ApiReturnRequest, action: "approve" | "reject") => {
    const actionLabel = action === "approve" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${actionLabel} this return request?`)) return;
    setBusyId(request.id);
    setError("");
    try {
      const updated = action === "approve"
        ? await commerceApi.approveReturn(request.id)
        : await commerceApi.rejectReturn(request.id);
      setRequests((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Unable to ${actionLabel} the return request.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box>
      <MainTitle title="RETURN REQUESTS" />
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} mb={2} gap={1}>
        <Typography color="text.secondary">Review customer return requests and update their status.</Typography>
        <Button variant="outlined" onClick={() => void loadRequests()} disabled={loading}>Refresh</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Stack alignItems="center" py={6}><CircularProgress /></Stack>
      ) : requests.length === 0 ? (
        <Paper sx={{ p: 4 }}><Typography color="text.secondary">There are no return requests yet.</Typography></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Request</TableCell>
                <TableCell>Customer / Order</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => {
                const isBusy = busyId === request.id;
                const isPending = request.status === "requested";
                return (
                  <TableRow key={request.id} hover>
                    <TableCell>#{request.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>Order #{request.order_id}</Typography>
                      <Typography variant="body2" color="text.secondary">Deadline: {new Date(request.return_deadline).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{request.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Size {request.product_size.size} · Qty {request.quantity}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240, whiteSpace: "normal" }}>{request.reason || "No reason provided"}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell><Chip size="small" label={request.status} color={statusColor(request.status)} /></TableCell>
                    <TableCell align="right">
                      {isPending ? (
                        <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="contained" color="success" disabled={isBusy} onClick={() => void updateRequest(request, "approve")}>
                            {isBusy ? "..." : "Approve"}
                          </Button>
                          <Button size="small" variant="outlined" color="error" disabled={isBusy} onClick={() => void updateRequest(request, "reject")}>
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Completed</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReturnRequests;
