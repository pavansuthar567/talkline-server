import mongoose, { Model, Schema } from "mongoose";
import { IBaseDocument } from "./resume";

// Certification Interface
export interface ICertification extends IBaseDocument {
  title: string;
  issuing_organization: string;
  description: string;
  issue_date?: string;
}

// Certification Schema
const certificationSchema = new Schema<ICertification>(
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
    issuing_organization: { type: String, required: true },
    description: { type: String, required: true },
    issue_date: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const CertificationModel: Model<ICertification> =
  mongoose.model<ICertification>("Certification", certificationSchema);
