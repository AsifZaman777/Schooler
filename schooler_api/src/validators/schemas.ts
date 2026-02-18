import { z } from 'zod';

// Address Schema (reusable)
const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
});

// Emergency Contact Schema (reusable)
const emergencyContactSchema = z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
});

// Student Validation
export const createStudentSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        email: z.string().email('Invalid email format'),
        phone: z.string().min(1, 'Phone is required'),
        dateOfBirth: z.string().or(z.date()),
        gender: z.enum(['male', 'female', 'other']),
        address: addressSchema,
        parentId: z.string().optional(),
        enrollmentDate: z.string().or(z.date()).optional(),
        status: z.enum(['active', 'inactive', 'graduated', 'suspended']).optional(),
        classRoomId: z.string().optional(),
        profileImage: z.string().optional(),
        emergencyContact: emergencyContactSchema,
        medicalInfo: z.object({
            bloodGroup: z.string().optional(),
            allergies: z.array(z.string()).optional(),
            medications: z.array(z.string()).optional(),
        }).optional(),
    }),
});

export const updateStudentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Student ID is required'),
    }),
    body: createStudentSchema.shape.body.partial(),
});

export const getStudentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Student ID is required'),
    }),
});

// Parent Validation
export const createParentSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        email: z.string().email('Invalid email format'),
        phone: z.string().min(1, 'Phone is required'),
        occupation: z.string().optional(),
        address: addressSchema,
        relationship: z.enum(['father', 'mother', 'guardian']),
        profileImage: z.string().optional(),
    }),
});

export const updateParentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Parent ID is required'),
    }),
    body: createParentSchema.shape.body.partial(),
});

// Teacher Validation
export const createTeacherSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        email: z.string().email('Invalid email format'),
        phone: z.string().min(1, 'Phone is required'),
        dateOfBirth: z.string().or(z.date()),
        gender: z.enum(['male', 'female', 'other']),
        address: addressSchema,
        qualification: z.string().min(1, 'Qualification is required'),
        specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
        experience: z.number().min(0, 'Experience cannot be negative'),
        joiningDate: z.string().or(z.date()).optional(),
        salary: z.number().min(0, 'Salary cannot be negative'),
        status: z.enum(['active', 'inactive', 'on-leave']).optional(),
        departmentId: z.string().optional(),
        profileImage: z.string().optional(),
        emergencyContact: emergencyContactSchema,
    }),
});

export const updateTeacherSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Teacher ID is required'),
    }),
    body: createTeacherSchema.shape.body.partial(),
});

// Employee Validation
export const createEmployeeSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        email: z.string().email('Invalid email format'),
        phone: z.string().min(1, 'Phone is required'),
        dateOfBirth: z.string().or(z.date()),
        gender: z.enum(['male', 'female', 'other']),
        address: addressSchema,
        position: z.string().min(1, 'Position is required'),
        department: z.string().min(1, 'Department is required'),
        joiningDate: z.string().or(z.date()).optional(),
        salary: z.number().min(0, 'Salary cannot be negative'),
        status: z.enum(['active', 'inactive', 'on-leave']).optional(),
        profileImage: z.string().optional(),
        emergencyContact: emergencyContactSchema,
    }),
});

export const updateEmployeeSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Employee ID is required'),
    }),
    body: createEmployeeSchema.shape.body.partial(),
});

// Department Validation
export const createDepartmentSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Department name is required'),
        code: z.string().min(1, 'Department code is required'),
        description: z.string().optional(),
        headOfDepartment: z.string().optional(),
        status: z.enum(['active', 'inactive']).optional(),
    }),
});

export const updateDepartmentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Department ID is required'),
    }),
    body: createDepartmentSchema.shape.body.partial(),
});

// Course Validation
export const createCourseSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Course name is required'),
        code: z.string().min(1, 'Course code is required'),
        description: z.string().optional(),
        departmentId: z.string().min(1, 'Department is required'),
        credits: z.number().min(1, 'Credits must be at least 1'),
        duration: z.number().min(1, 'Duration must be at least 1 month'),
        status: z.enum(['active', 'inactive']).optional(),
    }),
});

export const updateCourseSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Course ID is required'),
    }),
    body: createCourseSchema.shape.body.partial(),
});

// ClassRoom Validation
export const createClassRoomSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Class name is required'),
        roomNumber: z.string().min(1, 'Room number is required'),
        departmentId: z.string().min(1, 'Department is required'),
        courseId: z.string().min(1, 'Course is required'),
        capacity: z.number().min(1, 'Capacity must be at least 1'),
        currentEnrollment: z.number().min(0).optional(),
        academicYear: z.string().min(1, 'Academic year is required'),
        semester: z.string().min(1, 'Semester is required'),
        status: z.enum(['active', 'inactive', 'completed']).optional(),
    }),
});

export const updateClassRoomSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ClassRoom ID is required'),
    }),
    body: createClassRoomSchema.shape.body.partial(),
});

// Attendance Validation
export const createAttendanceSchema = z.object({
    body: z.object({
        studentId: z.string().min(1, 'Student is required'),
        classRoomId: z.string().min(1, 'ClassRoom is required'),
        date: z.string().or(z.date()).optional(),
        status: z.enum(['present', 'absent', 'late', 'excused']),
        remarks: z.string().optional(),
        markedBy: z.string().min(1, 'Marked by teacher is required'),
    }),
});

export const bulkAttendanceSchema = z.object({
    body: z.object({
        classRoomId: z.string().min(1, 'ClassRoom is required'),
        date: z.string().or(z.date()),
        markedBy: z.string().min(1, 'Marked by teacher is required'),
        attendanceRecords: z.array(z.object({
            studentId: z.string().min(1, 'Student is required'),
            status: z.enum(['present', 'absent', 'late', 'excused']),
            remarks: z.string().optional(),
        })),
    }),
});

// Routine Validation
export const createRoutineSchema = z.object({
    body: z.object({
        classRoomId: z.string().min(1, 'ClassRoom is required'),
        teacherId: z.string().min(1, 'Teacher is required'),
        dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
        subject: z.string().min(1, 'Subject is required'),
        roomNumber: z.string().min(1, 'Room number is required'),
        status: z.enum(['active', 'cancelled', 'rescheduled']).optional(),
    }),
});

export const updateRoutineSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Routine ID is required'),
    }),
    body: createRoutineSchema.shape.body.partial(),
});

// Exam Validation
export const createExamSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Exam name is required'),
        examType: z.enum(['midterm', 'final', 'quiz', 'assignment', 'practical']),
        courseId: z.string().min(1, 'Course is required'),
        classRoomId: z.string().min(1, 'ClassRoom is required'),
        date: z.string().or(z.date()),
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'),
        totalMarks: z.number().min(1, 'Total marks must be at least 1'),
        passingMarks: z.number().min(0, 'Passing marks cannot be negative'),
        instructions: z.string().optional(),
        status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),
    }),
});

export const updateExamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Exam ID is required'),
    }),
    body: createExamSchema.shape.body.partial(),
});

// Exam Mark Validation
export const createExamMarkSchema = z.object({
    body: z.object({
        examId: z.string().min(1, 'Exam is required'),
        studentId: z.string().min(1, 'Student is required'),
        marksObtained: z.number().min(0, 'Marks cannot be negative'),
        grade: z.string().optional(),
        remarks: z.string().optional(),
        evaluatedBy: z.string().min(1, 'Evaluator is required'),
        evaluatedAt: z.string().or(z.date()).optional(),
        status: z.enum(['pending', 'evaluated', 'published']).optional(),
    }),
});

export const updateExamMarkSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Exam mark ID is required'),
    }),
    body: createExamMarkSchema.shape.body.partial(),
});

// Payment Validation
export const createPaymentSchema = z.object({
    body: z.object({
        studentId: z.string().min(1, 'Student is required'),
        amount: z.number().min(0, 'Amount cannot be negative'),
        paymentType: z.enum(['tuition', 'exam', 'library', 'transport', 'hostel', 'other']),
        paymentMethod: z.enum(['cash', 'card', 'bank-transfer', 'online']).optional(),
        transactionId: z.string().optional(),
        dueDate: z.string().or(z.date()),
        paidDate: z.string().or(z.date()).optional(),
        status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
        academicYear: z.string().min(1, 'Academic year is required'),
        semester: z.string().min(1, 'Semester is required'),
        remarks: z.string().optional(),
    }),
});

export const updatePaymentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Payment ID is required'),
    }),
    body: createPaymentSchema.shape.body.partial(),
});

// Expense Validation
export const createExpenseSchema = z.object({
    body: z.object({
        category: z.enum(['salary', 'fixed', 'other']),
        subcategory: z.string().min(1, 'Subcategory is required'),
        amount: z.number().min(0, 'Amount cannot be negative'),
        description: z.string().min(1, 'Description is required'),
        date: z.string().or(z.date()).optional(),
        paymentMethod: z.enum(['cash', 'card', 'bank-transfer', 'cheque']),
        transactionId: z.string().optional(),
        employeeId: z.string().optional(),
        approvedBy: z.string().optional(),
        status: z.enum(['pending', 'approved', 'paid', 'rejected']).optional(),
        attachments: z.array(z.string()).optional(),
        remarks: z.string().optional(),
    }),
});

export const updateExpenseSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Expense ID is required'),
    }),
    body: createExpenseSchema.shape.body.partial(),
});

// Notice Validation
export const createNoticeSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200),
        content: z.string().min(1, 'Content is required'),
        category: z.enum(['general', 'academic', 'exam', 'event', 'holiday', 'urgent']),
        targetAudience: z.array(z.enum(['student', 'parent', 'teacher', 'employee', 'all'])).min(1),
        publishDate: z.string().or(z.date()).optional(),
        expiryDate: z.string().or(z.date()).optional(),
        attachments: z.array(z.string()).optional(),
        createdBy: z.string().min(1, 'Creator is required'),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
    }),
});

export const updateNoticeSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notice ID is required'),
    }),
    body: createNoticeSchema.shape.body.partial(),
});
