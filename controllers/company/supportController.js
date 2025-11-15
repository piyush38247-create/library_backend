import mongoose from "mongoose";
import { Message } from "../../models/messageModel.js";
import { support } from "../../models/supportModel.js";
import { validationResult } from "express-validator";
import { ErrorHandler } from "../../utils/errorHandler.js";


export const createCompanySupport = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { studentId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return next(new ErrorHandler("Invalid Company ID!", 400));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const newTicket = await support.create({
      companyId,
      studentId,
      userId,
    });

    res.status(201).json({
      message: "Company Support Ticket Created Successfully",
      data: newTicket,
    });
  } catch (error) {
    console.error("Create Company Support Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCompanySupports = async (req, res) => {
  try {
    const { companyId } = req.params;

    const tickets = await support
      .find({ companyId })
      .populate("companyId studentId userId");

    res.json({
      message: "Company Support Tickets Fetched Successfully",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Get Company Supports Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateCompanySupportStatus = async (req, res) => {
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
      return res.status(404).json({ message: "Support Ticket Not Found" });
    }

    res.json({
      message: "Support Ticket Status Updated Successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompanySupport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await support.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Support Ticket Not Found" });
    }

    res.json({ message: "Support Ticket Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
export const createCompanyMessage = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { senderId, text, attachments } = req.body;

    const ticket = await support.findById(supportId);
    if (!ticket) return res.status(404).json({ message: "Support Ticket Not Found" });

    if (ticket.status === "closed") {
      return res.status(400).json({ message: "Cannot send message — ticket is closed" });
    }

    const newMessage = await Message.create({
      supportId,
      senderId,
      text,
      attachments,
    });

    res.status(201).json({
      message: "Message Sent Successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get All Messages by Support Ticket
export const getCompanyMessages = async (req, res) => {
  try {
    const { supportId } = req.params;

    const messages = await Message.find({ supportId })
      .sort({ createdAt: 1 })
      .populate("supportId");

    res.status(200).json({
      message: "Messages Fetched Successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update a Message
export const updateCompanyMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { senderId, text } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Message Not Found" });

    if (msg.senderId.toString() !== senderId)
      return res.status(403).json({ message: "Not authorized to edit this message" });

    msg.text = text || msg.text;
    await msg.save();

    res.json({ message: "Message Updated Successfully", data: msg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Message
export const deleteCompanyMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const msg = await Message.findById(messageId);

    if (!msg) return res.status(404).json({ message: "Message Not Found" });

    const ticket = await support.findById(msg.supportId);
    if (!ticket) return res.status(404).json({ message: "Support Ticket Not Found" });

    if (ticket.status === "closed")
      return res.status(400).json({ message: "Cannot delete — ticket is closed" });

    await msg.deleteOne();

    res.json({ message: "Message Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
