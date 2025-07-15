import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJob extends Document {
  company: string;
  company_site: string;
  description: string;
  position: string;
  location: string;
  flexibility: "Remote" | "Hybrid" | "On-site";
  status: string;
  salary: string;
  in_touch_person: string;
  platform: string;
  post_link: string;
  applied_date: string;
  note: string;
  user_id: mongoose.Types.ObjectId;
  // [key: string]: any; // Support for dynamic fields
}

export const JOB_STATUSES = [
  "Applying",
  "Applied",
  "Assessment Task",
  "Interviewing",
  "No Response",
  "Rejected",
  "Pass",
  "Accepted",
  "Bookmarked",
  "Negotiating",
  "I Withdrew",
  "Archived",
];

const jobSchema = new Schema(
  {
    // Required base fields
    company: { type: String, required: true, default: "" },
    company_site: { type: String, default: "" },
    description: { type: String, default: "" },
    position: { type: String, required: true, default: "" },
    location: { type: String, default: "" },
    flexibility: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      required: true,
      default: "On-Site",
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      required: true,
      default: "Applying",
    },
    salary: { type: String, default: "" },
    in_touch_person: { type: String, default: "" },
    platform: { type: String, default: "" },
    post_link: { type: String, default: "" },
    applied_date: { type: Date, required: true, default: () => Date.now() },
    note: { type: String, default: "" },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional fields with defaults
    // customAttributes: {
    //   type: Map,
    //   of: mongoose.Schema.Types.Mixed,
    //   default: () => new Map(),
    // },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    // strict: false, // Allow fields not in schema definition
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const JobModel: Model<IJob> = mongoose.model<IJob>("Job", jobSchema);
