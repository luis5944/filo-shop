import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column" }}
      justifyContent={"center"}
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography variant="h1" fontWeight={700}>Cargando...</Typography>
      <CircularProgress thickness={2} sx={{ marginY: 2 }} />
    </Box>
  );
};
