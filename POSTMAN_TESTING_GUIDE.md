# Postman Testing Guide

## Setup Instructions

1. **Import Collection**
   - Open Postman
   - Click "Import" button
   - Select `Library-Management-API.postman_collection.json`

2. **Import Environment**
   - Click "Import" button
   - Select `Library-Management-Environment.postman_environment.json`
   - Select the environment from the dropdown (top right)

3. **Start the Server**
   ```bash
   cd library-management-backend
   npm run dev
   ```

4. **Create Super Admin** (if not done already)
   ```bash
   npm run create-admin
   ```

## Testing Workflow

### 1. Authentication Flow

**Step 1: Login as Super Admin**
- Use "Authentication > Login" request
- Default credentials: `admin@library.com` / `admin123`
- Token will be automatically saved to environment variable

**Step 2: Test Protected Route**
- Try any protected route (e.g., "Students > Get All Students")
- Should work with the saved token

### 2. Student Management Flow

**Step 1: Create a Student**
- Use "Students > Create Student" request
- Copy the returned student ID
- Save it to `student_id` environment variable

**Step 2: Test Student Operations**
- Get all students
- Get student by ID (use the saved student_id)
- Update student
- (Don't delete yet, we'll need it for other tests)

### 3. User Registration Flow

**Step 1: Register Student User**
- Use "Authentication > Register User" request
- Use the student_id from previous step
- Set role as "student"

**Step 2: Login as Student**
- Use "Authentication > Login" with student credentials
- Test "User (Student Dashboard)" endpoints

### 4. Admin Management Flow

**Step 1: Login as Super Admin**
- Use super admin credentials

**Step 2: Create Admin User**
- Use "Admin Management > Create Admin User"
- Set custom permissions

**Step 3: Test Permission System**
- Login as the new admin
- Try accessing different endpoints
- Should be restricted based on permissions

### 5. Complete System Test

**Step 1: Initialize Seats**
- Use "Seats > Initialize Seats" (run once)

**Step 2: Assign Seat to Student**
- Use "Seats > Assign Seat"
- Use student_id and seat_id

**Step 3: Create Payment Records**
- Payments are auto-created when students are created
- Test payment status updates

**Step 4: Test Dashboard**
- Use "Dashboard > Get Dashboard Stats"
- Should show all aggregated data

## Sample Test Data

### Student Data
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street, City, State",
  "joinDate": "2024-09-12",
  "shift": "morning",
  "seatPreference": "window",
  "monthlyFee": 2500
}
```

### Admin User Data
```json
{
  "email": "admin2@library.com",
  "password": "admin123",
  "role": "admin",
  "permissions": {
    "students": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false
    },
    "payments": {
      "create": false,
      "read": true,
      "update": true,
      "delete": false
    }
  }
}
```

### Expense Data
```json
{
  "category": "utilities",
  "description": "Electricity Bill",
  "amount": 5000,
  "date": "2024-09-12",
  "type": "recurring"
}
```

## Environment Variables

The collection uses these variables:
- `base_url`: API base URL (http://localhost:5000/api)
- `auth_token`: JWT token (auto-saved on login)
- `student_id`: For testing student-related operations
- `payment_id`: For testing payment operations
- `expense_id`: For testing expense operations
- `seat_id`: For testing seat operations
- `alert_id`: For testing alert operations
- `user_id`: For testing user management

## Common Issues

1. **401 Unauthorized**: Make sure you're logged in and token is saved
2. **403 Forbidden**: Check user permissions for the endpoint
3. **404 Not Found**: Verify the ID exists in the database
4. **400 Bad Request**: Check request body format and required fields

## Testing Checklist

- [ ] Super admin login works
- [ ] Student CRUD operations work
- [ ] Payment management works
- [ ] Expense tracking works
- [ ] Seat assignment works
- [ ] Alert system works
- [ ] Dashboard analytics work
- [ ] User registration works
- [ ] Student dashboard works
- [ ] Admin management works
- [ ] Permission system works
- [ ] CSV export works

## Notes

- Always test with different user roles to verify permissions
- Use the Health Check endpoint to verify server is running
- Check server logs for detailed error information
- Some operations require existing data (e.g., assigning seats requires students)
