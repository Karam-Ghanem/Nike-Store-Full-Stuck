import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import { columns, rows } from "./data";

const Contacts = () => {
  return (
    <Box>
      <Header
        isDashboard={true}
        title="CONTACTS"
        subTitle="List of Contacts for Future Reference"
      />

      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          columns={columns as GridColDef[]}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
