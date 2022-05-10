import { IOrder } from "../interfaces";
import { Order } from "../models";
import { isValidObjectId } from "mongoose";
import { connect, disconnect } from "./db";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }
  await connect();
  const orderById = await Order.findById(id).lean();
  await disconnect();

  if (!orderById) {
    return null;
  }

  return JSON.parse(JSON.stringify(orderById));
};

export const getOrdersByUserId = async (
  userId: string
): Promise<IOrder[] | []> => {
  if (!isValidObjectId(userId)) {
    return [];
  }
  await connect();
  const ordersByUserId = await Order.find({ user: userId }).lean();
  await disconnect();

  return JSON.parse(JSON.stringify(ordersByUserId));
};
