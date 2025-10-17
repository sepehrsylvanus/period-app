import { model, models, Schema } from "mongoose";
console.log({ models });
export interface TPeriod {
  userId: string;
  date: Date;
  flow: "light" | "medium" | "heavy" | "none";
  symptoms: string[];
  notes?: string;
}

const periodSchema = new Schema<TPeriod>({
  userId: {
    type: String,
    ref: "User",
    required: [true, "User ID is required"],
  },
  flow: {
    type: String,
    enum: ["light", "medium", "heavy", "none"],
    required: [true, "Flow intensity is required"],
  },
  symptoms: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
  },
});

const Period = models.Period || model<TPeriod>("Period", periodSchema);

export default Period;
