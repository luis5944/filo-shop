import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect } from "../../../database/db";
import User from "../../../models/User";
import { IUser } from "../../../interfaces/user";
import { isValidObjectId } from "mongoose";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);

    default:
      res.status(400).json({ message: "Bad Request" });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await connect();
  const users = await User.find().select("-password").lean();
  await disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;
  console.log(role);
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "No existe usuario" });
  }
  const validRoles = ["admin", "super-user", "SEO", "client"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rol no permitido" });
  }
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    await disconnect();
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  user.role = role;
  await user.save();
  await disconnect();

  return res.status(200).json({ message: "Rol actualizado" });
};
