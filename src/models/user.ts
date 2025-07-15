import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  first_name: string;
  last_name: string;
  img: string;
  password: string;
  dob: string;
  role: string;
  mobile_number: string;
  email: string;
  linkedin: string;
  x: string;
  token?: string;
  reset_token?: string | null;
  reset_token_expires_at?: Date | null;
  plan: string;
  subscription_start_date?: Date;
  subscription_end_date?: Date;
  razorpay_customer_id?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    password: { type: String, required: true },
    img: { type: String, default: null },
    dob: { type: String, default: null },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    mobile_number: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    linkedin: { type: String, default: null },
    x: { type: String, default: null },
    token: { type: String, default: null },
    reset_token: { type: String, default: null },
    reset_token_expires_at: { type: Date, default: null },
    plan: { type: String, default: "free" },
    subscription_start_date: { type: Date, default: null },
    subscription_end_date: { type: Date, default: null },
    razorpay_customer_id: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);
