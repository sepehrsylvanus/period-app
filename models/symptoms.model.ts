import { model, models, Schema } from "mongoose";
import { TUser } from "./user.model";
import { TPerioDay } from "./peiodDay.model";

export interface TSymptom {
  _id: string;
  date: Date;
  category: string;
  type: string;
  intensity: number;
  periodDay: TPerioDay;
  notes: string;
  user: TUser;
}

const symptomSchema = new Schema<TSymptom>({
  date: { type: Date, required: true, unique: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  intensity: { type: Number, required: true },
  periodDay: {
    type: Schema.Types.ObjectId,
    ref: "PeriodDay",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: { type: String, required: false },
});

const Symptom = models.Symptom || model<TSymptom>("Symptom", symptomSchema);

export default Symptom;
