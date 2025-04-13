const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/task.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Task Management API Tests', () => {
  let adminToken, supervisorToken, officerToken;
  let adminUser, supervisorUser, officerUser;
  let testTask;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Clear collections before tests
    await User.deleteMany({});
    await Task.deleteMany({});
    
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

  describe('POST /api/tasks', () => {
    it('should create a new task as supervisor', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          title: 'Traffic Control',
          description: 'Manage traffic flow at Half Way Tree intersection',
          priority: 'high',
          location: 'Half Way Tree',
          dueDate: '2025-04-15',
          assignedTo: officerUser._id
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task).toHaveProperty('title', 'Traffic Control');
      expect(res.body.task).toHaveProperty('assignedTo', officerUser._id.toString());
      
      testTask = res.body.task;
    });

    it('should create a new task as admin', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Community Outreach',
          description: 'Conduct community outreach program in Trench Town',
          priority: 'medium',
          location: 'Trench Town',
          dueDate: '2025-04-20',
          assignedTo: officerUser._id
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task).toHaveProperty('title', 'Community Outreach');
    });

    it('should not allow officers to create tasks', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          title: 'Unauthorized Task',
          description: 'This task should not be created',
          priority: 'low',
          location: 'Kingston',
          dueDate: '2025-04-25'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks as admin', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('tasks');
      expect(Array.isArray(res.body.tasks)).toBe(true);
      expect(res.body.tasks.length).toBeGreaterThanOrEqual(2);
    });

    it('should get department tasks as supervisor', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('tasks');
      expect(Array.isArray(res.body.tasks)).toBe(true);
    });

    it('should get assigned tasks as officer', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('tasks');
      expect(Array.isArray(res.body.tasks)).toBe(true);
      
      // All tasks should be assigned to the officer
      res.body.tasks.forEach(task => {
        expect(task.assignedTo).toEqual(officerUser._id.toString());
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a specific task by ID', async () => {
      const res = await request(app)
        .get(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task).toHaveProperty('_id', testTask._id);
      expect(res.body.task).toHaveProperty('title', testTask.title);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/tasks/60b9b0b9e6b3f32f948e9999') // Non-existent ID
        .set('Authorization', `Bearer ${supervisorToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task as supervisor', async () => {
      const res = await request(app)
        .put(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          title: 'Updated Traffic Control',
          priority: 'medium'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task).toHaveProperty('title', 'Updated Traffic Control');
      expect(res.body.task).toHaveProperty('priority', 'medium');
    });

    it('should update task status as assigned officer', async () => {
      const res = await request(app)
        .put(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          status: 'in_progress',
          notes: 'Started working on traffic control'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('task');
      expect(res.body.task).toHaveProperty('status', 'in_progress');
      expect(res.body.task.notes).toContainEqual(expect.objectContaining({
        text: 'Started working on traffic control'
      }));
    });

    it('should not allow unassigned officers to update task status', async () => {
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
        .put(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${otherOfficerToken}`)
        .send({
          status: 'completed',
          notes: 'Attempting to complete someone else\'s task'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to update this task');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should not allow officers to delete tasks', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${officerToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });

    it('should allow admin to delete tasks', async () => {
      // Create a temporary task to delete
      const tempTask = await Task.create({
        title: 'Temporary Task',
        description: 'Temporary task for deletion test',
        priority: 'low',
        location: 'Kingston',
        dueDate: '2025-04-30',
        assignedBy: adminUser._id,
        department: 'Kingston Central'
      });
      
      const res = await request(app)
        .delete(`/api/tasks/${tempTask._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Task deleted successfully');
      
      // Verify the task is deleted
      const deletedTask = await Task.findById(tempTask._id);
      expect(deletedTask).toBeNull();
    });
  });
});
