import mongoose from "mongoose";
import { Alert } from "../../models/Alert.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

export const getAlerts = async(req, res,next) => {
  try {
    const {libraryId } = req.params;
    
     if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return next(new ErrorHandler("library id not vaild !", 400))
    }

    const alerts = await Alert.find({libraryId})
      .populate("studentId", "name")
      .populate("libraryId", "libraryName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
      error: error.message,
    });
  }
};

// create a new alert

export const createAlert = async (req, res ,next) => {
  try {
    const { libraryId, message, type ,title} = req.body;

    if (!libraryId || !message) {
      return res.status(400).json({
        success: false,
        message: "libraryId and message are required!",
      });
    }

    

    const alert = await Alert.create({
      libraryId,
      message,
      type,
      title
    });

    res.status(201).json({
      success: true,
      message: "Alert created successfully!",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating alert",
      error: error.message,
    });
  }
};

// Mark alert as read
export const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking alert as read",
      error: error.message,
    });
  }
};


  export const markAllAsRead = async (req, res) => {
    try {
       const { id: libraryId } = req.params;

      if (!libraryId) {
        return res.status(400).json({
          success: false,
          message: "Library ID is required!",
        });
      }

      await Alert.updateMany({ libraryId, read: false }, { read: true });

      res.status(200).json({
        success: true,
        message: "All alerts marked as read for this library",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking all alerts as read",
        error: error.message,
      });
    }
  };


export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting alert",
      error: error.message,
    });
  }
};

// Get alert statistics
export const getAlertStats = async (req, res) => {
  try {
    const { libraryId } = req.query;

    if (!libraryId) {
      return res.status(400).json({
        success: false,
        message: "Library ID is required!",
      });
    }

    const totalAlerts = await Alert.countDocuments({ libraryId });
    const unreadAlerts = await Alert.countDocuments({ libraryId, read: false });

    const alertsByType = await Alert.aggregate([
      { $match: { libraryId: new mongoose.Types.ObjectId(libraryId) } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      totalAlerts,
      unreadAlerts,
      alertsByType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alert statistics",
      error: error.message,
    });
  }
};
