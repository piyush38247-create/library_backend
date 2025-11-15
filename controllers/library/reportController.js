import mongoose from "mongoose";
import { reports } from "../../models/ReportModel.js";


export const createReport = async (req, res) => {
  try {
    const { reportTitle, reportDescription, userId, libraryId, companyId } = req.body;

    if (!reportTitle || !reportDescription || !libraryId) {
      return res.status(400).json({ message: "Title, Description, and Library ID are required" });
    }

    const newReport = await reports.create({
      reportTitle,
      reportDescription,
      userId,
      libraryId,
      companyId,
    });

    res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReports = async (req, res) => {
  try {
    const { libraryId } = req.query;
    let filter = {};

    if (libraryId) {
      filter.libraryId = new mongoose.Types.ObjectId(libraryId);
    }

    const allReports = await reports.find(filter)
      .populate("userId", "name email")
      .populate("libraryId", "name")
      .populate("companyId", "name");

    res.json({ total: allReports.length, reports: allReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await reports.findById(id)
      .populate("userId", "name email")
      .populate("libraryId", "name")
      .populate("companyId", "name");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportTitle, reportDescription, resolve, ReportRemark } = req.body;

    const updated = await reports.findByIdAndUpdate(
      id,
      { reportTitle, reportDescription, resolve, ReportRemark },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report updated successfully", report: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await reports.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
