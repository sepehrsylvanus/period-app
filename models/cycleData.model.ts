import { model, models, Schema } from "mongoose";
import { TPerioDay } from "./peiodDay.model";
import { TUser } from "./user.model";

export interface TCylcleData {
  periods: TPerioDay[];
  user: TUser;
  symptoms: {
    date: Date;
    type: string;
    intensity: number;
    notes?: string;
  };
}

const cycleDataSchema = new Schema<TCylcleData>({
  periods: [
    {
      type: Schema.Types.ObjectId,
      ref: "PeriodDay",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptoms: {
    date: { type: Date, required: true, unique: true },
    type: { type: String, required: true },
    intensity: { type: Number, required: true },
    notes: { type: String, required: false },
  },
});

const CycleData =
  models.CycleData || model<TCylcleData>("CycleData", cycleDataSchema);

export default CycleData;
