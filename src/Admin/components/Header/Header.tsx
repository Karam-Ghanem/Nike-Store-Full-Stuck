import { Box, Typography, useTheme } from "@mui/material";

interface Props {
  title: string;
  subTitle: string;
  isDashboard?: boolean;
}

const Header = ({ title, subTitle, isDashboard = false }: Props) => {
  const theme = useTheme();

  return (
    <Box
      mb={isDashboard ? { base: 1, sm: 2 } : { base: 2, sm: 4 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { base: 0.5, sm: 1 },
      }}
    >
      <Typography
        sx={{
          color: theme.palette.info.light,
          fontWeight: "bold",
          fontSize: {
            xs: "16px",
            sm: "20px",
            md: "24px",
            lg: "28px",
          },
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: {
            xs: "10px",
            sm: "12px",
            md: "14px",
            lg: "16px",
          },
          color: theme.palette.text.secondary,
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};

export default Header;
