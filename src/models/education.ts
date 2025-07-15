import mongoose, { Model, Schema } from "mongoose";
import { IBaseDocument } from "./resume";

// Education Interface
export interface IEducation extends IBaseDocument {
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
}

// Education Schema
const educationSchema = new Schema<IEducation>(
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
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String, default: "" },
    start_date: { type: String, required: true },
    end_date: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const EducationModel: Model<IEducation> = mongoose.model<IEducation>(
  "Education",
  educationSchema
);
