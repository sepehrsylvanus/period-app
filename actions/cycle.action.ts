"use server";
import { connectToDB } from "@/lib/connectToDB";
import { serializeMongoId } from "@/lib/helperFUnctions";
import Period from "@/models/period.model";
import Symptoms from "@/models/symptom.model";

export const getCycleData = async (userId: string) => {
  try {
    await connectToDB();
    const periods = await Period.find({ userId });
    const safePeriod = serializeMongoId(periods);
    const symptoms = await Symptoms.find({ userId });
    const safeSymptoms = serializeMongoId(symptoms);
    const initialCycleData = { safePeriod, safeSymptoms };
    return initialCycleData;
  } catch (error) {
    throw new Error("Failed to fetch cycle data");
  }
};
