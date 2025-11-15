import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();
import { userRouter } from './routes/userRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { studentRouter } from './routes/studentRoutes.js';
import { paymentRouter } from './routes/paymentRoutes.js';
import { expenseRouter } from './routes/expenseRoutes.js';
import { seatRouter } from './routes/seatRoutes.js';
import { alertRouter } from './routes/alertRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { connectDB } from './config/database.js';
import { authRouter } from './routes/authRoutes.js';
import { libraryRouter } from './routes/libraryRoutes.js';
import { librarystudentRouter } from './routes/library/libraryStudentRoutes.js';
import { libraryAlertRouter} from './routes/library/libraryAlertRoutes.js';
import { libraryExpenseRouter } from './routes/library/expenseRoutes.js';
import { libraryUserRouter } from './routes/library/libraryUserRoutes.js';
import { errorMiddleware } from './middleware/errorMidddleware.js';
import { companyRouter } from './routes/company/company.route.js';
import { librarySupportRoutes } from './routes/library/librarySupportRoutes.js';
import { libraryReportRouter } from './routes/library/libraryReportRoutes.js';
import { librarySeatRoutes } from './routes/library/seatRoutes.js';
import { libraryDashboardRoutes } from './routes/library/libraryDashborad.js';
import { libraryPaymentRoute } from './routes/library/libraryPaymentRoute.js';
// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin : 'http://localhost:5173',
  credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes (public)
app.use('/api/auth', authRouter );

// Protected routes
app.use('/api/user', userRouter );
app.use('/api/admin', adminRouter );
app.use('/api/students',  studentRouter);
app.use('/api/payments',  paymentRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/seats', seatRouter);
app.use('/api/alerts',  alertRouter);
app.use('/api/dashboard', dashboardRouter );
app.use("/api/company", companyRouter)
app.use("/api/library", libraryRouter)
app.use("/api/library/alert", libraryAlertRouter)
app.use("/api/library/expense", libraryExpenseRouter)
app.use("/api/library/user", libraryUserRouter)
app.use("/api/library/student", librarystudentRouter )
app.use("/api/library/support",librarySupportRoutes)
app.use('/api/library/seat',librarySeatRoutes)
// library reports 
app.use('/api/reports',libraryReportRouter)
app.use('/api/library/dashborad',libraryDashboardRoutes)
app.use("/api/library/payment",libraryPaymentRoute)


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
