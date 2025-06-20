import { serializeMongoId } from "@/lib/helperFUnctions";
import CycleData, { TCylcleData } from "@/models/cycleData.model";
import User from "@/models/user.model";

export const getCycleDatas = async () => {
  try {
    const cycleData = await CycleData.find()
      .populate({
        path: "user",
        model: User,
      })
      .lean<TCylcleData[]>();
    const safeCycleDatas = await serializeMongoId(cycleData);
    return safeCycleDatas;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
