import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces/order";
import { countries } from "../../utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import tesloApi from "../../api/tesloApi";
import { useRouter } from "next/router";

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en PayPal");
    }
    setIsPaying(true);
    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert("Error");
    }
  };
  return (
    <ShopLayout
      title={"Resumen de la compra"}
      pageDescription={"Resumen de la compra de la tienda"}
    >
      <Typography variant="h1" component={"h1"}>
        {`Compra: ${order._id}`}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ marginY: 2 }}
          label="Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ marginY: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Divider sx={{ marginY: 2 }} />
      <Grid container>
        <Grid item xs={12} sm={5}>
          <CartList products={order.orderItems} editable={false} />
        </Grid>

        <Grid item xs={12} sm={5} sx={{ marginLeft: { sm: 10 } }}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component={"h2"}>
                {`   Resumen (${order.numberOfItems} producto/s)`}
              </Typography>
              <Divider sx={{ marginY: 1 }} />

              <Typography variant="subtitle1">Dirección de entrega:</Typography>
              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}{" "}
              </Typography>
              <Typography>
                {shippingAddress.address}
                {shippingAddress.address2
                  ? `- ${shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.city} - {shippingAddress.zip}
              </Typography>
              <Typography>
                {
                  countries.find((c) => c.code === shippingAddress.country)!
                    .name
                }
              </Typography>
              <Divider sx={{ marginY: 1 }} />

              <OrderSummary
                orderSummary={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  totalPrice: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection={"column"}>
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                  flexDirection="column"
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ marginY: 2 }}
                      label="Pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      order,
    },
  };
};
export default OrderPage;
