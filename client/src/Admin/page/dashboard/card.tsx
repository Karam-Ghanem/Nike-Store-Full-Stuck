import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import React from "react";

interface PieData {
  id: string;
  label: string;
  value: number;
}

interface Props {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  increase: string;
  data: PieData[];
  scheme: import("@nivo/colors").ColorSchemeId;
}

const Card = ({ icon, title, subTitle, increase, data, scheme }: Props) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        flexGrow: 1,
        width: { xs: "100%", sm: "100%", md: "auto" },
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        minWidth: { xs: "100%", sm: "160px", md: "180px" },
      }}
    >
      {/* ICON */}
      <Box>{icon}</Box>

      {/* TITLE */}
      <Typography
        sx={{
          fontSize: { xs: "13px", sm: "14px", md: "15px" },
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      {/* SUBTITLE */}
      <Typography
        sx={{
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          color: theme.palette.text.secondary,
        }}
      >
        {subTitle}
      </Typography>

      {/* PIE + INCREASE */}
      <Stack alignItems="center" width="100%" mt={1}>
        <Box
          sx={{
            height: { xs: "55px", sm: "60px", md: "70px" },
            width: { xs: "55px", sm: "60px", md: "70px" },
          }}
        >
          <ResponsivePie
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            innerRadius={0.7}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            colors={{ scheme }}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={6}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "11px", sm: "12px", md: "13px" },
            mt: 0.5,
          }}
        >
          {increase}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Card;
