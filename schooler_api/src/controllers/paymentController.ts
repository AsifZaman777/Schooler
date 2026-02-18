import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment,
    });
});

export const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
    const { studentId, status, paymentType, academicYear, semester, startDate, endDate } = req.query;

    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (paymentType) filter.paymentType = paymentType;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;
    if (startDate || endDate) {
        filter.dueDate = {};
        if (startDate) filter.dueDate.$gte = new Date(startDate as string);
        if (endDate) filter.dueDate.$lte = new Date(endDate as string);
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate('studentId', 'firstName lastName email classRoomId')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean(),
        Payment.countDocuments(filter),
    ]);

    const result = createPaginationResult(payments, total, page, limit);

    res.status(200).json({
        success: true,
        ...result,
    });
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.findById(req.params.id)
        .populate('studentId', 'firstName lastName email phone classRoomId');

    if (!payment) {
        throw new AppError(404, 'Payment not found');
    }

    res.status(200).json({
        success: true,
        data: payment,
    });
});

export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!payment) {
        throw new AppError(404, 'Payment not found');
    }

    res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment,
    });
});

export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
        throw new AppError(404, 'Payment not found');
    }

    res.status(200).json({
        success: true,
        message: 'Payment deleted successfully',
    });
});

export const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
    const { academicYear, semester } = req.query;

    const filter: any = {};
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;

    const stats = await Payment.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);

    const totalRevenue = await Payment.aggregate([
        { $match: { ...filter, status: 'paid' } },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ]);

    const pendingAmount = await Payment.aggregate([
        { $match: { ...filter, status: 'pending' } },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ]);

    res.status(200).json({
        success: true,
        data: {
            byStatus: stats,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingAmount: pendingAmount[0]?.total || 0,
        },
    });
});

export const getStudentPayments = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;

    const payments = await Payment.find({ studentId })
        .sort('-dueDate');

    const summary = await Payment.aggregate([
        { $match: { studentId: studentId } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);

    res.status(200).json({
        success: true,
        data: {
            payments,
            summary,
        },
    });
});
