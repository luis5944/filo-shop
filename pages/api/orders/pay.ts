import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { IPaypal } from "../../../interfaces";
import { connect, disconnect } from "../../../database/db";
import Order from "../../../models/Order";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");
  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};
const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //TODO: Validar sesion del usuario
  // TODO : validar mongoId
  const paypalBearerToken = await getPaypalBearerToken();
  if (!paypalBearerToken) {
    return res
      .status(200)
      .json({ message: "No se encontró el token de paypal" });
  }
  const { transactionId = "", orderId = "" } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );

  if (data.status !== "COMPLETED") {
    return res.status(401).json({ message: "Orden no reconocida" });
  }

  await connect();
  const dbOrder = await Order.findById(orderId);

  if (!dbOrder) {
    await disconnect();
    return res.status(400).json({ message: "Orden no existe en BBDD" });
  }

  if (dbOrder.total !== +data.purchase_units[0].amount.value) {
    await disconnect();
    return res
      .status(400)
      .json({ message: "El precio de la compra es diferente al de PayPal" });
  }

  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;
  await dbOrder.save();
  await disconnect();

  return res.status(200).json({ message: "Orden Pagada" });
};
