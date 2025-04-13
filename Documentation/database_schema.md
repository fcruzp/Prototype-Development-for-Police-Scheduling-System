# Database Schema for Jamaica Police Department Workforce Management System

## Overview

The database schema is designed to support the requirements of the Jamaica Police Department Workforce Management System. It uses a hybrid approach with PostgreSQL for structured data and MongoDB for unstructured data.

## PostgreSQL Schema (Relational Data)

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    badge_number VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    rank_id INTEGER REFERENCES ranks(rank_id),
    department_id INTEGER REFERENCES departments(department_id),
    role_id INTEGER REFERENCES roles(role_id),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'suspended', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_image_url VARCHAR(255)
);
```

### Roles Table
```sql
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Role_Permissions Table
```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(role_id),
    permission_id INTEGER REFERENCES permissions(permission_id),
    PRIMARY KEY (role_id, permission_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Departments Table
```sql
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    parent_department_id INTEGER REFERENCES departments(department_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ranks Table
```sql
CREATE TABLE ranks (
    rank_id SERIAL PRIMARY KEY,
    rank_name VARCHAR(50) UNIQUE NOT NULL,
    rank_level INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Shifts Table
```sql
CREATE TABLE shifts (
    shift_id SERIAL PRIMARY KEY,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    department_id INTEGER REFERENCES departments(department_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Shift_Assignments Table
```sql
CREATE TABLE shift_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    shift_id INTEGER REFERENCES shifts(shift_id),
    assignment_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'missed', 'reassigned')),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    description TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    estimated_duration INTEGER, -- in minutes
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP
);
```

### Task_Assignments Table
```sql
CREATE TABLE task_assignments (
    assignment_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(task_id),
    user_id INTEGER REFERENCES users(user_id),
    assigned_by INTEGER REFERENCES users(user_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed')),
    notes TEXT
);
```

### Leave_Requests Table
```sql
CREATE TABLE leave_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    leave_type VARCHAR(50) CHECK (leave_type IN ('vacation', 'sick', 'personal', 'training', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    reason TEXT,
    approved_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    shift_assignment_id INTEGER REFERENCES shift_assignments(assignment_id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    check_in_location_lat DECIMAL(10, 8),
    check_in_location_lng DECIMAL(11, 8),
    check_out_location_lat DECIMAL(10, 8),
    check_out_location_lng DECIMAL(11, 8),
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'early_departure')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
```

### Staffing_Requirements Table
```sql
CREATE TABLE staffing_requirements (
    requirement_id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(department_id),
    shift_id INTEGER REFERENCES shifts(shift_id),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    min_staff_count INTEGER NOT NULL,
    recommended_staff_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Audit_Logs Table
```sql
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## MongoDB Collections (Unstructured Data)

### Location_History Collection
```json
{
  "_id": ObjectId(),
  "user_id": Integer,
  "timestamp": ISODate(),
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "accuracy": Double,
  "speed": Double,
  "heading": Double,
  "altitude": Double,
  "device_info": {
    "device_id": String,
    "platform": String,
    "app_version": String
  },
  "battery_level": Double,
  "connection_type": String
}
```

### Incidents Collection
```json
{
  "_id": ObjectId(),
  "title": String,
  "description": String,
  "reported_by": Integer,
  "reported_at": ISODate(),
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude],
    "address": String
  },
  "severity": String,
  "status": String,
  "assigned_to": [Integer],
  "media": [
    {
      "type": String,
      "url": String,
      "thumbnail_url": String,
      "created_at": ISODate(),
      "metadata": Object
    }
  ],
  "tags": [String],
  "related_tasks": [Integer],
  "witnesses": [
    {
      "name": String,
      "contact": String,
      "statement": String
    }
  ],
  "updates": [
    {
      "update_by": Integer,
      "update_at": ISODate(),
      "content": String,
      "media": [String]
    }
  ]
}
```

### User_Activity Collection
```json
{
  "_id": ObjectId(),
  "user_id": Integer,
  "session_id": String,
  "activity_type": String,
  "timestamp": ISODate(),
  "details": Object,
  "ip_address": String,
  "device_info": {
    "device_id": String,
    "platform": String,
    "browser": String,
    "os": String
  },
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}
```

### System_Logs Collection
```json
{
  "_id": ObjectId(),
  "timestamp": ISODate(),
  "level": String,
  "message": String,
  "service": String,
  "trace_id": String,
  "span_id": String,
  "request_id": String,
  "user_id": Integer,
  "metadata": Object,
  "stack_trace": String
}
```

### Analytics_Data Collection
```json
{
  "_id": ObjectId(),
  "metric_name": String,
  "timestamp": ISODate(),
  "value": Double,
  "dimensions": {
    "department_id": Integer,
    "shift_id": Integer,
    "user_id": Integer,
    "date": ISODate()
  },
  "metadata": Object
}
```

## Indexes

### PostgreSQL Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

-- Shift_Assignments table indexes
CREATE INDEX idx_shift_assignments_user ON shift_assignments(user_id);
CREATE INDEX idx_shift_assignments_shift ON shift_assignments(shift_id);
CREATE INDEX idx_shift_assignments_date ON shift_assignments(assignment_date);
CREATE INDEX idx_shift_assignments_status ON shift_assignments(status);

-- Tasks table indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Task_Assignments table indexes
CREATE INDEX idx_task_assignments_user ON task_assignments(user_id);
CREATE INDEX idx_task_assignments_task ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_status ON task_assignments(status);

-- Leave_Requests table indexes
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_date_range ON leave_requests(start_date, end_date);

-- Attendance table indexes
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_shift_assignment ON attendance(shift_assignment_id);
CREATE INDEX idx_attendance_check_in ON attendance(check_in_time);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Notifications table indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### MongoDB Indexes
```javascript
// Location_History collection indexes
db.location_history.createIndex({ user_id: 1, timestamp: -1 });
db.location_history.createIndex({ location: "2dsphere" });
db.location_history.createIndex({ timestamp: -1 });

// Incidents collection indexes
db.incidents.createIndex({ reported_by: 1 });
db.incidents.createIndex({ assigned_to: 1 });
db.incidents.createIndex({ status: 1 });
db.incidents.createIndex({ location: "2dsphere" });
db.incidents.createIndex({ reported_at: -1 });
db.incidents.createIndex({ tags: 1 });

// User_Activity collection indexes
db.user_activity.createIndex({ user_id: 1, timestamp: -1 });
db.user_activity.createIndex({ activity_type: 1 });
db.user_activity.createIndex({ timestamp: -1 });
db.user_activity.createIndex({ session_id: 1 });

// System_Logs collection indexes
db.system_logs.createIndex({ timestamp: -1 });
db.system_logs.createIndex({ level: 1, timestamp: -1 });
db.system_logs.createIndex({ service: 1, timestamp: -1 });
db.system_logs.createIndex({ trace_id: 1 });

// Analytics_Data collection indexes
db.analytics_data.createIndex({ metric_name: 1, timestamp: -1 });
db.analytics_data.createIndex({ "dimensions.department_id": 1, timestamp: -1 });
db.analytics_data.createIndex({ "dimensions.user_id": 1, timestamp: -1 });
db.analytics_data.createIndex({ "dimensions.date": 1, metric_name: 1 });
```

## Relationships

1. **Users to Roles**: Many-to-One (Each user has one role, each role can be assigned to many users)
2. **Roles to Permissions**: Many-to-Many (Each role can have multiple permissions, each permission can be assigned to multiple roles)
3. **Users to Departments**: Many-to-One (Each user belongs to one department, each department can have many users)
4. **Users to Ranks**: Many-to-One (Each user has one rank, each rank can be assigned to many users)
5. **Shifts to Departments**: Many-to-One (Each shift is associated with one department, each department can have many shifts)
6. **Users to Shift_Assignments**: One-to-Many (Each user can have many shift assignments, each shift assignment belongs to one user)
7. **Shifts to Shift_Assignments**: One-to-Many (Each shift can have many assignments, each assignment is for one shift)
8. **Users to Tasks**: One-to-Many (Each user can create many tasks, each task is created by one user)
9. **Users to Task_Assignments**: One-to-Many (Each user can have many task assignments, each task assignment belongs to one user)
10. **Tasks to Task_Assignments**: One-to-Many (Each task can have many assignments, each assignment is for one task)
11. **Users to Leave_Requests**: One-to-Many (Each user can make many leave requests, each leave request belongs to one user)
12. **Users to Attendance**: One-to-Many (Each user can have many attendance records, each attendance record belongs to one user)
13. **Shift_Assignments to Attendance**: One-to-One (Each shift assignment can have one attendance record, each attendance record is for one shift assignment)

## Data Migration and Synchronization

The system will implement a data synchronization strategy between PostgreSQL and MongoDB:

1. **Real-time Synchronization**: Critical data that needs to be available in both databases will be synchronized in real-time using change data capture (CDC) techniques.

2. **Batch Synchronization**: Non-critical data will be synchronized in batch processes during off-peak hours.

3. **Data Consistency**: Transactions will be used to ensure data consistency across both databases when necessary.

4. **Conflict Resolution**: In case of conflicts, the system will implement conflict resolution strategies based on timestamps and business rules.

## Data Backup and Recovery

1. **Regular Backups**: Both PostgreSQL and MongoDB databases will be backed up regularly.

2. **Point-in-Time Recovery**: The system will support point-in-time recovery for critical data.

3. **Backup Verification**: All backups will be verified to ensure they can be successfully restored.

4. **Disaster Recovery**: A comprehensive disaster recovery plan will be implemented to ensure data can be recovered in case of catastrophic failures.
