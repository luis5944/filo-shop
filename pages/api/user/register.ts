import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { connect, disconnect } from "../../../database/db";
import { jwt, validation } from "../../../utils";
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
      return registerUser(req, res);

    default:
      res.status(400).json({ message: "No existe el endpoint" });
  }
}
const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = "",
    password = "",
    name = "",
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe de ser de 6 caracteres" });
  }

  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: "El nombre debe de ser de 2 caracteres" });
  }

  if (!validation.isValidEmail(email)) {
    return res.status(400).json({ message: "El email no es valido" });
  }

  await connect();
  const user = await User.findOne({ email });

  if (user) {
    await disconnect();
    return res
      .status(400)
      .json({ message: "Ya existe un usuario con ese email" });
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Revisar logs del servidor" });
  }
  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);
  return res.status(200).json({ token, user: { email, role, name } });
};
