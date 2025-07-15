import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoverLetter extends Document {
  user_id: mongoose.Types.ObjectId;
  job_id: mongoose.Types.ObjectId;
  content: string; // AI-generated cover letter text
  created_at: Date;
  updated_at: Date;
}

const coverLetterSchema = new Schema<ICoverLetter>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CoverLetterModel: Model<ICoverLetter> = mongoose.model(
  "CoverLetter",
  coverLetterSchema
);
