import studentRoutes from './routes/studentRoutes';
import parentRoutes from './routes/parentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import courseRoutes from './routes/courseRoutes';
import classRoomRoutes from './routes/classRoomRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import routineRoutes from './routes/routineRoutes';
import examRoutes from './routes/examRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import noticeRoutes from './routes/noticeRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import reportRoutes from './routes/reportRoutes';
import { Router } from 'express';

const router = Router();

// API Routes
router.use('/students', studentRoutes);
router.use('/parents', parentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/courses', courseRoutes);
router.use('/classrooms', classRoomRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/routines', routineRoutes);
router.use('/exams', examRoutes);
router.use('/payments', paymentRoutes);
router.use('/expenses', expenseRoutes);
router.use('/notices', noticeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;
