import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import { columns, rows } from "./data";

const Invoices = () => {
  return (
    <Box>
      <Header
        isDashboard={true}
        title="INVOICES"
        subTitle="List of Invoice Balances"
      />

      <Box sx={{ height: 650, mx: "auto" }}>
        <DataGrid
          checkboxSelection
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows as GridRowsProp}
          columns={columns as GridColDef[]}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
