import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
 supportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "support",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // senderModel: {
  //   type: String,
  //   enum: ["User", "Student", "Library", "Company"],
  //   required: true,
  // },
  text: {
    type: String,
  },
  attachments: [
    {
      url: String,
      fileType: String,
    },
  ],
  readBy: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      model: {
        type: String,
        enum: ["User", "Student", "Library", "Company"],
      },
    },
  ],
}, { timestamps: true });

export const Message =  mongoose.model("Message", messageSchema);
