# School Management System Database Schema

This project contains a comprehensive database schema for a school management system using Drizzle ORM with Supabase PostgreSQL database.

## Database Schema

The database schema includes the following entities:

- **Users**: Authentication and user information
- **Students**: Student details and records
- **Staff**: Teachers and administrative staff information
- **Classes**: School classes/grades
- **Subjects**: Academic subjects
- **Attendance**: Student and staff attendance records
- **Fees**: Fee types, fee records, and payments
- **Results**: Exam terms, student results, and result summaries
- **Vouchers**: Financial vouchers and voucher items

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- Supabase account and project
- PostgreSQL database (provided by Supabase)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
POSTGRES_URL=your_postgres_connection_string
\`\`\`

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Generate migrations:

\`\`\`bash
npm run db:generate
\`\`\`

3. Apply migrations to the database:

\`\`\`bash
npm run db:migrate
\`\`\`

4. Seed the database with initial data:

\`\`\`bash
npm run db:seed
\`\`\`

### Database Management

- **Generate migrations**: `npm run db:generate`
- **Apply migrations**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`
- **View database with Drizzle Studio**: `npm run db:studio`

## Database Schema Details

### Users

The `users` table stores authentication and user information:

- `id`: UUID (primary key)
- `email`: Email address (unique)
- `name`: User's full name
- `role`: User role (admin, teacher, student, staff)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- `lastLogin`: Timestamp of last login
- `active`: Boolean indicating if the user is active
- `avatarUrl`: URL to user's avatar image

### Students

The `students` table stores detailed information about students:

- `id`: UUID (primary key)
- `userId`: Reference to users table
- `admissionNo`: Unique admission number
- `studentId`: Unique student ID
- `rollNo`: Roll number in class
- `classId`: Reference to classes table
- `fatherName`: Father's name
- `motherName`: Mother's name
- `dateOfBirth`: Date of birth
- `gender`: Gender
- `religion`: Religion
- `phone`: Phone number
- `address`: Address
- `admissionDate`: Date of admission
- `active`: Boolean indicating if the student is active

### Staff

The `staff` table stores information about teachers and other staff members:

- `id`: UUID (primary key)
- `userId`: Reference to users table
- `staffId`: Unique staff ID
- `name`: Staff member's name
- `fatherName`: Father's name
- `designation`: Job designation
- `dateOfJoining`: Date of joining
- `dateOfBirth`: Date of birth
- `gender`: Gender
- `religion`: Religion
- `nicNo`: National ID card number
- `salary`: Salary amount
- `phone`: Phone number
- `address`: Address
- `active`: Boolean indicating if the staff member is active

### Classes

The `classes` table represents school classes/grades:

- `id`: UUID (primary key)
- `name`: Class name
- `description`: Class description
- `academicYear`: Academic year
- `classTeacherId`: Reference to staff table
- `capacity`: Maximum number of students
- `active`: Boolean indicating if the class is active

### Subjects

The `subjects` table represents subjects taught in classes:

- `id`: UUID (primary key)
- `name`: Subject name
- `code`: Subject code (unique)
- `description`: Subject description

### Attendance

The `studentAttendance` table stores attendance records for students:

- `id`: UUID (primary key)
- `studentId`: Reference to students table
- `classId`: Reference to classes table
- `date`: Date of attendance
- `status`: Attendance status (present, absent, leave)
- `remarks`: Additional remarks
- `markedById`: Reference to staff table

### Fees

The `fees` table stores fee records for students:

- `id`: UUID (primary key)
- `studentId`: Reference to students table
- `feeTypeId`: Reference to feeTypes table
- `amount`: Fee amount
- `dueDate`: Due date for payment
- `status`: Payment status (pending, paid, overdue, partial)

### Results

The `results` table stores exam results for students:

- `id`: UUID (primary key)
- `studentId`: Reference to students table
- `classId`: Reference to classes table
- `subjectId`: Reference to subjects table
- `examTermId`: Reference to examTerms table
- `totalMarks`: Total marks for the exam
- `obtainedMarks`: Marks obtained by the student
- `grade`: Grade (A+, A, B+, etc.)
- `remarks`: Additional remarks

### Vouchers

The `vouchers` table stores financial vouchers:

- `id`: UUID (primary key)
- `voucherNumber`: Unique voucher number
- `voucherType`: Type of voucher (sales, purchase, payment, receipt)
- `amount`: Voucher amount
- `date`: Voucher date
- `description`: Voucher description
- `studentId`: Reference to students table (optional)
- `createdById`: Reference to staff table

## Relationships

The schema includes various relationships between tables:

- One-to-one relationship between users and students/staff
- One-to-many relationship between classes and students
- Many-to-many relationship between classes and subjects
- One-to-many relationship between students and attendance records
- One-to-many relationship between students and fee records
- One-to-many relationship between students and exam results

## Using the Database in Your Application

### Example: Getting a Student with User Information

\`\`\`typescript
import { db } from '@/lib/db';
import { students, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function getStudentWithUserInfo(studentId: string) {
  const result = await db
    .select({
      id: students.id,
      admissionNo: students.admissionNo,
      name: users.name,
      email: users.email,
      // Add more fields as needed
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.id, studentId))
    .limit(1);

  return result[0] || null;
}
\`\`\`

### Example: Recording Student Attendance

\`\`\`typescript
import { db } from '@/lib/db';
import { studentAttendance } from '@/lib/db/schema';

async function recordAttendance(studentId: string, classId: string, date: Date, status: string) {
  const result = await db.insert(studentAttendance).values({
    studentId,
    classId,
    date,
    status,
  }).returning();

  return result[0];
}
