import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { CartList, OrderSummary } from "../../../components/cart";
import { ShopLayout } from "../../../components/layouts";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";
import { countries } from "../../../utils";
import { Box } from "@mui/system";

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

const OrderPageById: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;

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
              <Box display={"flex"} flexDirection="column">
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

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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
export default OrderPageById;
