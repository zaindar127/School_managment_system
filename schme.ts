import {
    pgTable, varchar, text, boolean, timestamp, integer, json, date,
    numeric, uuid, primaryKey, pgEnum
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher', 'student', 'parent']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'leave', 'late']);
export const feeStatusEnum = pgEnum('fee_status', ['paid', 'pending', 'overdue']);
export const examStatusEnum = pgEnum('exam_status', ['pass', 'fail']);
export const eventTypeEnum = pgEnum('event_type', ['academic', 'celebration', 'meeting', 'exam', 'other']);
export const notificationTypeEnum = pgEnum('notification_type', ['admission', 'payment', 'meeting', 'system', 'exam', 'other']);
export const voucherTypeEnum = pgEnum('voucher_type', ['sales', 'purchase', 'payment', 'receipt']);
export const bookStatusEnum = pgEnum('book_status', ['issued', 'returned', 'overdue', 'lost']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['bus', 'van', 'car', 'other']);
export const hostelTypeEnum = pgEnum('hostel_type', ['boys', 'girls', 'staff']);
export const roomStatusEnum = pgEnum('room_status', ['available', 'occupied', 'maintenance']);
export const roomTypeEnum = pgEnum('room_type', ['single', 'double', 'dormitory']);
export const behaviorCategoryEnum = pgEnum('behavior_category', ['appreciation', 'warning', 'detention', 'suspension', 'other']);
export const behaviorStatusEnum = pgEnum('behavior_status', ['pending', 'resolved', 'escalated']);
export const certificateTypeEnum = pgEnum('certificate_type', ['transfer', 'character', 'achievement', 'leaving', 'other']);
export const communicationTypeEnum = pgEnum('communication_type', ['sms', 'email', 'notification']);
export const deliveryStatusEnum = pgEnum('delivery_status', ['delivered', 'failed', 'pending']);
export const resourceTypeEnum = pgEnum('resource_type', ['document', 'video', 'audio', 'link', 'other']);
export const submissionStatusEnum = pgEnum('submission_status', ['submitted', 'late', 'graded', 'returned']);
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);
export const scholarshipTypeEnum = pgEnum('scholarship_type', ['merit', 'need-based', 'sports', 'other']);
export const purchaseOrderStatusEnum = pgEnum('purchase_order_status', ['draft', 'sent', 'received', 'partial', 'cancelled']);
export const activityCategoryEnum = pgEnum('activity_category', ['sports', 'arts', 'club', 'competition', 'other']);

// Users table
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    role: userRoleEnum('role').notNull(),
    profileImage: varchar('profile_image', { length: 255 }),
    phoneNumber: varchar('phone_number', { length: 20 }),
    status: userStatusEnum('status').notNull().default('active'),
    permissions: json('permissions').$type<string[]>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Schools table
export const schools = pgTable('schools', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address').notNull(),
    primary_phone: varchar('primary_phone', { length: 20 }).notNull(),
    secondary_phone: varchar('secondary_phone', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    website: varchar('website', { length: 255 }),
    logo: varchar('logo', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Academic Years table
export const academicYears = pgTable('academic_years', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    isActive: boolean('is_active').default(false).notNull()
});

// Terms table
export const terms = pgTable('terms', {
    id: uuid('id').defaultRandom().primaryKey(),
    academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull()
});

// Students table
export const students = pgTable('students', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    rollNumber: varchar('roll_number', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    classId: uuid('class_id').references(() => classes.id),
    section: varchar('section', { length: 10 }),
    admissionDate: date('admission_date').notNull(),
    lastSchool: varchar('last_school', { length: 255 }),
    dateOfBirth: date('date_of_birth').notNull(),
    gender: genderEnum('gender').notNull(),
    religion: varchar('religion', { length: 50 }).notNull(),
    address: text('address').notNull(),
    feeDiscount: numeric('fee_discount').notNull(),
    rescentSchool: varchar('rescentSchool').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Teachers table
export const teachers = pgTable('teachers', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    qualification: varchar('qualification', { length: 255 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    gender: genderEnum('gender').notNull(),
    joiningDate: date('joining_date').notNull(),
    address: text('address').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    emergencyContact: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    salary: numeric('salary').notNull(),
    experience: numeric('experience').notNull(),
    specialization: numeric('specialization').notNull(),
});

// Staff table
export const staff = pgTable('staff', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    designation: varchar('designation', { length: 100 }).notNull(),
    department: varchar('department', { length: 100 }).notNull(),
    joiningDate: date('joining_date').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    address: text('address').notNull(),
    salary: numeric('salary').notNull()
});

// Classes table
export const classes = pgTable('classes', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    section: varchar('section', { length: 10 }),
    teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'set null' })
});

// Books/Subjects table
export const books = pgTable('books', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    totalMarks: integer('total_marks').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Class Subjects junction table
export const classSubjects = pgTable(
    'class_subjects',
    {
        classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
        subjectId: uuid('subject_id').notNull().references(() => books.id, { onDelete: 'cascade' })
    },
    (t) => ({
        pk: primaryKey({ columns: [t.classId, t.subjectId] })
    })
);

// Teacher Subjects junction table
export const teacherSubjects = pgTable(
    'teacher_subjects',
    {
        teacherId: uuid('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
        subjectId: uuid('subject_id').notNull().references(() => books.id, { onDelete: 'cascade' })
    },
    (t) => ({
        pk: primaryKey({ columns: [t.teacherId, t.subjectId] })
    })
);

// Teacher Classes junction table
export const teacherClasses = pgTable(
    'teacher_classes',
    {
        teacherId: uuid('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
        classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' })
    },
    (t) => ({
        pk: primaryKey({ columns: [t.teacherId, t.classId] })
    })
);

// Timetables table
export const timetables = pgTable('timetables', {
    id: uuid('id').defaultRandom().primaryKey(),
    classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
    termId: uuid('term_id').notNull().references(() => terms.id, { onDelete: 'cascade' }),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to').notNull()
});

// Timetable Slots table
export const timetableSlots = pgTable('timetable_slots', {
    id: uuid('id').defaultRandom().primaryKey(),
    timetableId: uuid('timetable_id').notNull().references(() => timetables.id, { onDelete: 'cascade' }),
    day: varchar('day', { length: 10 }).notNull(),
    periodNumber: integer('period_number').notNull(),
    startTime: varchar('start_time', { length: 10 }).notNull(),
    endTime: varchar('end_time', { length: 10 }).notNull(),
    subjectId: uuid('subject_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    teacherId: uuid('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
});

// Book Classes junction table
export const bookClasses = pgTable(
    'book_classes',
    {
        bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
        className: varchar('class_name', { length: 50 }).notNull()
    },
    (t) => ({
        pk: primaryKey({ columns: [t.bookId, t.className] })
    })
);

// Class Notes table
export const classNotes = pgTable('class_notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    image: text('image'),
    classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Attachments table
export const attachments = pgTable('attachments', {
    id: uuid('id').defaultRandom().primaryKey(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 100 }).notNull(),
    fileSize: integer('file_size').notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    uploadedBy: uuid('uploaded_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
    entityType: varchar('entity_type', { length: 50 }).notNull(),
    entityId: uuid('entity_id').notNull()
});

// Attendance Records table
export const attendanceRecords = pgTable('attendance_records', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    status: attendanceStatusEnum('status').notNull(),
    remarks: text('remarks')
});

// Fee Types table
export const feeTypes = pgTable('fee_types', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    amount: numeric('amount').notNull(),
    frequency: varchar('frequency', { length: 20 }).notNull(),
    dueDay: integer('due_day')
});

// Fee Type Classes junction table
export const feeTypeClasses = pgTable(
    'fee_type_classes',
    {
        feeTypeId: uuid('fee_type_id').notNull().references(() => feeTypes.id, { onDelete: 'cascade' }),
        classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' })
    },
    (t) => ({
        pk: primaryKey({ columns: [t.feeTypeId, t.classId] })
    })
);

// Fee Records table
export const feeRecords = pgTable('fee_records', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    feeTypeId: uuid('fee_type_id').notNull().references(() => feeTypes.id, { onDelete: 'cascade' }),
    amount: numeric('amount').notNull(),
    dueDate: date('due_date').notNull(),
    status: feeStatusEnum('status').notNull(),
    paymentDate: date('payment_date'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    receiptNumber: varchar('receipt_number', { length: 50 }),
    remarks: text('remarks')
});

// Results table
export const results = pgTable('results', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    totalMarks: integer('total_marks').notNull(),
    obtainedMarks: integer('obtained_marks').notNull(),
    percentage: varchar('percentage', { length: 10 }).notNull(),
    grade: varchar('grade', { length: 5 }).notNull(),
    position: varchar('position', { length: 10 }).notNull(),
    status: examStatusEnum('status').notNull(),
    remarks: text('remarks')
});

// Student Marks table
export const studentMarks = pgTable('student_marks', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    marks: integer('marks').notNull()
});

// Events table
export const events = pgTable('events', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    date: date('date').notNull(),
    description: text('description').notNull(),
    type: eventTypeEnum('type').notNull()
});


// System Settings table
export const systemSettings = pgTable('system_settings', {
    id: uuid('id').defaultRandom().primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id, { onDelete: 'cascade' }),
    address: text('address').notNull(),
    primaryPhone: varchar('primary_phone', { length: 20 }).notNull(),
    secondaryPhone: varchar('secondary_phone', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    website: varchar('website', { length: 255 }),
    logo: varchar('logo', { length: 255 }),
    schoolName: varchar('school_name', { length: 255 }).notNull(),
    attendanceSettings: json('attendance_settings').notNull(),
    securitySettings: json('security_settings').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    updatedBy: uuid('updated_by').notNull().references(() => users.id, { onDelete: 'cascade' })
});


// Attendance Reports table
export const attendanceReports = pgTable('attendance_reports', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    classId: uuid('class_id').references(() => classes.id, { onDelete: 'set null' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    generatedBy: uuid('generated_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
    reportData: json('report_data').notNull(), // Stores aggregated attendance data
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});
