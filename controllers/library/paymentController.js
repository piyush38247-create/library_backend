import mongoose from "mongoose";
import { Payment } from "../../models/Payment.js";
import { ErrorHandler } from "../../utils/errorHandler.js";


export const getLibraryPayments = async (req, res, next) => {
  try {
    const { libraryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return next(new ErrorHandler("Invalid Library ID!", 400));
    }

    const payments = await Payment.find({ libraryId })
      .populate("studentId libraryId companyId");

    if (!payments || payments.length === 0) {
      return next(new ErrorHandler("No payments found for this library", 404));
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};


export const addLibraryPayment = async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const { studentId, companyId, amount, dueDate, month, year, status, method, paidDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return next(new ErrorHandler("Invalid Library ID!", 400));
    }

    if (!amount || !dueDate || !month || !year) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const newPayment = await Payment.create({
      libraryId,
      studentId,
      companyId,
      amount,
      dueDate,
      paidDate,
      status,
      method,
      month,
      year,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};


export const updateLibraryPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Payment ID!", 400));
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedPayment) {
      return next(new ErrorHandler("Payment not found!", 404));
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};

export const deleteLibraryPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Payment ID!", 400));
    }

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return next(new ErrorHandler("Payment not found or already deleted", 404));
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};
