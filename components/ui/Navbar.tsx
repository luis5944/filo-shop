import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { uiContext } from "../../context/ui";
import { CartContext } from "../../context/cart/CartContext";

export const Navbar = () => {
  const router = useRouter();
  const { openCloseMenu } = useContext(uiContext);
  const { numberOfItems } = useContext(CartContext);
  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link display={"flex"} alignItems={"center"}>
            <Typography variant="h6" sx={{ color: "black" }}>
              Filo /{" "}
            </Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>
        <Box sx={{ flex: "1" }} />
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <NextLink href={"/category/men"} passHref>
            <Link>
              <Button
                color={
                  router.asPath.split("/").includes("men") ? "primary" : "info"
                }
              >
                {" "}
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref>
            <Link>
              <Button
                color={
                  router.asPath.split("/").includes("women")
                    ? "primary"
                    : "info"
                }
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref>
            <Link>
              <Button
                color={
                  router.asPath.split("/").includes("kid") ? "primary" : "info"
                }
              >
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box sx={{ flex: "1" }} />

        <NextLink href={"/cart"} passHref>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? `+9` : numberOfItems}
                color="error"
                sx={{ color: "black" }}
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={openCloseMenu} sx={{ backgroundColor: "black" }}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  );
};
