import mongoose from "mongoose";
import { Seat } from "../../models/Seat.js";
import { Student } from "../../models/Student.js";

export const createSeat = async (req, res) => {
  try {
    const { seatNumber, libraryId } = req.body;

    if (!seatNumber || !libraryId)
      return res.status(400).json({ message: "Seat number and libraryId are required" });

    const isSeatExist = await Seat.findOne({ seatNumber, libraryId });
    if (isSeatExist)
      return res.status(400).json({ message: "Seat already exists in this library" });

    const seat = await Seat.create({ seatNumber, libraryId });
    res.status(201).json({ message: `Seat ${seatNumber} created successfully`, seat });
  } catch (err) {
    console.error("Create Seat Error:", err);
    res.status(500).json({ message: "something went wrong", error: err.message });
  }
};



// export const initializeSeats = async (req, res) => {
//   try {
//     const { libraryId } = req.params;

//     const existingSeats = await Seat.countDocuments({ libraryId });
//     if (existingSeats > 0) {
//       return res.json({ message: "Seats already initialized for this library" });
//     }

//     const seats = [];
//     for (let i = 1; i <= 50; i++) {
//       const seatType = i <= 20 ? "regular" : i <= 35 ? "premium" : "vip";
//       seats.push({
//         seatNumber: i,
//         type: seatType,
//         position: { row: Math.ceil(i / 10), column: ((i - 1) % 10) + 1 },
//         libraryId,
//       });
//     }

//     await Seat.insertMany(seats);
//     res.json({ message: "Seats initialized successfully", count: seats.length });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getSeats = async (req, res) => {
  try {
    const { libraryId } = req.params;
    const seats = await Seat.find({ libraryId })
      .populate("student.studentId", "name")
      .sort({ seatNumber: 1 });

    res.json({ count: seats.length, seats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignSeat = async (req, res) => {
  try {
    const { seatId, studentId } = req.body;

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (seat.occupied) {
      return res.status(400).json({ message: "Seat already occupied" });
    }

    seat.occupied = true;
    seat.student.push({ studentId });
    await seat.save();

    student.seatNumber = seat.seatNumber;
    await student.save();

    res.json({ message: "Seat assigned successfully", seat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unassignSeat = async (req, res) => {
  try {
    const { id } = req.params; // seat id
    const { studentId } = req.body;

    const seat = await Seat.findById(id).populate("student.studentId");
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    seat.student = seat.student.filter(
      (s) => s.studentId._id.toString() !== studentId
    );

    seat.occupied = seat.student.length > 0;
    if (seat.student.length === 0) seat.seatOcupiedTiming = "none";

    await seat.save();

    res.json({ message: "Seat unassigned successfully", seat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSeatStats = async (req, res) => {
  try {
    const { libraryId } = req.params;

    const totalSeats = await Seat.countDocuments({ libraryId });
    const occupiedSeats = await Seat.countDocuments({ libraryId, occupied: true });
    const availableSeats = totalSeats - occupiedSeats;
    const fullseat = await Seat.countDocuments({ libraryId, seatOcupiedTiming: "full" });
    const halfSeats = await Seat.countDocuments({ libraryId, seatOcupiedTiming: "half" });

    res.json({ totalSeats, occupiedSeats, availableSeats, fullseat, halfSeats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteSeat = async (req, res) => {
  try {
    const { seatNumber, libraryId } = req.body;

    const seat = await Seat.findOne({ seatNumber, libraryId });
    if (!seat) {
      return res.status(404).json({ message: "Seat not found in this library" });
    }

    await seat.deleteOne();
    res.json({ message: `Seat ${seatNumber} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};