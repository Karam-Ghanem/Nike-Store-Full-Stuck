import { Box } from "@mui/material";
import Bar from "./bar";
import Header from "../../components/Header/Header";

const BarChart = () => {
  // const theme = useTheme();
  return (
    <Box>
      <Header
      isDashboard={true}
        title="Bar Chart"
        subTitle="The minimum wage in Germany, France and Spain (EUR/month)"
      />
      <Bar />
    </Box>
  );
};

export default BarChart;
