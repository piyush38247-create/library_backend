import mongoose from 'mongoose';
import { Alert } from '../../models/Alert.js';
import { Payment } from '../../models/Payment.js';
import { Seat } from '../../models/Seat.js';
import { Student } from '../../models/Student.js';
import { libraries } from '../../models/libraries.js';

// const checkLibraryContext = (req, res) => {
//   if (!req.user.libraryId) {
//     res.status(400).json({ message: 'Library context missing. Please login again.' });
//     return false;
//   }
//   return true;
// };

//  Get user's student details
export const getMyDetails = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;

    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findOne({
      _id: req.user.studentId,
      libraryId: req.user.libraryId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found in this library' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's payment history
export const getMyPayments = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const { status, limit = 10 } = req.query;
    let query = {
      studentId: req.user.studentId,
      libraryId: req.user.libraryId
    };

    if (status && status !== 'all') query.status = status;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const totalPaid = await Payment.aggregate([
      { $match: { studentId: req.user.studentId, libraryId: req.user.libraryId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await Payment.aggregate([
      { $match: { studentId: req.user.studentId, libraryId: req.user.libraryId, status: { $in: ['pending', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      statistics: {
        totalPaid: totalPaid[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
        totalPayments: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⏰ Get user's due payments
export const getMyDuePayments = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const duePayments = await Payment.find({
      studentId: req.user.studentId,
      libraryId: req.user.libraryId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    const totalDue = duePayments.reduce((sum, p) => sum + p.amount, 0);
    const overdueCount = duePayments.filter(p => p.status === 'overdue').length;

    res.json({
      duePayments,
      summary: { totalDue, overdueCount, totalDuePayments: duePayments.length }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔔 Get user's alerts
export const getMyAlerts = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;
    const { read, limit = 20 } = req.query;
    let query = {
      libraryId: req.user.libraryId,
      $or: [{ studentId: req.user.studentId }, { studentId: null }]
    };

    if (read !== undefined) query.read = read === 'true';

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Alert.countDocuments({
      libraryId: req.user.libraryId,
      $or: [{ studentId: req.user.studentId }, { studentId: null }],
      read: false
    });

    res.json({ alerts, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get user's seat info
export const getMySeat = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;
    const studentId = req.user.studentId;
    if (!studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findOne({ _id: studentId, libraryId: req.user.libraryId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found in this library' });
    }

    const seat = await Seat.findOne({
      "student.studentId": studentId,
      libraryId: req.user.libraryId
    }).select('seatNumber type seatOcupiedTiming');

    if (!seat) {
      return res.json({ message: 'No seat assigned yet', seatNumber: null });
    }

    res.json({
      seatNumber: seat.seatNumber,
      seatDetails: seat,
      assignedDate: student.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get user dashboard summary
export const getMyDashboard = async (req, res) => {
  try {
    // if (!checkLibraryContext(req, res)) return;
    const libraryId = req.params.id
    if(mongoose.Types.ObjectId.isValid(libraryId)){
      return res.status(400).json({ message: 'enter valid library id' });
    }
    const libraryData = await libraries.findOne({_id : libraryId})

    if(!libraryData){
      return res.status(400).json({ message: 'library not found !' });

    }
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findOne({ _id: req.user.studentId, libraryId: req.user.libraryId });
    // Payment summary
    const paymentSummary = await Payment.aggregate([
      { $match: { studentId: req.user.studentId, libraryId: req.user.libraryId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Recent payments
    const recentPayments = await Payment.find({
      studentId: req.user.studentId,
      libraryId: req.user.libraryId
    })
      .sort({ createdAt: -1 })
      .limit(5);
   // Unread alerts count
    const unreadAlerts = await Alert.countDocuments({
      libraryId: req.user.libraryId,
      $or: [{ studentId: req.user.studentId }, { studentId: null }],
      read: false
    });
    
    // Calculate days since joining

    const daysSinceJoining = student.joinDate
      ? Math.floor((new Date() - new Date(student.joinDate)) / (1000 * 60 * 60 * 24))
      : 0;

    res.json({
      student: {
        name: student.name,
        email: student.email,
        joinDate: student.joinDate,
        shift: student.shift,
        seatNumber: student.seatNumber,
        status: student.status,
        daysSinceJoining
      },
      paymentSummary,
      recentPayments,
      unreadAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
