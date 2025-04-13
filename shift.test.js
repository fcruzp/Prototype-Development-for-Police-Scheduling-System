const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Shift = require('../models/shift.model');
const User = require('../models/user.model');
const ShiftAssignment = require('../models/shiftAssignment.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Shift Management API Tests', () => {
  let adminToken, supervisorToken, officerToken;
  let adminUser, supervisorUser, officerUser;
  let testShift;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Clear collections before tests
    await User.deleteMany({});
    await Shift.deleteMany({});
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

  describe('POST /api/shifts', () => {
    it('should create a new shift as admin', async () => {
      const res = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Morning Patrol',
          startTime: '08:00',
          endTime: '16:00',
          department: 'Kingston Central',
          description: 'Regular morning patrol shift',
          capacity: 10,
          recurrence: 'daily'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('shift');
      expect(res.body.shift).toHaveProperty('name', 'Morning Patrol');
      
      testShift = res.body.shift;
    });

    it('should create a new shift as supervisor', async () => {
      const res = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          name: 'Evening Patrol',
          startTime: '16:00',
          endTime: '00:00',
          department: 'Kingston Central',
          description: 'Regular evening patrol shift',
          capacity: 8,
          recurrence: 'daily'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('shift');
      expect(res.body.shift).toHaveProperty('name', 'Evening Patrol');
    });

    it('should not allow officers to create shifts', async () => {
      const res = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          name: 'Night Patrol',
          startTime: '00:00',
          endTime: '08:00',
          department: 'Kingston Central',
          description: 'Regular night patrol shift',
          capacity: 6,
          recurrence: 'daily'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });
  });

  describe('GET /api/shifts', () => {
    it('should get all shifts as admin', async () => {
      const res = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shifts');
      expect(Array.isArray(res.body.shifts)).toBe(true);
      expect(res.body.shifts.length).toBeGreaterThanOrEqual(2);
    });

    it('should get department shifts as supervisor', async () => {
      const res = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shifts');
      expect(Array.isArray(res.body.shifts)).toBe(true);
      expect(res.body.shifts.length).toBeGreaterThanOrEqual(2);
      
      // All shifts should be from the supervisor's department
      res.body.shifts.forEach(shift => {
        expect(shift.department).toEqual('Kingston Central');
      });
    });

    it('should get department shifts as officer', async () => {
      const res = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shifts');
      expect(Array.isArray(res.body.shifts)).toBe(true);
      
      // All shifts should be from the officer's department
      res.body.shifts.forEach(shift => {
        expect(shift.department).toEqual('Kingston Central');
      });
    });
  });

  describe('GET /api/shifts/:id', () => {
    it('should get a specific shift by ID', async () => {
      const res = await request(app)
        .get(`/api/shifts/${testShift._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shift');
      expect(res.body.shift).toHaveProperty('_id', testShift._id);
      expect(res.body.shift).toHaveProperty('name', testShift.name);
    });

    it('should return 404 for non-existent shift', async () => {
      const res = await request(app)
        .get('/api/shifts/60b9b0b9e6b3f32f948e9999') // Non-existent ID
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Shift not found');
    });
  });

  describe('PUT /api/shifts/:id', () => {
    it('should update a shift as admin', async () => {
      const res = await request(app)
        .put(`/api/shifts/${testShift._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Morning Patrol',
          capacity: 12
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shift');
      expect(res.body.shift).toHaveProperty('name', 'Updated Morning Patrol');
      expect(res.body.shift).toHaveProperty('capacity', 12);
    });

    it('should update a shift as supervisor of the same department', async () => {
      const res = await request(app)
        .put(`/api/shifts/${testShift._id}`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          description: 'Updated description by supervisor'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shift');
      expect(res.body.shift).toHaveProperty('description', 'Updated description by supervisor');
    });

    it('should not allow officers to update shifts', async () => {
      const res = await request(app)
        .put(`/api/shifts/${testShift._id}`)
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          description: 'Attempted update by officer'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });
  });

  describe('POST /api/shifts/:id/assign', () => {
    it('should assign an officer to a shift', async () => {
      const res = await request(app)
        .post(`/api/shifts/${testShift._id}/assign`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          officerId: officerUser._id,
          date: '2025-04-15'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('assignment');
      expect(res.body.assignment).toHaveProperty('officer', officerUser._id.toString());
      expect(res.body.assignment).toHaveProperty('shift', testShift._id);
    });

    it('should not assign an officer to a shift from a different department', async () => {
      // Create a user from a different department
      const otherOfficer = await User.create({
        firstName: 'Other',
        lastName: 'Officer',
        email: 'other.officer@jcf.gov.jm',
        password: 'Password123!',
        badgeNumber: 'JCF-OTHER',
        role: 'officer',
        department: 'Spanish Town'
      });
      
      const res = await request(app)
        .post(`/api/shifts/${testShift._id}/assign`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          officerId: otherOfficer._id,
          date: '2025-04-15'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Officer and shift must be in the same department');
    });
  });

  describe('DELETE /api/shifts/:id', () => {
    it('should not allow officers to delete shifts', async () => {
      const res = await request(app)
        .delete(`/api/shifts/${testShift._id}`)
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });

    it('should allow admin to delete shifts', async () => {
      // Create a temporary shift to delete
      const tempShift = await Shift.create({
        name: 'Temporary Shift',
        startTime: '10:00',
        endTime: '14:00',
        department: 'Kingston Central',
        description: 'Temporary shift for deletion test',
        capacity: 5,
        recurrence: 'once'
      });
      
      const res = await request(app)
        .delete(`/api/shifts/${tempShift._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Shift deleted successfully');
      
      // Verify the shift is deleted
      const deletedShift = await Shift.findById(tempShift._id);
      expect(deletedShift).toBeNull();
    });
  });
});
