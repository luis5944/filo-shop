import {
  Typography,
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Button,
} from "@mui/material";
import { ICartProduct, IOrderItem } from "../../interfaces";
import NextLink from "next/link";
import { Box } from "@mui/system";
import { ItemCounter } from "../ui";
import { FC, useContext } from "react";
import { CartContext } from "../../context/cart";
import { QuantityActionType } from "../../pages/product/[slug]";
import { format } from "../../utils";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CartList: FC<Props> = ({ editable = false, products = [] }) => {
  const { cart, updateCartQuantity, deleteProductFromCart } =
    useContext(CartContext);

  const onNewCartQuantityValue = (
    product: ICartProduct,
    type: QuantityActionType
  ) => {
    switch (type) {
      case "SUM":
        product.quantity =
          product.quantity + 1 < 10 ? product.quantity + 1 : product.quantity;
        break;
      case "SUB":
        product.quantity =
          product.quantity - 1 <= 0 ? product.quantity : product.quantity - 1;
        break;
    }
    updateCartQuantity(product);
  };

  const productsToShow = products.length === 0 ? cart : products;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid
          sx={{ marginBottom: 1 }}
          key={`${product.slug}/${product.size}`}
          container
          spacing={2}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={
                      product.image.startsWith("http")
                        ? product.image
                        : `/products/${product.image}`
                    }
                    component="img"
                    sx={{ borderRadius: 5 }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={"flex"} flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  updatedQuantity={(type, value) => {
                    onNewCartQuantityValue(product as ICartProduct, type);
                  }}
                />
              ) : (
                <Typography variant="h6">
                  {`${product.quantity} producto/s`}{" "}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">{`${format(
              product.price
            )}`}</Typography>
            {editable && (
              <Button
                variant="text"
                color="error"
                onClick={() => deleteProductFromCart(product as ICartProduct)}
              >
                Borrar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
