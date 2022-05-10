import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useContext } from "react";
import { uiContext } from "../../context/ui";

export const AdminNavBar = () => {
  const { openCloseMenu } = useContext(uiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link display={"flex"} alignItems={"center"}>
            <Typography variant="h6">Filo / </Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>
        <Box sx={{ flex: "1" }} />

        <Button onClick={openCloseMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
