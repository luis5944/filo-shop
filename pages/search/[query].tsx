import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { GetServerSideProps } from "next";
import { getAllProducts, getProductsByTerm } from "../../database/dbProducts";
import { IProduct } from "../../interfaces";
interface Props {
  products: IProduct[];
  query: string;
  foundProducts: boolean;
}
const QueryPage: NextPage<Props> = ({ products, query, foundProducts }) => {
  return (
    <ShopLayout
      title={"Teslo-Search"}
      pageDescription={"Encuentra la ropa que necesitas"}
    >
      <Typography variant="h1" component="h1">
        Buscar Producto
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }}>
          {`Búsqueda '${query}' - ${products.length} productos`}
        </Typography>
      ) : (
        <Typography variant="h2" sx={{ mb: 1 }}>
          {`No hay productos por el término '${query}'. Le podría interesar:`}
        </Typography>
      )}

      {<ProductList products={products} />}
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };
  let products = await getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await getAllProducts();
  }
  return {
    props: {
      products,
      query,
      foundProducts,
    },
  };
};

export default QueryPage;
