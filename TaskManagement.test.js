import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TaskManagement from '../pages/supervisor/TaskManagement';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      _id: '123',
      firstName: 'Test',
      lastName: 'Supervisor',
      role: 'supervisor',
      department: 'Kingston Central'
    },
    token: 'fake-token'
  })
}));

describe('TaskManagement Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful tasks data
    axios.get.mockResolvedValueOnce({
      data: {
        tasks: [
          {
            _id: '1',
            title: 'Traffic Control',
            description: 'Manage traffic flow at Half Way Tree intersection',
            priority: 'high',
            status: 'pending',
            location: 'Half Way Tree',
            dueDate: '2025-04-15',
            assignedTo: 'officer1',
            assignedBy: '123',
            department: 'Kingston Central'
          },
          {
            _id: '2',
            title: 'Community Outreach',
            description: 'Conduct community outreach program in Trench Town',
            priority: 'medium',
            status: 'in_progress',
            location: 'Trench Town',
            dueDate: '2025-04-20',
            assignedTo: 'officer2',
            assignedBy: '123',
            department: 'Kingston Central'
          }
        ]
      }
    });
    
    // Mock successful officers data
    axios.get.mockResolvedValueOnce({
      data: {
        users: [
          {
            _id: 'officer1',
            firstName: 'John',
            lastName: 'Doe',
            badgeNumber: 'JCF1001',
            role: 'officer',
            department: 'Kingston Central'
          },
          {
            _id: 'officer2',
            firstName: 'Jane',
            lastName: 'Smith',
            badgeNumber: 'JCF1002',
            role: 'officer',
            department: 'Kingston Central'
          }
        ]
      }
    });
  });

  test('renders task management page correctly', async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Check if the page title is rendered
    expect(screen.getByText(/Task Management/i)).toBeInTheDocument();
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Traffic Control/i)).toBeInTheDocument();
      expect(screen.getByText(/Community Outreach/i)).toBeInTheDocument();
    });
    
    // Check if the create task button is rendered
    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
  });

  test('opens create task modal when button is clicked', async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Traffic Control/i)).toBeInTheDocument();
    });
    
    // Click the create task button
    fireEvent.click(screen.getByText(/Create New Task/i));
    
    // Check if the modal is opened
    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Assign To/i)).toBeInTheDocument();
  });

  test('creates a new task successfully', async () => {
    // Mock successful task creation
    axios.post.mockResolvedValueOnce({
      data: {
        task: {
          _id: '3',
          title: 'Patrol Downtown',
          description: 'Regular patrol of downtown Kingston area',
          priority: 'medium',
          status: 'pending',
          location: 'Downtown Kingston',
          dueDate: '2025-04-18',
          assignedTo: 'officer1',
          assignedBy: '123',
          department: 'Kingston Central'
        }
      }
    });
    
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Traffic Control/i)).toBeInTheDocument();
    });
    
    // Click the create task button
    fireEvent.click(screen.getByText(/Create New Task/i));
    
    // Wait for officers to load in the modal
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Patrol Downtown' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Regular patrol of downtown Kingston area' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Downtown Kingston' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2025-04-18' } });
    
    // Select priority
    const prioritySelect = screen.getByLabelText(/Priority/i);
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    
    // Select officer
    const officerSelect = screen.getByLabelText(/Assign To/i);
    fireEvent.change(officerSelect, { target: { value: 'officer1' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Create Task/i));
    
    // Verify that axios.post was called with the correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/tasks',
        {
          title: 'Patrol Downtown',
          description: 'Regular patrol of downtown Kingston area',
          priority: 'medium',
          location: 'Downtown Kingston',
          dueDate: '2025-04-18',
          assignedTo: 'officer1'
        },
        expect.any(Object)
      );
    });
    
    // Mock the updated tasks list after creation
    axios.get.mockResolvedValueOnce({
      data: {
        tasks: [
          {
            _id: '1',
            title: 'Traffic Control',
            description: 'Manage traffic flow at Half Way Tree intersection',
            priority: 'high',
            status: 'pending',
            location: 'Half Way Tree',
            dueDate: '2025-04-15',
            assignedTo: 'officer1',
            assignedBy: '123',
            department: 'Kingston Central'
          },
          {
            _id: '2',
            title: 'Community Outreach',
            description: 'Conduct community outreach program in Trench Town',
            priority: 'medium',
            status: 'in_progress',
            location: 'Trench Town',
            dueDate: '2025-04-20',
            assignedTo: 'officer2',
            assignedBy: '123',
            department: 'Kingston Central'
          },
          {
            _id: '3',
            title: 'Patrol Downtown',
            description: 'Regular patrol of downtown Kingston area',
            priority: 'medium',
            status: 'pending',
            location: 'Downtown Kingston',
            dueDate: '2025-04-18',
            assignedTo: 'officer1',
            assignedBy: '123',
            department: 'Kingston Central'
          }
        ]
      }
    });
    
    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Task created successfully/i)).toBeInTheDocument();
    });
  });

  test('views task details when task is clicked', async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Traffic Control/i)).toBeInTheDocument();
    });
    
    // Mock task details API call
    axios.get.mockResolvedValueOnce({
      data: {
        task: {
          _id: '1',
          title: 'Traffic Control',
          description: 'Manage traffic flow at Half Way Tree intersection',
          priority: 'high',
          status: 'pending',
          location: 'Half Way Tree',
          dueDate: '2025-04-15',
          assignedTo: {
            _id: 'officer1',
            firstName: 'John',
            lastName: 'Doe',
            badgeNumber: 'JCF1001'
          },
          assignedBy: {
            _id: '123',
            firstName: 'Test',
            lastName: 'Supervisor'
          },
          department: 'Kingston Central',
          notes: []
        }
      }
    });
    
    // Click on the first task
    fireEvent.click(screen.getByText(/Traffic Control/i));
    
    // Check if task details are displayed
    await waitFor(() => {
      expect(screen.getByText(/Task Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage traffic flow at Half Way Tree intersection/i)).toBeInTheDocument();
      expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
      expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
      expect(screen.getByText(/Half Way Tree/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  test('updates task status successfully', async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Traffic Control/i)).toBeInTheDocument();
    });
    
    // Mock task details API call
    axios.get.mockResolvedValueOnce({
      data: {
        task: {
          _id: '1',
          title: 'Traffic Control',
          description: 'Manage traffic flow at Half Way Tree intersection',
          priority: 'high',
          status: 'pending',
          location: 'Half Way Tree',
          dueDate: '2025-04-15',
          assignedTo: {
            _id: 'officer1',
            firstName: 'John',
            lastName: 'Doe',
            badgeNumber: 'JCF1001'
          },
          assignedBy: {
            _id: '123',
            firstName: 'Test',
            lastName: 'Supervisor'
          },
          department: 'Kingston Central',
          notes: []
        }
      }
    });
    
    // Click on the first task
    fireEvent.click(screen.getByText(/Traffic Control/i));
    
    // Wait for task details to load
    await waitFor(() => {
      expect(screen.getByText(/Task Details/i)).toBeInTheDocument();
    });
    
    // Mock successful status update
    axios.put.mockResolvedValueOnce({
      data: {
        task: {
          _id: '1',
          title: 'Traffic Control',
          description: 'Manage traffic flow at Half Way Tree intersection',
          priority: 'high',
          status: 'in_progress',
          location: 'Half Way Tree',
          dueDate: '2025-04-15',
          assignedTo: 'officer1',
          assignedBy: '123',
          department: 'Kingston Central',
          notes: []
        }
      }
    });
    
    // Click the update status button
    fireEvent.click(screen.getByText(/Update Status/i));
    
    // Select new status
    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    
    // Add a note
    const noteInput = screen.getByLabelText(/Note/i);
    fireEvent.change(noteInput, { target: { value: 'Task has been started' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Update/i));
    
    // Verify that axios.put was called with the correct arguments
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/tasks/1/status',
        {
          status: 'in_progress',
          note: 'Task has been started'
        },
        expect.any(Object)
      );
    });
    
    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Task status updated successfully/i)).toBeInTheDocument();
    });
  });
});
