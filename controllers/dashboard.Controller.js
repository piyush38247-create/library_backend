import {Student} from '../models/Student.js';
import {Payment} from '../models/Payment.js';
// import Expense from '../models/Expense';
import {Seat} from '../models/Seat.js';
import {Alert} from '../models/Alert.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Student stats
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    
    // Seat stats
    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ occupied: true });
    const availableSeats = totalSeats - occupiedSeats;
    const fullseat = await Seat.countDocuments({ seatOcupiedTiming: 'full' });
    const halfseat = await Seat.countDocuments({ seatOcupiedTiming: 'half' });


    

    // Student distribution by shift
    const shiftDistribution = await Student.aggregate([
      { $group: { _id: '$shift', count: { $sum: 1 } } }
    ]);

    // Recent activities
    const recentActivities = await Alert.find()
      .populate('studentId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        totalSeats,
        occupiedSeats,
        availableSeats,
        fullseat,
        halfseat
      },
      charts: {
        shiftDistribution
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const currentDate = new Date();
    let startDate;

    switch (period) {
      case '1month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        break;
      case '1year':
        startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    }

    const revenueAnalytics = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(revenueAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


