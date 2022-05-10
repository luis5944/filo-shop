import { ifError } from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect, SHOP_CONSTANTS } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | { product: IProduct };

export default async function product(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);
    default:
      return res.status(200).json({ message: "Método no existente" });
  }
}

const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await connect();
  const slug = req.query.slug;

  const productA = await Product.findOne({ slug }).lean();
  await disconnect();
  if (productA) {
    const product: IProduct = productA;
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return res.status(200).json({ product });
  }
  return res.status(404).json({ message: "Producto no encontrado" });
};
