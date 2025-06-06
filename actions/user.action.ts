"use server";

import { connectToDB } from "@/lib/connectToDB";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export const createUser = async (data: FormData) => {
  const cookieStore = await cookies();

  await connectToDB();
  try {
    const user = JSON.parse(data.get("user") as string);

    const newUser = await User.create(user);
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!);
    cookieStore.set("token", token, {
      sameSite: "strict",
      httpOnly: true,
    });
    return `${newUser.firstName} ${newUser.lastName} has created successfully`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
