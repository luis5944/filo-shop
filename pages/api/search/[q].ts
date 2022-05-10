import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect } from "../../../database";
import { IProduct } from "../../../interfaces";
import Product from "../../../models/Product";

type Data =
  | {
      message: string;
    }
  | {
      products: IProduct[];
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductByTags(req, res);
    default:
      return res.status(400).json({ message: "Método no existente" });
  }
}

const getProductByTags = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = "" } = req.query;

  if (q.length === 0) {
    return res.status(404).json({ message: "Está vacío la búsqueda" });
  }
  q = q.toString().toLocaleLowerCase();
  await connect();
  const products = await Product.find({ $text: { $search: q } }).lean();
  await disconnect();
  return res.status(200).json({ products: products });
};
