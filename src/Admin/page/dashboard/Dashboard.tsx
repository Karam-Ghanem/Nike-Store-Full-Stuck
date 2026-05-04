import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import { Stack } from "@mui/material";
import Header from "../../components/Header/Header";

const Dashboard = () => {
  // const theme = useTheme();
  return (
    <div>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          isDashboard={true}
          title={"DASHBOARD"}
          subTitle={"Welcome to your dashboard"}
        />
      </Stack>

      <Row1 />
      <Row2 />
      <Row3 />
    </div>
  );
};

export default Dashboard;
