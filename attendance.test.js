const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Attendance = require('../models/attendance.model');
const User = require('../models/user.model');
const ShiftAssignment = require('../models/shiftAssignment.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Attendance API Tests', () => {
  let adminToken, supervisorToken, officerToken;
  let adminUser, supervisorUser, officerUser;
  let testShiftAssignment;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Clear collections before tests
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await ShiftAssignment.deleteMany({});
    
    // Create test users
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@jcf.gov.jm',
      password: 'Password123!',
      badgeNumber: 'JCF-ADMIN',
      role: 'admin',
      department: 'Headquarters'
    });
    
    supervisorUser = await User.create({
      firstName: 'Supervisor',
      lastName: 'User',
      email: 'supervisor@jcf.gov.jm',
      password: 'Password123!',
      badgeNumber: 'JCF-SUPER',
      role: 'supervisor',
      department: 'Kingston Central'
    });
    
    officerUser = await User.create({
      firstName: 'Officer',
      lastName: 'User',
      email: 'officer@jcf.gov.jm',
      password: 'Password123!',
      badgeNumber: 'JCF-OFFICER',
      role: 'officer',
      department: 'Kingston Central'
    });
    
    // Create a test shift assignment
    testShiftAssignment = await ShiftAssignment.create({
      officer: officerUser._id,
      shift: mongoose.Types.ObjectId(), // Just need a valid ObjectId
      date: new Date('2025-04-15'),
      department: 'Kingston Central',
      status: 'assigned'
    });
    
    // Generate tokens
    adminToken = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    supervisorToken = jwt.sign(
      { id: supervisorUser._id, role: supervisorUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    officerToken = jwt.sign(
      { id: officerUser._id, role: officerUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('POST /api/attendance/check-in', () => {
    it('should allow officer to check in to assigned shift', async () => {
      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          shiftAssignmentId: testShiftAssignment._id,
          location: {
            latitude: 18.0179,
            longitude: -76.8099
          }
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendance');
      expect(res.body.attendance).toHaveProperty('officer', officerUser._id.toString());
      expect(res.body.attendance).toHaveProperty('shiftAssignment', testShiftAssignment._id.toString());
      expect(res.body.attendance).toHaveProperty('checkInTime');
      expect(res.body.attendance).toHaveProperty('checkInLocation');
    });

    it('should not allow checking in twice for the same shift', async () => {
      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          shiftAssignmentId: testShiftAssignment._id,
          location: {
            latitude: 18.0179,
            longitude: -76.8099
          }
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Already checked in for this shift');
    });

    it('should not allow checking in to another officer\'s shift', async () => {
      // Create another officer
      const otherOfficer = await User.create({
        firstName: 'Other',
        lastName: 'Officer',
        email: 'other.officer@jcf.gov.jm',
        password: 'Password123!',
        badgeNumber: 'JCF-OTHER',
        role: 'officer',
        department: 'Kingston Central'
      });
      
      const otherOfficerToken = jwt.sign(
        { id: otherOfficer._id, role: otherOfficer.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const res = await request(app)
        .post('/api/attendance/check-in')
        .set('Authorization', `Bearer ${otherOfficerToken}`)
        .send({
          shiftAssignmentId: testShiftAssignment._id,
          location: {
            latitude: 18.0179,
            longitude: -76.8099
          }
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to check in for this shift');
    });
  });

  describe('POST /api/attendance/check-out', () => {
    it('should allow officer to check out from shift', async () => {
      const res = await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          shiftAssignmentId: testShiftAssignment._id,
          location: {
            latitude: 18.0180,
            longitude: -76.8100
          }
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendance');
      expect(res.body.attendance).toHaveProperty('officer', officerUser._id.toString());
      expect(res.body.attendance).toHaveProperty('shiftAssignment', testShiftAssignment._id.toString());
      expect(res.body.attendance).toHaveProperty('checkInTime');
      expect(res.body.attendance).toHaveProperty('checkOutTime');
      expect(res.body.attendance).toHaveProperty('checkOutLocation');
    });

    it('should not allow checking out without checking in first', async () => {
      // Create a new shift assignment
      const newShiftAssignment = await ShiftAssignment.create({
        officer: officerUser._id,
        shift: mongoose.Types.ObjectId(),
        date: new Date('2025-04-16'),
        department: 'Kingston Central',
        status: 'assigned'
      });
      
      const res = await request(app)
        .post('/api/attendance/check-out')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          shiftAssignmentId: newShiftAssignment._id,
          location: {
            latitude: 18.0180,
            longitude: -76.8100
          }
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Must check in before checking out');
    });
  });

  describe('GET /api/attendance', () => {
    it('should get all attendance records as admin', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendanceRecords');
      expect(Array.isArray(res.body.attendanceRecords)).toBe(true);
      expect(res.body.attendanceRecords.length).toBeGreaterThanOrEqual(1);
    });

    it('should get department attendance records as supervisor', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendanceRecords');
      expect(Array.isArray(res.body.attendanceRecords)).toBe(true);
      
      // All records should be from the supervisor's department
      res.body.attendanceRecords.forEach(record => {
        expect(record.department).toEqual('Kingston Central');
      });
    });

    it('should get own attendance records as officer', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendanceRecords');
      expect(Array.isArray(res.body.attendanceRecords)).toBe(true);
      
      // All records should belong to the officer
      res.body.attendanceRecords.forEach(record => {
        expect(record.officer).toEqual(officerUser._id.toString());
      });
    });
  });

  describe('GET /api/attendance/officer/:id', () => {
    it('should get officer attendance records as admin', async () => {
      const res = await request(app)
        .get(`/api/attendance/officer/${officerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendanceRecords');
      expect(Array.isArray(res.body.attendanceRecords)).toBe(true);
      
      // All records should belong to the specified officer
      res.body.attendanceRecords.forEach(record => {
        expect(record.officer).toEqual(officerUser._id.toString());
      });
    });

    it('should get officer attendance records as supervisor of same department', async () => {
      const res = await request(app)
        .get(`/api/attendance/officer/${officerUser._id}`)
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('attendanceRecords');
      expect(Array.isArray(res.body.attendanceRecords)).toBe(true);
    });

    it('should not allow officers to view other officers\' attendance', async () => {
      // Create another officer
      const otherOfficer = await User.create({
        firstName: 'Another',
        lastName: 'Officer',
        email: 'another.officer@jcf.gov.jm',
        password: 'Password123!',
        badgeNumber: 'JCF-ANOTHER',
        role: 'officer',
        department: 'Kingston Central'
      });
      
      const res = await request(app)
        .get(`/api/attendance/officer/${otherOfficer._id}`)
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to view this officer\'s attendance');
    });
  });
});
