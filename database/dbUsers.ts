import { User } from "../models";
import { connect, disconnect } from "./db";

import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await connect();
  const user = await User.findOne({ email }).lean();
  await disconnect();

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await disconnect();
    const { _id, name, email, role } = user;

    return { _id, name, email, role };
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: "client",
  });

  await newUser.save();
  await disconnect();
  const { _id, name, email, role } = newUser;

  return { _id, name, email, role };
};

export const allUsers = async () => {
  await connect();
  const users = await User.find().lean();

  await disconnect();
  return JSON.parse(JSON.stringify(users));
};
