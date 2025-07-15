import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscription extends Document {
  user_id: string;
  plan: string;
  start_date: Date;
  end_date: Date;
  payment_id: string;
  razorpay_subscription_id?: string; // Add Razorpay subscription ID
}

const subscriptionSchema: Schema<ISubscription> = new Schema(
  {
    user_id: { type: String, required: true },
    plan: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    payment_id: { type: String, required: true },
    razorpay_subscription_id: { type: String, default: null }, // Add Razorpay subscription ID
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const SubscriptionModel: Model<ISubscription> =
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
