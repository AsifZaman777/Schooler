import { Request, Response } from 'express';
import { ClassRoom } from '../models/ClassRoom';
import { Student } from '../models/Student';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errorHandler';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';

export const createClassRoom = asyncHandler(async (req: Request, res: Response) => {
    const classRoom = await ClassRoom.create(req.body);

    res.status(201).json({
        success: true,
        message: 'ClassRoom created successfully',
        data: classRoom,
    });
});

export const getAllClassRooms = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
    const { status, departmentId, courseId, academicYear, semester, search } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (departmentId) filter.departmentId = departmentId;
    if (courseId) filter.courseId = courseId;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { roomNumber: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [classRooms, total] = await Promise.all([
        ClassRoom.find(filter)
            .populate('departmentId', 'name code')
            .populate('courseId', 'name code credits')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean(),
        ClassRoom.countDocuments(filter),
    ]);

    const result = createPaginationResult(classRooms, total, page, limit);

    res.status(200).json({
        success: true,
        ...result,
    });
});

export const getClassRoomById = asyncHandler(async (req: Request, res: Response) => {
    const classRoom = await ClassRoom.findById(req.params.id)
        .populate('departmentId', 'name code description')
        .populate('courseId', 'name code credits duration');

    if (!classRoom) {
        throw new AppError(404, 'ClassRoom not found');
    }

    res.status(200).json({
        success: true,
        data: classRoom,
    });
});

export const updateClassRoom = asyncHandler(async (req: Request, res: Response) => {
    const classRoom = await ClassRoom.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!classRoom) {
        throw new AppError(404, 'ClassRoom not found');
    }

    res.status(200).json({
        success: true,
        message: 'ClassRoom updated successfully',
        data: classRoom,
    });
});

export const deleteClassRoom = asyncHandler(async (req: Request, res: Response) => {
    const classRoom = await ClassRoom.findByIdAndDelete(req.params.id);

    if (!classRoom) {
        throw new AppError(404, 'ClassRoom not found');
    }

    res.status(200).json({
        success: true,
        message: 'ClassRoom deleted successfully',
    });
});

export const getClassRoomStudents = asyncHandler(async (req: Request, res: Response) => {
    const students = await Student.find({ classRoomId: req.params.id })
        .select('firstName lastName email status profileImage')
        .sort('firstName');

    res.status(200).json({
        success: true,
        data: students,
    });
});
