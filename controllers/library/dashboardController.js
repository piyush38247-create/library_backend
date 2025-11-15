import { Seat } from "../../models/Seat.js";
import { Student } from "../../models/Student.js";
import mongoose from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

export const getLibraryDashboard = async (req, res,next) => {
  try {
    const { libraryId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(libraryId)) {
          return next(new ErrorHandler("library id not vaild !", 400))
        }
      

    const totalSeats = await Seat.countDocuments({ libraryId });
    const occupiedSeats = await Seat.countDocuments({ libraryId, occupied: true });
    const freeSeats = totalSeats - occupiedSeats;

    const seatDetails = await Seat.find({ libraryId, "student.studentId": { $ne: null } })
      .populate("student.studentId", "name email")
      .select("seatNumber type student");

    const studentOverview = seatDetails.map((seat) => {
      return seat.student.map((s) => ({
        studentName: s.studentId?.name || "N/A",
        seatNumber: seat.seatNumber,
        seatType: seat.type,
        paymentStatus: s.paymentStatus,
      }));
    }).flat();

    res.status(200).json({
      message: "Library Dashboard Data Fetched Successfully",
      summary: {
        totalSeats,
        occupiedSeats,
        freeSeats
      },
      students: studentOverview
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};
