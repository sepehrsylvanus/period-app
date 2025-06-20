"use server";

import { serializeMongoId } from "@/lib/helperFUnctions";
import Symptom, { TSymptom } from "@/models/symptoms.model";
import User from "@/models/user.model";

export const getSymptoms = async () => {
  try {
    const symptoms = await Symptom.find()
      .populate({
        path: "user",
        model: User,
      })
      .lean<TSymptom[]>();

    const safeSymptoms = await serializeMongoId(symptoms);

    return safeSymptoms;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
