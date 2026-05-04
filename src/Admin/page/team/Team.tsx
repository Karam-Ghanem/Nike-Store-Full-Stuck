import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { rows } from "./Data/data";
import { useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header/Header";
import { useMemo } from "react";

const Team = () => {
  const theme = useTheme();

  // 🔥 موبايل = إخفاء أعمدة + Scroll
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 🔥 لازم useMemo حتى يشتغل hide
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 60,
        align: "center",
        headerAlign: "center",
        hide: isMobile, 
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "age",
        headerName: "Age",
        width: 80,
        align: "center",
        headerAlign: "center",
        hide: isMobile, 
      },
      {
        field: "phone",
        headerName: "Phone",
        flex: 1,
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        hide: isMobile, 
      },
      {
        field: "access",
        headerName: "Access",
        flex: 1,
        minWidth: 150,
        align: "center",
        headerAlign: "center",

        renderCell: ({ row }) => {
          const access = row.access;

          return (
            <Box
              sx={{
                p: "5px",
                width: "110px",
                borderRadius: "3px",
                textAlign: "center",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor:
                  access === "Admin"
                    ? theme.palette.primary.dark
                    : access === "Manager"
                    ? theme.palette.secondary.dark
                    : "#3da58a",
              }}
            >
              {access === "Admin" && (
                <AdminPanelSettingsOutlined
                  sx={{ color: "#fff" }}
                  fontSize="small"
                />
              )}

              {access === "Manager" && (
                <SecurityOutlined sx={{ color: "#fff" }} fontSize="small" />
              )}

              {access === "User" && (
                <LockOpenOutlined sx={{ color: "#fff" }} fontSize="small" />
              )}

              <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                {access}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [isMobile, theme.palette] // 🔥 هون السحر
  );

  return (
    <Box>
      <Header
        isDashboard={false}
        title="TEAM"
        subTitle="Managing the Team Members"
      />

      {/* 🔥 Scroll Container للموبايل */}
      <Box
        sx={{
          width: "100%",
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        <Box
          sx={{
            height: 600,
            minWidth: isMobile ? 350 : "100%", // 🔥 على الموبايل نخلي الحد الأدنى صغير
            mx: "auto",
          }}
        >
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
        </Box>
      </Box>
    </Box>
  );
};

export default Team;
