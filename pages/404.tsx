import { Box, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../components/layouts";

const ErrorPage = () => {
  return (
    <ShopLayout
      title={"Página no encontrada"}
      pageDescription={"Esa página no existe"}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={"center"}
        alignItems="center"
        height="calc(100vh - 200px)"
      >
        <Typography
          variant="h1"
          component="h1"
          fontSize={80}
          fontWeight={200}
        >
          404 |
        </Typography>
        <Typography marginLeft={2}>
          No encontramos ninguna página aquí
        </Typography>
      </Box>
    </ShopLayout>
  );
};

export default ErrorPage;
