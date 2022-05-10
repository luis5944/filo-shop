import { NextPage } from "next";
import { GetStaticPaths } from "next";
import { GetStaticProps } from "next";
import { Box } from "@mui/system";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { dbProducts } from "../../database";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct } from "../../interfaces";
import { useState, useContext } from "react";
import { ISize } from "../../interfaces/products";
import { useRouter } from "next/router";
import { CartContext } from "../../context/cart/CartContext";
import { format } from "../../utils";

interface Props {
  product: IProduct;
}

export type QuantityActionType = "SUM" | "SUB";

const ProductPage: NextPage<Props> = ({ product }) => {
  const { addProduct } = useContext(CartContext);
  const router = useRouter();
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  const onSelectedSize = (size: ISize) => {
    setTempCartProduct((prev) => ({ ...prev, size }));
  };

  const updatedQuantity = (type: QuantityActionType) => {
    switch (type) {
      case "SUM":
        setTempCartProduct((prev) => ({
          ...prev,
          quantity:
            prev.quantity + 1 > product.inStock
              ? prev.quantity
              : prev.quantity + 1,
        }));
        break;
      case "SUB":
        setTempCartProduct((prev) => ({
          ...prev,
          quantity: prev.quantity - 1 <= 0 ? prev.quantity : prev.quantity - 1,
        }));
        break;
    }
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) {
      return;
    }
    addProduct(tempCartProduct);
    router.push("/cart");
  };
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {`${format(product.price)}`}
            </Typography>
            <Box sx={{ marginY: 2 }}>
              <Typography variant="subtitle2">Cantidad:</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updatedQuantity={updatedQuantity}
              />
              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={onSelectedSize}
              />
            </Box>
            {product.inStock > 0 ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddProduct}
                sx={{
                  ":hover": {
                    color: "#fff",
                    background: "red",
                  },
                }}
              >
                {tempCartProduct.size
                  ? "Agregar al carrito"
                  : "Seleccione una talla"}
              </Button>
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            )}
          </Box>

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="subtitle2">Descripción:</Typography>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs();
  return {
    paths: slugs.map(({ slug }) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};
export default ProductPage;
