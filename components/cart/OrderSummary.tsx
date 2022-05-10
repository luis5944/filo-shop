import React from "react";
import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { CartContext } from "../../context/cart/CartContext";
import { format } from "../../utils";
import { NextPage } from "next";

interface Props {
  orderSummary?: {
    numberOfItems?: number;
    subTotal?: number;
    tax?: number;
    totalPrice?: number;
  };
}
export const OrderSummary: NextPage<Props> = ({ orderSummary = {} }) => {
  let { numberOfItems, subTotal, tax, totalPrice } = useContext(CartContext);

  if (Object.entries(orderSummary).length !== 0) {
    numberOfItems = orderSummary.numberOfItems!;
    subTotal = orderSummary.subTotal!;
    tax = orderSummary.tax!;
    totalPrice = orderSummary.totalPrice!;
  }
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Núm. Productos:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent={"end"}>
        <Typography>{numberOfItems}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent={"end"}>
        <Typography>{format(subTotal!)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos (21%):</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent={"end"}>
        <Typography>{`${format(tax!)}`}</Typography>
      </Grid>

      <Grid item xs={6} marginTop={3}>
        <Typography fontWeight={800}>Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent={"end"} marginTop={3}>
        <Typography fontWeight={800}>{`${format(totalPrice!)}`}</Typography>
      </Grid>
    </Grid>
  );
};
