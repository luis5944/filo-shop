import { IProduct } from "../interfaces";
import { Product } from "../models";
import { connect, disconnect } from "./db";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await connect();
  const product = await Product.findOne({ slug }).lean();
  await disconnect();

  if (!product) {
    return null;
  }

  product.images = product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });

  return JSON.parse(JSON.stringify(product));
};

interface Productslug {
  slug: string;
}
export const getAllProductSlugs = async (): Promise<Productslug[]> => {
  await connect();
  const slugs = await Product.find().select("slug -_id").lean();
  await disconnect();

  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  await connect();
  const products = await Product.find({
    $text: { $search: term.toString().toLowerCase() },
  })
    .select("title images price inStock slug -_id")
    .lean();
  await disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return updatedProducts;
};
export const getAllProducts = async (): Promise<IProduct[]> => {
  await connect();
  const products = await Product.find()
    .select("title images price inStock slug -_id")
    .lean();
  await disconnect();
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
  return updatedProducts;
};
