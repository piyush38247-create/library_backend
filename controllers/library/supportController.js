import mongoose from "mongoose";
import {Message} from "../../models/messageModel.js";
import { validationResult } from "express-validator";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { support } from '../../models/supportModel.js'

//
export const createSupport = async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const { companyId, studentId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return next(new ErrorHandler("Invalid library ID!", 400));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const newTicket = await support.create({
      companyId,
      libraryId,
      studentId,
      userId,
    });

    res.status(201).json({
      message: "Support ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupports = async (req, res) => {
  try {
    const { libraryId } = req.params;

    const tickets = await support
      .find({ libraryId })
      .populate("companyId studentId userId libraryId");

    res.json({
      message: "Support tickets fetched successfully",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await support.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.json({
      message: "Support status updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSupport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await support.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.json({ message: "Support ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  MESSAGE SECTION
export const createMessage = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { senderId,    text, attachments } = req.body;

    const ticket = await support.findById(supportId);
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({
        message: "Cannot send message. Support ticket is closed.",
      });
    }

    const newMessage = await Message.create({
      supportId,
      senderId,
      // senderModel,
      text,
      attachments,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a support ticket
export const getMessagesBySupportId = async (req, res) => {
  try {
    const { supportId } = req.params;

    const messages = await Message.find({ supportId })
      .sort({ createdAt: 1 })
      .populate("supportId");

    res.status(200).json({
      message: "Messages fetched successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: error.message });
  }
};



//  Update a message (only by sender)
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { senderId, text } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.senderId.toString() !== senderId) {
      return res.status(403).json({ message: "Not authorized to update this message" });
    }

    msg.text = text || msg.text;
    await msg.save();

    res.json({ message: "Message updated successfully", data: msg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete a message 
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

  if (!msg.supportId) {
      return res.status(400).json({ message: "Support ID missing in message" });
    }

    const ticket = await support.findById(
      msg.supportId
    );
    console.log(ticket)
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({
        message: "Cannot delete message — support ticket is closed",
      });
    }

await msg.deleteOne();

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

