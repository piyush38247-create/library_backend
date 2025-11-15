import mongoose from "mongoose";
import { reports } from "../../models/ReportModel.js";

export const createCompanyReport = async (req, res) => {
  try {
    const { reportTitle, reportDescription, companyId, userId, studentId } = req.body;

    if (!reportTitle || !reportDescription || !companyId) {
      return res.status(400).json({ message: "Title, Description, and Company ID are required" });
    }

    const newReport = await reports.create({
      reportTitle,
      reportDescription,
      companyId,
      userId: userId || null,
      studentId: studentId || null,
    });

    res.status(201).json({
      message: "Company report created successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyReports = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid Company ID" });
    }

    const companyReports = await reports.find({ companyId })
      .populate("companyId", "name")
      .populate("libraryId", "name")
      .populate("userId", "name email")
      .populate("studentId", "name email");

    res.json({ total: companyReports.length, reports: companyReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await reports.findById(id)
      .populate("companyId", "name")
      .populate("libraryId", "name")
      .populate("userId", "name email")
      .populate("studentId", "name email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportTitle, reportDescription, resolve, ReportRemark, userId, studentId } = req.body;

    const updated = await reports.findByIdAndUpdate(
      id,
      { reportTitle, reportDescription, resolve, ReportRemark, userId, studentId },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Company report updated successfully", report: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompanyReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await reports.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Company report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


