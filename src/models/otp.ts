import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: "10m" } }, // Auto-delete after 10 mins
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    // strict: false, // Allow fields not in schema definition
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

export const OtpModel: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);
