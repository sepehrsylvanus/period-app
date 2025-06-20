"use server";

import { connectToDB } from "@/lib/connectToDB";
import { serializeMongoId } from "@/lib/helperFUnctions";
import PeriodDay, { TPerioDay } from "@/models/peiodDay.model";

export const createPeriodDay = async (data: FormData) => {
  try {
    await connectToDB();
    const periodDay = JSON.parse(data.get("periodDay") as string);

    await PeriodDay.create(periodDay);
    return "Period day created successfully";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPeriodDays = async () => {
  try {
    await connectToDB();
    const periodDays = await PeriodDay.find().lean<TPerioDay[]>();
    const safePeriodDays = await serializeMongoId(periodDays);
    return safePeriodDays;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
