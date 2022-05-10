import type { NextApiRequest, NextApiResponse } from "next";

import { connect, disconnect } from "../../../database";
import { Order, User, Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | {
      numberOfOrders: number;
      paidOrders: number;
      noPaidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productsNoInventory: number;
      LowInventory: number;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return getData(req, res);
}

const getData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await connect();

  const [
    numberOfOrders,
    paidOrders,
    noPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsNoInventory,
    LowInventory,
  ] = await Promise.all([
    Order.find().count(),
    Order.find({ isPaid: true }).count(),
    Order.find({ isPaid: false }).count(),
    User.find({ role: "client" }).count(),
    Product.find().count(),
    Product.find({
      inStock: { $lte: 0 },
    }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  const data: Data = {
    numberOfOrders,
    paidOrders,
    noPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsNoInventory,
    LowInventory,
  };

  await disconnect();
  return res.status(200).json(data);
};
