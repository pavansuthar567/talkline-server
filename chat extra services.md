// import ChatRoomModel from "@/models/ChatRoom";
import UserModel from "@/models/User";
import { MessageModel } from "../models/message";

export default class ChatService {
static async sendMessage(senderId: string, roomId: string, content: string) {
try {
const message = await MessageModel.create({
sender: senderId,
room: roomId,
content,
});
await ChatRoomModel.findByIdAndUpdate(roomId, {
$set: { lastMessage: message.\_id },
$inc: { unreadCount: 1 },
});
return message;
} catch (error) {
throw new Error(`Send message failed: ${error}`);
}
}

static async markSeen(userId: string, roomId: string) {
try {
await MessageModel.updateMany(
{ room: roomId, seenBy: { $ne: userId } },
{ $addToSet: { seenBy: userId } }
);
} catch (error) {
throw new Error(`Mark as seen failed: ${error}`);
}
}

static async joinRoom(userId: string, roomId: string) {
try {
const room = await ChatRoomModel.findById(roomId);
if (!room?.members.includes(userId)) {
await ChatRoomModel.findByIdAndUpdate(roomId, {
$addToSet: { members: userId },
});
}
} catch (error) {
throw new Error(`Join room failed: ${error}`);
}
}

static async leaveRoom(userId: string, roomId: string) {
try {
await ChatRoomModel.findByIdAndUpdate(roomId, {
$pull: { members: userId },
});
} catch (error) {
throw new Error(`Leave room failed: ${error}`);
}
}

static async typingStatus(roomId: string, userId: string, isTyping: boolean) {
try {
return { roomId, userId, isTyping };
} catch (error) {
throw new Error(`Typing status error: ${error}`);
}
}

static async getMessages(roomId: string, limit = 50, skip = 0) {
try {
return await MessageModel.find({ room: roomId })
.sort({ createdAt: -1 })
.limit(limit)
.skip(skip)
.populate("sender");
} catch (error) {
throw new Error(`Get messages failed: ${error}`);
}
}

static async getRoomList(userId: string) {
try {
return await ChatRoomModel.find({ members: userId }).populate(
"lastMessage"
);
} catch (error) {
throw new Error(`Get room list failed: ${error}`);
}
}
}
