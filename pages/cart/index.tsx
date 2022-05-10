import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { useContext, useEffect } from "react";
import { CartContext } from "../../context/cart";
import { useRouter } from "next/router";

const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart, router]);

  if (!isLoaded || cart.length === 0) {
    return <></>;
  }
  return (
    <ShopLayout
      title={"Carrito"}
      pageDescription={"Carrito de compras de la tienda"}
    >
      <Typography variant="h1" component={"h1"}>
        Carrito
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={5}>
          {/* CartList */}
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5} sx={{ marginLeft: { sm: 10 } }}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component={"h2"}>
                Orden
              </Typography>
              <Divider sx={{ marginY: 1 }} />

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address"
                >
                  Procesar la compra
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
