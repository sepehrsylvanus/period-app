import { model, models, Schema } from "mongoose";
import { TSymptom } from "./symptoms.model";
import { TUser } from "./user.model";

export interface TPerioDay {
  _id: string;
  date: Date;
  flow: "light" | "medium" | "heavy" | null;
  symptoms: TSymptom[];
  notes?: string;
  user: TUser;
}

const periodDaySchema = new Schema<TPerioDay>({
  date: { type: Date, required: true, unique: true },
  flow: { type: String, enum: ["light", "medium", "heavy"], default: null },
  symptoms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Symptom",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: { type: String, default: "" },
});

const PeriodDay =
  models.PeriodDay || model<TPerioDay>("PeriodDay", periodDaySchema);

export default PeriodDay;
