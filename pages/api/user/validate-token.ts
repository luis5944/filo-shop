import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { connect, disconnect } from "../../../database/db";
import { jwt } from "../../../utils";
type Data =
  | {
      message: string;
    }
  | { token: string; user: { email: string; role: string; name: string } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res);

    default:
      res.status(400).json({ message: "No existe el endpoint" });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;

  let userId = "";

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Token no valido" });
  }

  await connect();
  const user = await User.findById(userId).lean();
  await disconnect();

  if (!user) {
    return res.status(400).json({ message: "No existe el usuario" });
  }
  
  const { _id, email, role, name } = user;

  return res
    .status(200)
    .json({ token: jwt.signToken(_id, email), user: { email, role, name } });
};
