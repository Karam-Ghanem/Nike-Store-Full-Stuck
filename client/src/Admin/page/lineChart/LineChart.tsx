import { Box } from "@mui/material";

import Line from "./Line";
import Header from "../../components/Header/Header";

const LineChart = () => {
  // const theme = useTheme();
  return (
    <Box>
      <Header isDashboard={true} title="Line Chart" subTitle="Simple Line Chart" />

      <Line />
    </Box>
  );
};

export default LineChart;
