import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Line from "../../page/lineChart/Line";
import { DownloadOutlined } from "@mui/icons-material";
import { Transactions } from "./data";

const Row2 = () => {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", sm: "column", md: "row" }}
      flexWrap="wrap"
      gap={{ xs: 1.5, sm: 2, md: 2 }}
      mt={1.3}
      justifyContent="space-between"
      alignItems={{ xs: "center", md: "stretch" }}
    >
      {/* LEFT CHART CARD */}
      <Paper
        sx={{
          flexGrow: 1,
          width: "100%",
          minWidth: { xs: "100%", sm: "100%", md: "380px" },
          maxWidth: { md: "900px" },
          p: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              color={theme.palette.secondary.main}
              mb={0.5}
              mt={1}
              ml={{ xs: 1, sm: 2, md: 4 }}
              variant="h6"
              fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
              fontWeight="bold"
            >
              Revenue Generated
            </Typography>

            <Typography
              variant="body2"
              ml={{ xs: 1, sm: 2, md: 4 }}
              fontSize={{ xs: "12px", sm: "13px", md: "14px" }}
            >
              $59,342.32
            </Typography>
          </Box>

          <Box>
            <IconButton sx={{ mr: { xs: 1, sm: 2, md: 3 } }}>
              <DownloadOutlined />
            </IconButton>
          </Box>
        </Stack>

        <Line isDahboard={true} />
      </Paper>

      {/* RIGHT TRANSACTIONS BOX */}
      <Box
        sx={{
          borderRadius: "4px",
          minWidth: { xs: "100%", sm: "100%", md: "280px" },
          maxHeight: 355,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Paper>
          <Typography
            color={theme.palette.secondary.main}
            fontWeight="bold"
            p={1.2}
            variant="h6"
            fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
          >
            Recent Transactions
          </Typography>
        </Paper>

        {Transactions.map((item) => (
          <Paper
            key={item.txId}
            sx={{
              mt: 0.4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 0.8, sm: 1 },
            }}
          >
            <Box>
              <Typography fontSize={{ xs: "11px", sm: "13px", md: "14px" }}>
                {item.txId}
              </Typography>
              <Typography fontSize={{ xs: "10px", sm: "12px", md: "13px" }}>
                {item.user}
              </Typography>
            </Box>

            <Typography fontSize={{ xs: "11px", sm: "13px", md: "14px" }}>
              {item.date}
            </Typography>

            <Typography
              borderRadius={1.4}
              p={{ xs: 0.6, sm: 0.8, md: 1 }}
              bgcolor={theme.palette.error.main}
              color={theme.palette.getContrastText(theme.palette.error.main)}
              fontSize={{ xs: "10px", sm: "12px", md: "13px" }}
            >
              ${item.cost}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
};

export default Row2;
