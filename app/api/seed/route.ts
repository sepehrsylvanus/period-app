import { connectToDB } from "@/lib/connectToDB";
import Period from "@/models/period.model";
import Symptoms from "@/models/symptom.model";
import { NextResponse } from "next/server";

const USER_ID = "6844af671cf9b9921013d6b4";
const periodsData = [
  // Dec 2024
  {
    date: new Date(2024, 11, 15),
    flow: "medium",
    symptoms: ["cramps", "bloating"],
  },
  {
    date: new Date(2024, 11, 16),
    flow: "heavy",
    symptoms: ["cramps", "headache"],
  },
  { date: new Date(2024, 11, 17), flow: "heavy", symptoms: ["cramps"] },
  { date: new Date(2024, 11, 18), flow: "medium", symptoms: ["fatigue"] },
  { date: new Date(2024, 11, 19), flow: "light", symptoms: [] },

  // Jan 2025
  { date: new Date(2025, 0, 12), flow: "light", symptoms: ["mood swings"] },
  {
    date: new Date(2025, 0, 13),
    flow: "medium",
    symptoms: ["cramps", "bloating"],
  },
  {
    date: new Date(2025, 0, 14),
    flow: "heavy",
    symptoms: ["cramps", "headache"],
  },
  {
    date: new Date(2025, 0, 15),
    flow: "heavy",
    symptoms: ["cramps", "fatigue"],
  },
  { date: new Date(2025, 0, 16), flow: "medium", symptoms: ["bloating"] },
  { date: new Date(2025, 0, 17), flow: "light", symptoms: [] },

  // Feb 2025
  { date: new Date(2025, 1, 9), flow: "medium", symptoms: ["cramps", "acne"] },
  {
    date: new Date(2025, 1, 10),
    flow: "heavy",
    symptoms: ["cramps", "headache", "bloating"],
  },
  {
    date: new Date(2025, 1, 11),
    flow: "heavy",
    symptoms: ["cramps", "fatigue"],
  },
  { date: new Date(2025, 1, 12), flow: "medium", symptoms: ["bloating"] },
  { date: new Date(2025, 1, 13), flow: "light", symptoms: [] },

  // Mar 2025
  { date: new Date(2025, 2, 8), flow: "light", symptoms: ["mood swings"] },
  {
    date: new Date(2025, 2, 9),
    flow: "medium",
    symptoms: ["cramps", "bloating"],
  },
  {
    date: new Date(2025, 2, 10),
    flow: "heavy",
    symptoms: ["cramps", "headache"],
  },
  {
    date: new Date(2025, 2, 11),
    flow: "heavy",
    symptoms: ["cramps", "fatigue", "bloating"],
  },
  { date: new Date(2025, 2, 12), flow: "medium", symptoms: ["fatigue"] },
  { date: new Date(2025, 2, 13), flow: "light", symptoms: [] },

  // Apr 2025
  { date: new Date(2025, 3, 5), flow: "medium", symptoms: ["cramps", "acne"] },
  {
    date: new Date(2025, 3, 6),
    flow: "heavy",
    symptoms: ["cramps", "headache", "bloating"],
  },
  {
    date: new Date(2025, 3, 7),
    flow: "heavy",
    symptoms: ["cramps", "fatigue"],
  },
  { date: new Date(2025, 3, 8), flow: "medium", symptoms: ["bloating"] },
  { date: new Date(2025, 3, 9), flow: "light", symptoms: [] },

  // May 2025
  { date: new Date(2025, 4, 3), flow: "light", symptoms: ["mood swings"] },
  {
    date: new Date(2025, 4, 4),
    flow: "medium",
    symptoms: ["cramps", "bloating"],
  },
  {
    date: new Date(2025, 4, 5),
    flow: "heavy",
    symptoms: ["cramps", "headache"],
  },
  {
    date: new Date(2025, 4, 6),
    flow: "heavy",
    symptoms: ["cramps", "fatigue"],
  },
  { date: new Date(2025, 4, 7), flow: "medium", symptoms: ["bloating"] },
  { date: new Date(2025, 4, 8), flow: "light", symptoms: [] },

  // Jun 2025
  {
    date: new Date(2025, 5, 1),
    flow: "medium",
    symptoms: ["cramps", "bloating"],
  },
  {
    date: new Date(2025, 5, 2),
    flow: "heavy",
    symptoms: ["cramps", "headache"],
  },
  {
    date: new Date(2025, 5, 3),
    flow: "heavy",
    symptoms: ["cramps", "fatigue"],
  },
  { date: new Date(2025, 5, 4), flow: "medium", symptoms: ["bloating"] },
  { date: new Date(2025, 5, 5), flow: "light", symptoms: [] },
];

// 👈 40 Symptoms (6 types)
const symptomsData = [
  // Cramps
  { date: new Date(2024, 11, 15), type: "cramps", intensity: 8 },
  { date: new Date(2025, 0, 13), type: "cramps", intensity: 7 },
  { date: new Date(2025, 1, 9), type: "cramps", intensity: 9 },
  { date: new Date(2025, 2, 9), type: "cramps", intensity: 8 },
  { date: new Date(2025, 3, 5), type: "cramps", intensity: 6 },
  { date: new Date(2025, 4, 4), type: "cramps", intensity: 8 },
  { date: new Date(2025, 5, 1), type: "cramps", intensity: 7 },

  // Headache
  { date: new Date(2024, 11, 16), type: "headache", intensity: 6 },
  { date: new Date(2025, 0, 14), type: "headache", intensity: 7 },
  { date: new Date(2025, 1, 10), type: "headache", intensity: 5 },
  { date: new Date(2025, 2, 10), type: "headache", intensity: 6 },
  { date: new Date(2025, 3, 6), type: "headache", intensity: 8 },
  { date: new Date(2025, 4, 5), type: "headache", intensity: 6 },
  { date: new Date(2025, 5, 2), type: "headache", intensity: 7 },

  // Bloating
  { date: new Date(2024, 11, 15), type: "bloating", intensity: 8 },
  { date: new Date(2025, 0, 13), type: "bloating", intensity: 9 },
  { date: new Date(2025, 1, 10), type: "bloating", intensity: 7 },
  { date: new Date(2025, 2, 9), type: "bloating", intensity: 8 },
  { date: new Date(2025, 3, 6), type: "bloating", intensity: 8 },
  { date: new Date(2025, 4, 4), type: "bloating", intensity: 7 },
  { date: new Date(2025, 5, 1), type: "bloating", intensity: 8 },

  // Fatigue
  { date: new Date(2024, 11, 18), type: "fatigue", intensity: 5 },
  { date: new Date(2025, 0, 15), type: "fatigue", intensity: 6 },
  { date: new Date(2025, 1, 11), type: "fatigue", intensity: 7 },
  { date: new Date(2025, 2, 11), type: "fatigue", intensity: 8 },
  { date: new Date(2025, 3, 7), type: "fatigue", intensity: 7 },
  { date: new Date(2025, 4, 6), type: "fatigue", intensity: 6 },
  { date: new Date(2025, 5, 3), type: "fatigue", intensity: 8 },

  // Mood Swings
  { date: new Date(2025, 0, 12), type: "mood swings", intensity: 7 },
  { date: new Date(2025, 2, 8), type: "mood swings", intensity: 6 },
  { date: new Date(2025, 4, 3), type: "mood swings", intensity: 8 },

  // Acne
  { date: new Date(2025, 1, 9), type: "acne", intensity: 6 },
  { date: new Date(2025, 3, 5), type: "acne", intensity: 5 },
];
export const GET = async () => {
  try {
    await connectToDB();
    await Period.insertMany(
      periodsData.map((period) => ({ ...period, userId: USER_ID }))
    );
    await Symptoms.insertMany(
      symptomsData.map((symptom) => ({ ...symptom, userId: USER_ID }))
    );
    return NextResponse.json(
      { message: "Seeding completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Seeding failed => ${error}` },
      { status: 500 }
    );
  }
};
