# Quick Start Guide - School Management System

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# If not running, start MongoDB
# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Start the API Server

```bash
cd /Users/sabihakhairohi/Projects/Schooler/schooler_api
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
📝 Environment: development
🔗 API: http://localhost:5000/api/v1
💚 Health: http://localhost:5000/health
```

### Step 3: Test the API

Open a new terminal and run:

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

## 📝 Sample API Calls

### 1. Create a Department

```bash
curl -X POST http://localhost:5000/api/v1/departments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS",
    "description": "Computer Science Department",
    "status": "active"
  }'
```

### 2. Create a Course

```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Programming",
    "code": "CS101",
    "departmentId": "DEPARTMENT_ID_FROM_STEP_1",
    "credits": 3,
    "duration": 4,
    "description": "Basic programming concepts"
  }'
```

### 3. Create a ClassRoom

```bash
curl -X POST http://localhost:5000/api/v1/classrooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CS101 - Section A",
    "roomNumber": "101",
    "departmentId": "DEPARTMENT_ID",
    "courseId": "COURSE_ID",
    "capacity": 30,
    "academicYear": "2024",
    "semester": "Spring"
  }'
```

### 4. Create a Student

```bash
curl -X POST http://localhost:5000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "2005-01-15",
    "gender": "male",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Mother",
      "phone": "+1234567891"
    },
    "status": "active"
  }'
```

### 5. Create a Teacher

```bash
curl -X POST http://localhost:5000/api/v1/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Smith",
    "email": "sarah.smith@example.com",
    "phone": "+1234567892",
    "dateOfBirth": "1985-05-20",
    "gender": "female",
    "address": {
      "street": "456 Oak Ave",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002",
      "country": "USA"
    },
    "qualification": "PhD in Computer Science",
    "specialization": ["Programming", "Algorithms"],
    "experience": 10,
    "salary": 75000,
    "emergencyContact": {
      "name": "Tom Smith",
      "relationship": "Spouse",
      "phone": "+1234567893"
    }
  }'
```

### 6. Get Dashboard Stats

```bash
curl http://localhost:5000/api/v1/dashboard/stats
```

### 7. Get All Students (with pagination)

```bash
# Get first page
curl "http://localhost:5000/api/v1/students?page=1&limit=10"

# Search students
curl "http://localhost:5000/api/v1/students?search=john"

# Filter by status
curl "http://localhost:5000/api/v1/students?status=active"
```

### 8. Mark Attendance (Bulk)

```bash
curl -X POST http://localhost:5000/api/v1/attendance/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "classRoomId": "CLASSROOM_ID",
    "date": "2024-02-17",
    "markedBy": "TEACHER_ID",
    "attendanceRecords": [
      {
        "studentId": "STUDENT_ID_1",
        "status": "present"
      },
      {
        "studentId": "STUDENT_ID_2",
        "status": "absent"
      }
    ]
  }'
```

### 9. Create a Payment

```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID",
    "amount": 5000,
    "paymentType": "tuition",
    "dueDate": "2024-03-01",
    "academicYear": "2024",
    "semester": "Spring",
    "status": "pending"
  }'
```

### 10. Get Reports

```bash
# Income report
curl "http://localhost:5000/api/v1/reports/income?groupBy=month"

# Expense report
curl "http://localhost:5000/api/v1/reports/expense?groupBy=month"

# Profit/Loss report
curl "http://localhost:5000/api/v1/reports/profit-loss"

# Business projection
curl "http://localhost:5000/api/v1/reports/business-projection?months=6"
```

## 🔍 Testing with Postman

### Import Collection

Create a Postman collection with these base settings:

**Base URL**: `http://localhost:5000/api/v1`

**Headers**:
```
Content-Type: application/json
```

### Recommended Test Order

1. **Setup Phase**
   - Create Department
   - Create Course (use department ID)
   - Create ClassRoom (use department & course IDs)
   - Create Teacher
   - Create Student
   - Create Parent

2. **Academic Operations**
   - Create Routine
   - Mark Attendance
   - Create Exam
   - Enter Exam Marks

3. **Financial Operations**
   - Create Payment
   - Create Expense
   - View Reports

4. **Dashboard & Analytics**
   - Get Dashboard Stats
   - Get Enrollment Ratios
   - Get Attendance Ratios

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB
```bash
brew services start mongodb-community
# or
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change port in `.env` file or kill the process
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 PID
```

### Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

**Solution**: Check the error details and ensure all required fields are provided with correct types.

## 📊 Sample Data Script

Create a file `seed.js` to populate sample data:

```javascript
// Run with: node seed.js
const mongoose = require('mongoose');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/schooler');
  
  // Add your seed data here
  
  console.log('✅ Seed data created');
  process.exit(0);
}

seed();
```

## 🎯 Next Steps

1. ✅ API is running
2. ✅ Test basic endpoints
3. ⏭️ Create frontend with Next.js
4. ⏭️ Integrate API with frontend
5. ⏭️ Add authentication
6. ⏭️ Deploy to production

## 📚 API Documentation

Full API documentation is available in:
- `README.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Feature overview

## 💡 Tips

1. **Use Environment Variables**: Never commit `.env` file
2. **Test Incrementally**: Test each endpoint as you build
3. **Check Logs**: Server logs show detailed error information
4. **Use Pagination**: Always use pagination for list endpoints
5. **Validate Input**: The API validates all inputs with Zod

---

**Happy Coding! 🚀**
