import mongoose, { Model, Schema } from "mongoose";
import { IBaseDocument } from "./resume";

// Achievement Interface
export interface IAchievement extends IBaseDocument {
  title: string;
  description: string;
  date?: string;
}

// Achievement Schema
const achievementSchema = new Schema<IAchievement>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const AchievementModel: Model<IAchievement> =
  mongoose.model<IAchievement>("Achievement", achievementSchema);
