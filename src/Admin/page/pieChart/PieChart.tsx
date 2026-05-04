import { Box } from "@mui/material";
import Pie from "./pie";
import Header from "../../components/Header/Header";

const PieChart = () => {
  // const theme = useTheme();
  return (
    <Box>
      <Header  isDashboard={true} title="Pie Chart" subTitle="Simple Pie Chart" />

      <Pie />
    </Box>
  );
};

export default PieChart;
