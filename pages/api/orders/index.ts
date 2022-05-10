import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { IOrder } from "../../../interfaces";
import { connect, disconnect } from "../../../database/db";
import { Order, Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder
  | IOrder[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // verificar seasion de un usuario (en el req vienen las cookies)
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "No estás autorizado" });
  }

  //Array con los productos que la persona quiere
  const productsIds = orderItems.map((product) => product._id);
  await connect();
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    //Comprobar que el precio es igual del front al backend
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )?.price;
      if (!currentPrice) {
        throw new Error("Verifique el carrito de nuevo");
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * subTotal;
    const backendTotal = taxRate + subTotal;

    if (total !== backendTotal) {
      console.log(total, backendTotal);
      throw new Error("El total no es igual al backend");
    }

    //orden permitida
    const userId = session.user._id;
    console.log(req.body);
    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: userId,
    });

    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();
    await disconnect();
    return res.status(201).json(newOrder);
  } catch (error: any) {
    await disconnect();
    console.log(error);
    res.status(400).json({ message: error.message || "Revisa logs" });
  }

  return res.status(201).json(req.body);
};
