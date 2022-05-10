import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect, SHOP_CONSTANTS } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = IProduct[] | { message: string };

export default async function product(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getAllProducts(req, res);
    default:
      return res.status(200).json({ message: "Método no existente" });
  }
}

const getAllProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await connect();
  const { gender = "all" } = req.query;
  let condition = {};
  if (
    gender !== "all" &&
    SHOP_CONSTANTS.validGenders.includes(gender.toString())
  ) {
    condition = { gender };
  }
  const products = await Product.find(condition)
    .select("title images price inStock slug -_id")
    .lean();

  await disconnect();
  const updateProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
  return res.status(200).json(updateProducts);
};
