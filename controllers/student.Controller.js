import {Student} from '../models/Student.js';
import { validationResult } from 'express-validator';
 import {Seat}  from '../models/Seat.js';

// Get all students
export const getStudents = async (req, res) => {
  try {
    const { search, shift, status, seatingType } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (shift && shift !== 'all') query.shift = shift;
    if (status && status !== 'all') query.status = status;
    if(seatingType && seatingType !== 'all') query.seatingType = seatingType;

    let students = await Student.find(query).sort({ createdAt: -1 });

  const AllStudents = []
    for (let detail of students){
      let seat = await Seat.findOne({"student.studentId" : detail._id})  
      console.log(seat)

      if(seat){
        AllStudents.push({...detail._doc, seatNo : seat.seatNumber })
      }
      else{
        AllStudents.push(detail._doc)
      }
    }
  if(!AllStudents || AllStudents.lenght === 0){
    return res.status(500).json({
      sucess : false,
      message : "something went wrong"
    })
  }
    res.json(AllStudents);

  } catch (error) { 
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};


// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id
    const student = await Student.findById(studentId);
    const seatNo = await Seat.findOne({"student.studentId" : studentId})
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    let studentObject = student.toObject()

    studentObject.seatNo = seatNo ? seatNo.seatNumber : null
    res.json({student : studentObject});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = new Student(req.body);
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
// 
export const deleteStudent = async (req, res) => {
  try {
    // pehle student dhoondo
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // seat jisme ye student hai
    const seat = await Seat.findOne({ "student.studentId": req.params.id }).populate("student.studentId");
    if (!seat) {
      await student.deleteOne();
      return res.json({ message: 'Student deleted (no seat assigned)' });
    }

    // student ko array se pull karo
    await Seat.updateOne(
      { _id: seat._id },
      { 
        $pull: { student: { studentId: req.params.id } },
        $set: { occupied: false, seatOcupiedTiming: seat.student.length === 1 ? "none" : seat.seatOcupiedTiming }
      }
    );

    // student document delete karo
    await student.deleteOne();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


