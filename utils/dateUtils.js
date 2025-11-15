// Date utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber];
};

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

export const getNextMonthDueDate = () => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(15); // Due on 15th of each month
  return nextMonth;
};


