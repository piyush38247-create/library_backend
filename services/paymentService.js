import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { getNextMonthDueDate, getMonthName } from '../utils/dateUtils.js';

// Generate monthly payments for all active students
 const generateMonthlyPayments = async () => {
  try {
    const activeStudents = await Student.find({ status: 'active' });
    const currentDate = new Date();
    const month = getMonthName(currentDate.getMonth());
    const year = currentDate.getFullYear();

    for (const student of activeStudents) {
      // Check if payment already exists for this month
      const existingPayment = await Payment.findOne({
        studentId: student._id,
        month,
        year
      });

      if (!existingPayment) {
        const payment = new Payment({
          studentId: student._id,
          amount: student.monthlyFee,
          dueDate: getNextMonthDueDate(),
          month,
          year
        });
        await payment.save();
      }
    }

    console.log(`Generated monthly payments for ${activeStudents.length} students`);
  } catch (error) {
    console.error('Error generating monthly payments:', error);
  }
};

// Calculate revenue for a specific period
const calculateRevenue = async (startDate, endDate) => {
  try {
    const revenue = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    return revenue[0] || { total: 0, count: 0 };
  } catch (error) {
    console.error('Error calculating revenue:', error);
    return { total: 0, count: 0 };
  }
};

module.exports = {
  generateMonthlyPayments,
  calculateRevenue
};
