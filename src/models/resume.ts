import mongoose, { Document, Model, Schema } from "mongoose";

// Base interface for all documents
export interface IBaseDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  resume_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Resume Interface
export interface IResume extends Document {
  user_id: mongoose.Types.ObjectId;
  version_name: string;
  summary: string;
  title: string;
  skills: string[];
  experience: mongoose.Types.ObjectId[];
  education: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  achievements: mongoose.Types.ObjectId[];
  certifications: mongoose.Types.ObjectId[];
  is_default: boolean;
  ats_score?: number;
  target_job_id?: mongoose.Types.ObjectId;
  is_ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

// Resume Schema
const resumeSchema = new Schema<IResume>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    version_name: { type: String, required: true },
    summary: { type: String, default: "" },
    title: { type: String, default: "" },
    skills: [{ type: String }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    achievements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
    ],
    certifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Certification" },
    ],
    is_default: { type: Boolean, default: false },
    ats_score: { type: Number },
    target_job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    is_ai_generated: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

resumeSchema.index({ user_id: 1, version_name: 1 }, { unique: true });

// Prevent multiple default resumes per user
resumeSchema.pre("save", async function (this: IResume, next) {
  if (this.is_default) {
    await mongoose
      .model("Resume")
      .updateMany(
        { user_id: this.user_id, _id: { $ne: this._id }, is_default: true },
        { is_default: false }
      );
  }
  next();
});

// Models
export const ResumeModel: Model<IResume> = mongoose.model<IResume>(
  "Resume",
  resumeSchema
);
