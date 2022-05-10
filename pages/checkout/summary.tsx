import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";

import { CartContext } from "../../context/cart";
import { countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext);
  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, [router]);

  if (!shippingAddress) {
    return <></>;
  }

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  };
  return (
    <ShopLayout
      title={"Resumen de compra"}
      pageDescription={"Resumen de la compra de la tienda"}
    >
      <Typography variant="h1" component={"h1"}>
        Resumen de la compra
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Grid container>
        <Grid item xs={12} sm={5}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5} sx={{ marginLeft: { sm: 10 } }}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component={"h2"}>
                {` Resumen (${numberOfItems} productos)`}
              </Typography>
              <Divider sx={{ marginY: 1 }} />

              <Box display="flex" justifyContent="flex-end">
                <NextLink href={"/checkout/address"} passHref>
                  <Link underline="always">Editar Dirección</Link>
                </NextLink>
              </Box>
              <Typography variant="subtitle1">Dirección de entrega:</Typography>
              <Typography>{`${shippingAddress?.firstName} ${shippingAddress?.lastName}`}</Typography>
              <Typography>{`${shippingAddress?.address} - ${shippingAddress?.address2}`}</Typography>
              <Typography>{`${
                countries.find((c) => c.code === shippingAddress?.country || "")
                  ?.name
              } - CP: ${shippingAddress.zip}`}</Typography>
              <Typography>{`${shippingAddress?.phone}`}</Typography>
              <Divider sx={{ marginY: 1 }} />
              <Box display="flex" justifyContent="flex-end">
                <NextLink href={"/cart"} passHref>
                  <Link underline="always">Editar Carrito</Link>
                </NextLink>
              </Box>
              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar la compra
                </Button>

                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
