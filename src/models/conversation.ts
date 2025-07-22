import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConversation extends Document {
  _id: string;
  isGroup: boolean;
  name?: string;
  participant_ids: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    isGroup: { type: Boolean, default: false },
    name: { type: String, default: null },
    participant_ids: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const ConversationModel: Model<IConversation> =
  mongoose.model<IConversation>("Conversation", conversationSchema);
