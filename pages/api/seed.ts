import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect, seedDatabase } from "../../database";
import { Product, User } from "../../models";
import Order from "../../models/Order";

type Data = { message: string };

export default async function seed(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(401).json({ message: "No hay acceso al servicio" });
    }
    await connect();
    if (req.method === "GET") {
      await User.deleteMany();
      await User.insertMany(seedDatabase.initialData.users);
      await Product.deleteMany();
      await Product.insertMany(seedDatabase.initialData.products);
      await Order.deleteMany();
      await disconnect();
      return res
        .status(200)
        .json({ message: "Se agrego la información correctamente" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(200).json({ message: error.message });
    }
    await disconnect();
  }
}
