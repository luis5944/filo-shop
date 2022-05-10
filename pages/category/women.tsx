import { Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Loading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"Teslo-shop-Women"}
      pageDescription={"Encuentra la ropa de mujer que necesitas"}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos de Mujer
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
