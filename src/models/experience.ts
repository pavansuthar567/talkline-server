import mongoose, { Model, Schema } from "mongoose";
import { IBaseDocument } from "./resume";

// Experience Interface
export interface IExperience extends IBaseDocument {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

// Experience Schema
const experienceSchema = new Schema<IExperience>(
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
    company: { type: String, required: true },
    location: { type: String, default: "" },
    start_date: { type: String, required: true },
    end_date: { type: String, default: "Present" },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ExperienceModel: Model<IExperience> = mongoose.model<IExperience>(
  "Experience",
  experienceSchema
);
