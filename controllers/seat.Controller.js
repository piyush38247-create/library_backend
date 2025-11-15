import  mongoose  from 'mongoose';
import {Seat}  from '../models/Seat.js';
import {Student} from '../models/Student.js';

// Initialize seats (run once)
export const createSeat = async(req, res)=>{
  try {
    const {seatNumber} = req.body

    if(!seatNumber){
      return res.status(400).json({
        message : 'please enter a seat Number'
      })
    }

    const isSeatExist = await Seat.findOne({seatNumber : seatNumber})

    if(isSeatExist){
      return res.status(400).json({
        message : "seat is alreay exist please enter another number"
      })
    }

    const data = await Seat.create({
      seatNumber : seatNumber
    })

    res.status(200).json({message : `seat ${seatNumber} created successfully !`})

    await data.save()
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message : "something went wrong !"
    })
  }
}

export const deleteSeat = async(req, res)=>{
  try {
    const {seatNumber} = req.body

    if(!seatNumber){
      return res.status(400).json({
        message : 'please enter a seat Number'
      })
    }

    const isSeatExist = await Seat.findOne({seatNumber : seatNumber})

    if(!isSeatExist){
      return res.status(400).json({
        message : "seat not found !"
      })
    }

    await isSeatExist.deleteOne()

    res.status(200).json( {message : `seat ${seatNumber} deleted successfully !`})

    
    
  } catch (err) {
    res.status(500).json({
      message : "something went wrong !"
    })
  }
}
export const initializeSeats = async (req, res) => {
  try {
    const existingSeats = await Seat.countDocuments();
    if (existingSeats > 0) {
      return res.json({ message: 'Seats already initialized' });
    }

    const seats = [];
    for (let i = 1; i <= 50; i++) {
      const seatType = i <= 20 ? 'regular' : i <= 35 ? 'premium' : 'vip';
      seats.push({
        seatNumber: i,
        type: seatType,
        position: {
          row: Math.ceil(i / 10),
          column: ((i - 1) % 10) + 1
        }
      });
    }

    await Seat.insertMany(seats);
    res.json({ message: 'Seats initialized successfully', count: seats.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all seats
export const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate('student.studentId', 'name').sort({ seatNumber: 1 });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign seat to student
export const assignSeat = async (req, res) => {
  try {
    const { seatId, studentId, seatOcupiedTiming } = req.body;

    // Check if seat exists and is available
    let occupied = false
    const isStudentAlreadyAssigned = await Seat.findOne({'student.studentId' : studentId})
    
    if(isStudentAlreadyAssigned){
      return res.status(400).json({
        message : `student is already assign a seatNo. ${isStudentAlreadyAssigned.seatNumber} `,
      })
    }
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    if (seat.occupied) {
      return res.status(400).json({ message: 'Seat is already occupied' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }



    // Update seat
    if(seatOcupiedTiming) seat.seatOcupiedTiming = seatOcupiedTiming
    if(seatOcupiedTiming === 'full'){
      occupied = true
    }

    if(seatOcupiedTiming === "half" && seat.student.length == 1){
      occupied = true
    }

   
    seat.occupied = occupied;
    seat.student.push({studentId : studentId})
    await seat.save();

    // Update student
    student.seatNumber = seat.seatNumber;
    await student.save();

    res.json({ message: 'Seat assigned successfully', seat });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};

// Unassign seat
export const unassignSeat = async (req, res) => {
  try {
    const { studentId } = req.body
    const seat = await Seat.findById(req.params.id).populate("student.studentId");
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (!seat.occupied && !seat.seatOcupiedTiming === "half") {
      return res.status(400).json({ message: 'Seat is not occupied' });
    }

  
    // Clear seat assignment
    seat.student = seat.student.filter((s)=>s.studentId._id.toString() !== studentId.toString())
    seat.occupied = false;

    if(seat.student.length === 0){
      seat.seatOcupiedTiming = 'none'
    }
  
    await seat.save();

  

    res.json({ message: 'Seat unassigned successfully', seat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seat statistics
 export const getSeatStats = async (req, res) => {
  try {
    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ occupied: true });
    const availableSeats = totalSeats - occupiedSeats;
    const fullseat = await Seat.countDocuments({seatOcupiedTiming : 'full'})
    
    const gethalf = await Seat.aggregate([
      { $match: { seatOcupiedTiming: 'half' } },
      { $project: { studentCount: { $size: "$student" } } },
      { $group: { _id: null, totalStudents: { $sum: "$studentCount" } } }
    ]);


   
      const halfseat = gethalf.map((s)=> s.totalStudents)
    



    
    res.json({
      totalSeats,
      occupiedSeats,
      availableSeats,
      halfseat, 
      fullseat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


