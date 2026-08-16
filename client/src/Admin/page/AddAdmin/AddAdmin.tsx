import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { commerceApi } from "@/api/commerce";

export default function AddAdmin() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccess("");
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSaving(true);
    try {
      const admin = await commerceApi.createAdmin({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(`Admin account "${admin.username}" was created successfully. They can now sign in.`);
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create the admin account.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Add Admin
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Create another staff account with access to the dashboard.
      </Typography>
      <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={2.5}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Username"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
            required
            fullWidth
            autoComplete="username"
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
            fullWidth
            inputProps={{ minLength: 8 }}
            helperText="At least 8 characters"
            autoComplete="new-password"
          />
          <TextField
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            required
            fullWidth
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={isSaving}>
            {isSaving ? "Creating..." : "Create Admin"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
