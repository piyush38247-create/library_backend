
import { Student } from '../../models/Student.js';
import { validationResult } from 'express-validator';
import { Seat } from '../../models/Seat.js';


export const getStudents = async (req, res) => {
  try {
    const { libraryId } = req.params;
    const { search, shift, status, seatingType } = req.query;

    if (!libraryId) {
      return res.status(400).json({ message: "Library ID is required in URL." });
    }

    let query = { libraryId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (shift && shift !== 'all') query.shift = shift;
    if (status && status !== 'all') query.status = status;
    if (seatingType && seatingType !== 'all') query.seatingType = seatingType;

    const students = await Student.find(query).sort({ createdAt: -1 });

    const allStudents = await Promise.all(
      students.map(async (student) => {
        const seat = await Seat.findOne({ "student.studentId": student._id, libraryId });
        return {
          ...student.toObject(),
          seatNo: seat ? seat.seatNumber : null
        };
      })
    );

    res.json({ success: true, count: allStudents.length, students: allStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const getStudentById = async (req, res) => {
  try {
    const { libraryId, studentId } = req.params;

    const student = await Student.findOne({ _id: studentId, libraryId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found in this library' });
    }

    const seat = await Seat.findOne({ "student.studentId": studentId, libraryId });
    const studentObject = student.toObject();
    studentObject.seatNo = seat ? seat.seatNumber : null;

    res.json({ success: true, student: studentObject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createStudent = async (req, res) => {
  try {
    const { libraryId } = req.params;

    if (!libraryId) return res.status(400).json({ message: "Library ID is required." });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const student = new Student({ ...req.body, libraryId });
    await student.save();

    res.status(201).json({ success: true, student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { libraryId, studentId } = req.params;

    const student = await Student.findOneAndUpdate(
      { _id: studentId, libraryId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found in this library' });

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteStudent = async (req, res) => {
  try {
    const { libraryId, studentId } = req.params;

    const student = await Student.findOne({ _id: studentId, libraryId });
    if (!student) return res.status(404).json({ message: 'Student not found in this library' });

    const seat = await Seat.findOne({ "student.studentId": studentId, libraryId });

    if (seat) {
      await Seat.updateOne(
        { _id: seat._id },
        {
          $pull: { student: { studentId } },
          $set: {
            occupied: false,
            seatOcupiedTiming: seat.student.length === 1 ? "none" : seat.seatOcupiedTiming
          }
        }
      );
    }

    await student.deleteOne();
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
