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
    case "POST":
      return loginUser(req, res);

    default:
      res.status(400).json({ message: "No existe el endpoint" });
  }
}
const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await connect();
  const user = await User.findOne({ email });
  await disconnect();

  if (!user) {
    return res.status(400).json({ message: "Email incorrecto" });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: "Password incorrecto" });
  }

  const { role, name, _id } = user;

  const token = jwt.signToken(_id, email);
  return res.status(200).json({ token, user: { email, role, name } });
};
