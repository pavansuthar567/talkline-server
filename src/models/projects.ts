import mongoose, { Model, Schema } from "mongoose";
import { IBaseDocument } from "./resume";

// Project Interface
interface IProject extends IBaseDocument {
  title: string;
  description: string;
  link?: string;
}

const projectSchema = new Schema<IProject>(
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
    description: { type: String, default: "" },
    link: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ProjectModel: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);
