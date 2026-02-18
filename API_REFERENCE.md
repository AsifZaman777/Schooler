# API Endpoints Reference

Base URL: `http://localhost:5000/api/v1`

## 📋 Table of Contents

- [Students](#students)
- [Parents](#parents)
- [Teachers](#teachers)
- [Employees](#employees)
- [Departments](#departments)
- [Courses](#courses)
- [ClassRooms](#classrooms)
- [Attendance](#attendance)
- [Routines](#routines)
- [Exams](#exams)
- [Payments](#payments)
- [Expenses](#expenses)
- [Notices](#notices)
- [Dashboard](#dashboard)
- [Reports](#reports)

---

## Students

### Create Student
**POST** `/students`

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "parentId": "string (optional)",
  "classRoomId": "string (optional)",
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  },
  "medicalInfo": {
    "bloodGroup": "string (optional)",
    "allergies": ["string"] (optional),
    "medications": ["string"] (optional)
  }
}
```

### Get All Students
**GET** `/students`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, default: createdAt)
- `sortOrder` (asc|desc, default: desc)
- `status` (active|inactive|graduated|suspended)
- `classRoomId` (string)
- `search` (string)

### Get Student by ID
**GET** `/students/:id`

### Update Student
**PUT** `/students/:id`

### Delete Student
**DELETE** `/students/:id`

### Get Student Statistics
**GET** `/students/stats`

---

## Parents

### Create Parent
**POST** `/parents`

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "occupation": "string (optional)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "relationship": "father|mother|guardian"
}
```

### Get All Parents
**GET** `/parents`

### Get Parent by ID
**GET** `/parents/:id`

### Get Parent's Children
**GET** `/parents/:id/children`

### Update Parent
**PUT** `/parents/:id`

### Delete Parent
**DELETE** `/parents/:id`

---

## Teachers

### Create Teacher
**POST** `/teachers`

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "address": { /* same as student */ },
  "qualification": "string",
  "specialization": ["string"],
  "experience": number,
  "salary": number,
  "departmentId": "string (optional)",
  "emergencyContact": { /* same as student */ }
}
```

### Get All Teachers
**GET** `/teachers`

**Query Parameters:**
- `status` (active|inactive|on-leave)
- `departmentId` (string)
- `search` (string)

### Get Teacher by ID
**GET** `/teachers/:id`

### Update Teacher
**PUT** `/teachers/:id`

### Delete Teacher
**DELETE** `/teachers/:id`

### Get Teacher Statistics
**GET** `/teachers/stats`

---

## Employees

### Create Employee
**POST** `/employees`

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "address": { /* same as student */ },
  "position": "string",
  "department": "string",
  "salary": number,
  "emergencyContact": { /* same as student */ }
}
```

### Get All Employees
**GET** `/employees`

**Query Parameters:**
- `status` (active|inactive|on-leave)
- `department` (string)
- `search` (string)

### Get Employee by ID
**GET** `/employees/:id`

### Update Employee
**PUT** `/employees/:id`

### Delete Employee
**DELETE** `/employees/:id`

### Get Employee Statistics
**GET** `/employees/stats`

---

## Departments

### Create Department
**POST** `/departments`

**Body:**
```json
{
  "name": "string",
  "code": "string",
  "description": "string (optional)",
  "headOfDepartment": "string (optional)",
  "status": "active|inactive"
}
```

### Get All Departments
**GET** `/departments`

**Query Parameters:**
- `status` (active|inactive)
- `search` (string)

### Get Department by ID
**GET** `/departments/:id`

### Update Department
**PUT** `/departments/:id`

### Delete Department
**DELETE** `/departments/:id`

---

## Courses

### Create Course
**POST** `/courses`

**Body:**
```json
{
  "name": "string",
  "code": "string",
  "description": "string (optional)",
  "departmentId": "string",
  "credits": number,
  "duration": number,
  "status": "active|inactive"
}
```

### Get All Courses
**GET** `/courses`

**Query Parameters:**
- `status` (active|inactive)
- `departmentId` (string)
- `search` (string)

### Get Course by ID
**GET** `/courses/:id`

### Update Course
**PUT** `/courses/:id`

### Delete Course
**DELETE** `/courses/:id`

---

## ClassRooms

### Create ClassRoom
**POST** `/classrooms`

**Body:**
```json
{
  "name": "string",
  "roomNumber": "string",
  "departmentId": "string",
  "courseId": "string",
  "capacity": number,
  "academicYear": "string",
  "semester": "string",
  "status": "active|inactive|completed"
}
```

### Get All ClassRooms
**GET** `/classrooms`

**Query Parameters:**
- `status` (active|inactive|completed)
- `departmentId` (string)
- `courseId` (string)
- `academicYear` (string)
- `semester` (string)
- `search` (string)

### Get ClassRoom by ID
**GET** `/classrooms/:id`

### Get ClassRoom Students
**GET** `/classrooms/:id/students`

### Update ClassRoom
**PUT** `/classrooms/:id`

### Delete ClassRoom
**DELETE** `/classrooms/:id`

---

## Attendance

### Mark Attendance
**POST** `/attendance`

**Body:**
```json
{
  "studentId": "string",
  "classRoomId": "string",
  "date": "date (optional)",
  "status": "present|absent|late|excused",
  "remarks": "string (optional)",
  "markedBy": "string"
}
```

### Bulk Mark Attendance
**POST** `/attendance/bulk`

**Body:**
```json
{
  "classRoomId": "string",
  "date": "date",
  "markedBy": "string",
  "attendanceRecords": [
    {
      "studentId": "string",
      "status": "present|absent|late|excused",
      "remarks": "string (optional)"
    }
  ]
}
```

### Get All Attendance
**GET** `/attendance`

**Query Parameters:**
- `classRoomId` (string)
- `studentId` (string)
- `status` (present|absent|late|excused)
- `startDate` (date)
- `endDate` (date)

### Get Classroom Attendance
**GET** `/attendance/classroom/:classRoomId`

**Query Parameters:**
- `date` (date)

### Get Attendance Statistics
**GET** `/attendance/stats`

**Query Parameters:**
- `classRoomId` (string)
- `startDate` (date)
- `endDate` (date)

### Update Attendance
**PUT** `/attendance/:id`

### Delete Attendance
**DELETE** `/attendance/:id`

---

## Routines

### Create Routine
**POST** `/routines`

**Body:**
```json
{
  "classRoomId": "string",
  "teacherId": "string",
  "dayOfWeek": "monday|tuesday|wednesday|thursday|friday|saturday|sunday",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "subject": "string",
  "roomNumber": "string",
  "status": "active|cancelled|rescheduled"
}
```

### Get All Routines
**GET** `/routines`

**Query Parameters:**
- `classRoomId` (string)
- `teacherId` (string)
- `dayOfWeek` (string)
- `status` (active|cancelled|rescheduled)

### Get Classroom Routine
**GET** `/routines/classroom/:classRoomId`

### Get Teacher Routine
**GET** `/routines/teacher/:teacherId`

### Get Routine by ID
**GET** `/routines/:id`

### Update Routine
**PUT** `/routines/:id`

### Delete Routine
**DELETE** `/routines/:id`

---

## Exams

### Create Exam
**POST** `/exams`

**Body:**
```json
{
  "name": "string",
  "examType": "midterm|final|quiz|assignment|practical",
  "courseId": "string",
  "classRoomId": "string",
  "date": "date",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "totalMarks": number,
  "passingMarks": number,
  "instructions": "string (optional)",
  "status": "scheduled|ongoing|completed|cancelled"
}
```

### Get All Exams
**GET** `/exams`

**Query Parameters:**
- `courseId` (string)
- `classRoomId` (string)
- `examType` (string)
- `status` (string)
- `startDate` (date)
- `endDate` (date)

### Get Exam by ID
**GET** `/exams/:id`

### Update Exam
**PUT** `/exams/:id`

### Delete Exam
**DELETE** `/exams/:id`

### Create Exam Mark
**POST** `/exams/marks`

**Body:**
```json
{
  "examId": "string",
  "studentId": "string",
  "marksObtained": number,
  "grade": "string (optional)",
  "remarks": "string (optional)",
  "evaluatedBy": "string",
  "status": "pending|evaluated|published"
}
```

### Get All Exam Marks
**GET** `/exams/marks`

**Query Parameters:**
- `examId` (string)
- `studentId` (string)
- `status` (pending|evaluated|published)

### Get Student Exam Results
**GET** `/exams/marks/student/:studentId`

### Get Exam Mark by ID
**GET** `/exams/marks/:id`

### Update Exam Mark
**PUT** `/exams/marks/:id`

### Delete Exam Mark
**DELETE** `/exams/marks/:id`

---

## Payments

### Create Payment
**POST** `/payments`

**Body:**
```json
{
  "studentId": "string",
  "amount": number,
  "paymentType": "tuition|exam|library|transport|hostel|other",
  "paymentMethod": "cash|card|bank-transfer|online (optional)",
  "transactionId": "string (optional)",
  "dueDate": "date",
  "paidDate": "date (optional)",
  "status": "pending|paid|overdue|cancelled",
  "academicYear": "string",
  "semester": "string",
  "remarks": "string (optional)"
}
```

### Get All Payments
**GET** `/payments`

**Query Parameters:**
- `studentId` (string)
- `status` (pending|paid|overdue|cancelled)
- `paymentType` (string)
- `academicYear` (string)
- `semester` (string)
- `startDate` (date)
- `endDate` (date)

### Get Payment by ID
**GET** `/payments/:id`

### Get Student Payments
**GET** `/payments/student/:studentId`

### Get Payment Statistics
**GET** `/payments/stats`

**Query Parameters:**
- `academicYear` (string)
- `semester` (string)

### Update Payment
**PUT** `/payments/:id`

### Delete Payment
**DELETE** `/payments/:id`

---

## Expenses

### Create Expense
**POST** `/expenses`

**Body:**
```json
{
  "category": "salary|fixed|other",
  "subcategory": "string",
  "amount": number,
  "description": "string",
  "date": "date (optional)",
  "paymentMethod": "cash|card|bank-transfer|cheque",
  "transactionId": "string (optional)",
  "employeeId": "string (optional)",
  "approvedBy": "string (optional)",
  "status": "pending|approved|paid|rejected",
  "attachments": ["string"] (optional),
  "remarks": "string (optional)"
}
```

### Get All Expenses
**GET** `/expenses`

**Query Parameters:**
- `category` (salary|fixed|other)
- `subcategory` (string)
- `status` (pending|approved|paid|rejected)
- `employeeId` (string)
- `startDate` (date)
- `endDate` (date)

### Get Expense by ID
**GET** `/expenses/:id`

### Get Expense Statistics
**GET** `/expenses/stats`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

### Update Expense
**PUT** `/expenses/:id`

### Delete Expense
**DELETE** `/expenses/:id`

---

## Notices

### Create Notice
**POST** `/notices`

**Body:**
```json
{
  "title": "string",
  "content": "string",
  "category": "general|academic|exam|event|holiday|urgent",
  "targetAudience": ["student|parent|teacher|employee|all"],
  "publishDate": "date (optional)",
  "expiryDate": "date (optional)",
  "attachments": ["string"] (optional),
  "createdBy": "string",
  "status": "draft|published|archived",
  "priority": "low|medium|high"
}
```

### Get All Notices
**GET** `/notices`

**Query Parameters:**
- `category` (string)
- `status` (draft|published|archived)
- `priority` (low|medium|high)
- `targetAudience` (string)

### Get Active Notices
**GET** `/notices/active`

**Query Parameters:**
- `targetAudience` (string)

### Get Notice by ID
**GET** `/notices/:id`

### Update Notice
**PUT** `/notices/:id`

### Delete Notice
**DELETE** `/notices/:id`

---

## Dashboard

### Get Dashboard Statistics
**GET** `/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "studentsEnrolled": number,
    "teachersEnrolled": number,
    "todaysClasses": number,
    "activeStudents": number,
    "activeTeachers": number
  }
}
```

### Get Student Enrollment Ratio
**GET** `/dashboard/student-enrollment-ratio`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

### Get Active Student Ratio
**GET** `/dashboard/active-student-ratio`

### Get Attendance Ratio
**GET** `/dashboard/attendance-ratio`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

### Get Payment Table
**GET** `/dashboard/payment-table`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string)

### Get Today's Schedule
**GET** `/dashboard/todays-schedule`

---

## Reports

### Get Income Report
**GET** `/reports/income`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)
- `groupBy` (day|month|year, default: month)

### Get Expense Report
**GET** `/reports/expense`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)
- `groupBy` (day|month|year, default: month)

### Get Business Projection
**GET** `/reports/business-projection`

**Query Parameters:**
- `months` (number, default: 6)

### Get Profit/Loss Report
**GET** `/reports/profit-loss`

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "path": "field.name",
      "message": "Validation error message"
    }
  ]
}
```

---

**Total Endpoints**: 80+

**Base URL**: `http://localhost:5000/api/v1`

**Health Check**: `http://localhost:5000/health`
