import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, MenuItem, Snackbar, Stack } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import Header from "../../components/Header/Header";

// -----------------------------
// 1) Types
// -----------------------------
interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  ContactNumber: string;
  role?: string;
}

const regEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const data = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "User", label: "User" },
];

// -----------------------------
// 2) Component
// -----------------------------
const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const [open, setOpen] = React.useState<boolean>(false);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleClick = () => setOpen(true);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("Form Submitted:", data);
    handleClick();
  };

  return (
    <Box>
      <Header isDashboard={true} title="CREATE USER" subTitle="Create a New User Profile" />

      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <Stack sx={{ gap: 2 }} direction={"row"}>
          <TextField
            error={Boolean(errors.firstName)}
            helperText={
              errors.firstName
                ? "This field is required & min 3 characters"
                : null
            }
            {...register("firstName", { required: true, minLength: 3 })}
            sx={{ flex: 1 }}
            label="First Name"
            variant="filled"
          />

          <TextField
            error={Boolean(errors.lastName)}
            helperText={
              errors.lastName
                ? "This field is required & min 3 characters"
                : null
            }
            {...register("lastName", { required: true, minLength: 3 })}
            sx={{ flex: 1 }}
            label="Last Name"
            variant="filled"
          />
        </Stack>

        <TextField
          error={Boolean(errors.email)}
          helperText={
            errors.email ? "Please provide a valid email address" : null
          }
          {...register("email", { required: true, pattern: regEmail })}
          label="Email"
          variant="filled"
        />

        <TextField
          error={Boolean(errors.ContactNumber)}
          helperText={
            errors.ContactNumber
              ? "Please provide a valid phone number"
              : null
          }
          {...register("ContactNumber", {
            required: true,
            pattern: phoneRegExp,
          })}
          label="Contact Number"
          variant="filled"
        />

        <TextField label="Address 1" variant="filled" />
        <TextField label="Address 2" variant="filled" />

        <TextField
          variant="filled"
          select
          label="Role"
          defaultValue="User"
          {...register("role")}
        >
          {data.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ textAlign: "right" }}>
          <Button
            type="submit"
            sx={{ textTransform: "capitalize" }}
            variant="contained"
          >
            Create New User
          </Button>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
              Account created successfully
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
