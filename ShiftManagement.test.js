import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShiftManagement from '../pages/supervisor/ShiftManagement';
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

describe('ShiftManagement Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful shifts data
    axios.get.mockResolvedValueOnce({
      data: {
        shifts: [
          {
            _id: '1',
            name: 'Morning Patrol',
            startTime: '08:00',
            endTime: '16:00',
            department: 'Kingston Central',
            description: 'Regular morning patrol shift',
            capacity: 10,
            recurrence: 'daily'
          },
          {
            _id: '2',
            name: 'Evening Patrol',
            startTime: '16:00',
            endTime: '00:00',
            department: 'Kingston Central',
            description: 'Regular evening patrol shift',
            capacity: 8,
            recurrence: 'daily'
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

  test('renders shift management page correctly', async () => {
    render(
      <BrowserRouter>
        <ShiftManagement />
      </BrowserRouter>
    );

    // Check if the page title is rendered
    expect(screen.getByText(/Shift Management/i)).toBeInTheDocument();
    
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText(/Morning Patrol/i)).toBeInTheDocument();
      expect(screen.getByText(/Evening Patrol/i)).toBeInTheDocument();
    });
    
    // Check if the create shift button is rendered
    expect(screen.getByText(/Create New Shift/i)).toBeInTheDocument();
  });

  test('opens create shift modal when button is clicked', async () => {
    render(
      <BrowserRouter>
        <ShiftManagement />
      </BrowserRouter>
    );
    
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText(/Morning Patrol/i)).toBeInTheDocument();
    });
    
    // Click the create shift button
    fireEvent.click(screen.getByText(/Create New Shift/i));
    
    // Check if the modal is opened
    expect(screen.getByText(/Create New Shift Template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shift Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  test('creates a new shift successfully', async () => {
    // Mock successful shift creation
    axios.post.mockResolvedValueOnce({
      data: {
        shift: {
          _id: '3',
          name: 'Night Patrol',
          startTime: '00:00',
          endTime: '08:00',
          department: 'Kingston Central',
          description: 'Regular night patrol shift',
          capacity: 6,
          recurrence: 'daily'
        }
      }
    });
    
    render(
      <BrowserRouter>
        <ShiftManagement />
      </BrowserRouter>
    );
    
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText(/Morning Patrol/i)).toBeInTheDocument();
    });
    
    // Click the create shift button
    fireEvent.click(screen.getByText(/Create New Shift/i));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Shift Name/i), { target: { value: 'Night Patrol' } });
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '00:00' } });
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: '08:00' } });
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Regular night patrol shift' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Create Shift/i));
    
    // Verify that axios.post was called with the correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/shifts',
        {
          name: 'Night Patrol',
          startTime: '00:00',
          endTime: '08:00',
          capacity: '6',
          description: 'Regular night patrol shift',
          recurrence: 'daily'
        },
        expect.any(Object)
      );
    });
    
    // Mock the updated shifts list after creation
    axios.get.mockResolvedValueOnce({
      data: {
        shifts: [
          {
            _id: '1',
            name: 'Morning Patrol',
            startTime: '08:00',
            endTime: '16:00',
            department: 'Kingston Central',
            description: 'Regular morning patrol shift',
            capacity: 10,
            recurrence: 'daily'
          },
          {
            _id: '2',
            name: 'Evening Patrol',
            startTime: '16:00',
            endTime: '00:00',
            department: 'Kingston Central',
            description: 'Regular evening patrol shift',
            capacity: 8,
            recurrence: 'daily'
          },
          {
            _id: '3',
            name: 'Night Patrol',
            startTime: '00:00',
            endTime: '08:00',
            department: 'Kingston Central',
            description: 'Regular night patrol shift',
            capacity: 6,
            recurrence: 'daily'
          }
        ]
      }
    });
    
    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Shift created successfully/i)).toBeInTheDocument();
    });
  });

  test('opens assign officer modal when assign button is clicked', async () => {
    render(
      <BrowserRouter>
        <ShiftManagement />
      </BrowserRouter>
    );
    
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText(/Morning Patrol/i)).toBeInTheDocument();
    });
    
    // Click the assign button for the first shift
    const assignButtons = screen.getAllByText(/Assign Officers/i);
    fireEvent.click(assignButtons[0]);
    
    // Check if the modal is opened
    expect(screen.getByText(/Assign Officers to Shift/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Officers/i)).toBeInTheDocument();
    
    // Check if officers are listed
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });

  test('assigns officers to shift successfully', async () => {
    // Mock successful officer assignment
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Officers assigned successfully'
      }
    });
    
    render(
      <BrowserRouter>
        <ShiftManagement />
      </BrowserRouter>
    );
    
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText(/Morning Patrol/i)).toBeInTheDocument();
    });
    
    // Click the assign button for the first shift
    const assignButtons = screen.getAllByText(/Assign Officers/i);
    fireEvent.click(assignButtons[0]);
    
    // Wait for officers to load
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
    
    // Select a date
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-04-15' } });
    
    // Select officers
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Select John Doe
    
    // Submit the form
    fireEvent.click(screen.getByText(/Assign/i));
    
    // Verify that axios.post was called with the correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/shifts/1/assign',
        {
          officerIds: ['officer1'],
          date: '2025-04-15'
        },
        expect.any(Object)
      );
    });
    
    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Officers assigned successfully/i)).toBeInTheDocument();
    });
  });
});
