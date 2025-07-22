import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  mobileNumber: string;
  token?: string;
  reset_token?: string | null;
  reset_token_expires_at?: Date | null;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    mobileNumber: {
      type: String,
      match: [/^\d{10}$/, "Invalid mobile number"],
      default: null,
    },
    token: { type: String, default: null },
    reset_token: { type: String, default: null },
    reset_token_expires_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);
