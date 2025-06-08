"use server";

import { connectToDB } from "@/lib/connectToDB";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export const login = async (data: FormData) => {
  const cookieStore = await cookies();
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error(
        "Your password is incorrect or you haven't got a password for yourself yet"
      );
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    cookieStore.set("token", token, {
      sameSite: "strict",
    });

    return "User logged in successfully";
  } catch (error: any) {
    throw new Error(error.message);
  }
};
