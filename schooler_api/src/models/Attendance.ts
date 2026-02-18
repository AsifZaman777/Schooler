import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    studentId: mongoose.Types.ObjectId;
    classRoomId: mongoose.Types.ObjectId;
    date: Date;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
    markedBy: mongoose.Types.ObjectId; // Teacher who marked attendance
    createdAt: Date;
    updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required'],
        },
        classRoomId: {
            type: Schema.Types.ObjectId,
            ref: 'ClassRoom',
            required: [true, 'ClassRoom is required'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            required: [true, 'Attendance status is required'],
        },
        remarks: {
            type: String,
            trim: true,
        },
        markedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: [true, 'Marked by teacher is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, classRoomId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classRoomId: 1, date: 1 });
attendanceSchema.index({ studentId: 1, date: 1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
