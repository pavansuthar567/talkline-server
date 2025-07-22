import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  _id: string;
  client_msg_id: string;
  conversation_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  content: string;
  media_ref_id?: string;
  status: "sent" | "delivered" | "read";
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    client_msg_id: { type: String, required: true },
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    media_ref_id: { type: String, default: null },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

messageSchema.index({ client_msg_id: 1, sender_id: 1 }, { unique: true });

export const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);
