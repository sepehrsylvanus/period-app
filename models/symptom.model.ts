import { model, models, Schema } from "mongoose";

export interface TSymptom {
  userId: string;
  type: string;
  intensity: number;
  notes?: string;
}

const symptomSchema = new Schema<TSymptom>({
  userId: {
    type: String,
    ref: "User",
    required: [true, "User ID is required"],
  },
  type: {
    type: String,
    required: [true, "Symptom type is required"],
  },
  intensity: {
    type: Number,
    required: [true, "Symptom intensity is required"],
  },
  notes: {
    type: String,
  },
});

const Symptoms = models.Symptoms || model<TSymptom>("Symptoms", symptomSchema);

export default Symptoms;
