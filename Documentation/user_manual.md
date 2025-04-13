# Jamaica Constabulary Force Workforce Management System
# User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Web Application Guide](#web-application-guide)
   - [Administrator Interface](#administrator-interface)
   - [Supervisor Interface](#supervisor-interface)
   - [Officer Interface (Web)](#officer-interface-web)
4. [Mobile Application Guide](#mobile-application-guide)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

## Introduction

The Jamaica Constabulary Force (JCF) Workforce Management System is designed to streamline shift scheduling, task assignment, attendance tracking, and performance monitoring for police departments. This user manual provides comprehensive guidance on how to use both the web and mobile interfaces of the system.

### Key Features

- **User Management**: Create and manage user accounts with role-based permissions
- **Shift Management**: Create shift templates, schedule shifts, and assign officers
- **Task Assignment**: Create, assign, and track tasks for officers
- **Real-time Geolocation**: Track officer locations in real-time for efficient resource allocation
- **Attendance Tracking**: Monitor check-in/check-out times with geolocation verification
- **Performance Analytics**: Generate reports on officer performance and department metrics
- **Mobile Access**: Provide officers with mobile access to shifts, tasks, and check-in/out functionality
- **Biometric Authentication**: Secure access with fingerprint/facial recognition on mobile devices

## Getting Started

### System Access

The JCF Workforce Management System can be accessed through:
1. **Web Application**: https://jcf-wfm.gov.jm
2. **Mobile Application**: Available on iOS App Store and Google Play Store

### Account Creation

New user accounts must be created by an administrator or supervisor. Once your account is created, you will receive an email with temporary login credentials.

### First Login

1. Navigate to the login page
2. Enter your email address and temporary password
3. You will be prompted to change your password
4. Create a new password following the security requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

### Mobile App Installation

1. Search for "JCF Workforce" in the App Store (iOS) or Google Play Store (Android)
2. Download and install the application
3. Open the application and log in with your credentials
4. Follow the prompts to set up biometric authentication (fingerprint or facial recognition)

## Web Application Guide

### Administrator Interface

#### Dashboard

The administrator dashboard provides an overview of the entire system, including:
- Total number of active officers
- Current shift statistics
- Task completion rates
- Department performance metrics
- Recent system activities

![Administrator Dashboard](https://jcf-wfm.gov.jm/images/admin-dashboard.png)

#### User Management

Administrators can manage all users in the system:

**To create a new user:**
1. Navigate to "Users" in the main menu
2. Click "Add New User"
3. Fill in the required information:
   - First Name
   - Last Name
   - Email Address
   - Badge Number
   - Role (Admin, Supervisor, Officer)
   - Department
4. Click "Create User"
5. The system will send an email to the new user with temporary login credentials

**To edit a user:**
1. Navigate to "Users" in the main menu
2. Find the user in the list or use the search function
3. Click the "Edit" button
4. Update the user information
5. Click "Save Changes"

**To deactivate a user:**
1. Navigate to "Users" in the main menu
2. Find the user in the list or use the search function
3. Click the "Deactivate" button
4. Confirm the deactivation

#### Department Management

Administrators can manage departments:

**To create a new department:**
1. Navigate to "Departments" in the main menu
2. Click "Add New Department"
3. Fill in the department name and description
4. Assign a department head (optional)
5. Click "Create Department"

**To edit a department:**
1. Navigate to "Departments" in the main menu
2. Find the department in the list
3. Click the "Edit" button
4. Update the department information
5. Click "Save Changes"

#### System Reports

Administrators have access to comprehensive system reports:

**To generate a performance report:**
1. Navigate to "Reports" in the main menu
2. Select "Performance Report"
3. Set the date range
4. Select the department (optional)
5. Click "Generate Report"
6. View the report or export it as PDF, Excel, or CSV

**To generate an attendance report:**
1. Navigate to "Reports" in the main menu
2. Select "Attendance Report"
3. Set the date range
4. Select the department (optional)
5. Click "Generate Report"
6. View the report or export it as PDF, Excel, or CSV

### Supervisor Interface

#### Dashboard

The supervisor dashboard provides an overview of their department:
- Number of officers on duty
- Current shift information
- Task status summary
- Officer locations map
- Recent department activities

![Supervisor Dashboard](https://jcf-wfm.gov.jm/images/supervisor-dashboard.png)

#### Shift Management

Supervisors can manage shifts for their department:

**To create a shift template:**
1. Navigate to "Shifts" in the main menu
2. Click "Create New Shift"
3. Fill in the shift details:
   - Shift Name
   - Start Time
   - End Time
   - Capacity (number of officers)
   - Description
   - Recurrence (Daily, Weekly, Monthly, Once)
4. Click "Create Shift"

**To assign officers to a shift:**
1. Navigate to "Shifts" in the main menu
2. Find the shift in the list
3. Click "Assign Officers"
4. Select the date for the assignment
5. Check the officers to assign to the shift
6. Click "Assign"

**To view shift schedule:**
1. Navigate to "Schedule" in the main menu
2. Use the calendar view to see all scheduled shifts
3. Click on a shift to view details and assigned officers

#### Task Management

Supervisors can create and assign tasks:

**To create a new task:**
1. Navigate to "Tasks" in the main menu
2. Click "Create New Task"
3. Fill in the task details:
   - Title
   - Description
   - Priority (Low, Medium, High)
   - Location
   - Due Date
   - Assigned Officer
4. Click "Create Task"

**To view task status:**
1. Navigate to "Tasks" in the main menu
2. Use the filters to view tasks by status, priority, or assigned officer
3. Click on a task to view details and updates

**To update a task:**
1. Navigate to "Tasks" in the main menu
2. Find the task in the list
3. Click on the task to view details
4. Click "Edit" to update task details or "Update Status" to change the status
5. Make the necessary changes
6. Click "Save Changes"

#### Officer Tracking

Supervisors can track officer locations:

**To view officer locations:**
1. Navigate to "Tracking" in the main menu
2. The map will show the current location of all on-duty officers
3. Click on an officer marker to view details
4. Use the filters to show only specific officers or shifts

#### Reports

Supervisors can generate reports for their department:

**To generate a department performance report:**
1. Navigate to "Reports" in the main menu
2. Select "Department Performance"
3. Set the date range
4. Click "Generate Report"
5. View the report or export it as PDF, Excel, or CSV

**To generate an officer performance report:**
1. Navigate to "Reports" in the main menu
2. Select "Officer Performance"
3. Set the date range
4. Select the officer
5. Click "Generate Report"
6. View the report or export it as PDF, Excel, or CSV

### Officer Interface (Web)

#### Dashboard

The officer dashboard provides an overview of their schedule and tasks:
- Current shift information
- Upcoming shifts
- Active tasks
- Performance metrics
- Recent activities

![Officer Dashboard](https://jcf-wfm.gov.jm/images/officer-dashboard.png)

#### Shift Schedule

Officers can view their shift schedule:

**To view upcoming shifts:**
1. Navigate to "My Shifts" in the main menu
2. The calendar view will show all scheduled shifts
3. Click on a shift to view details

**To request a shift swap:**
1. Navigate to "My Shifts" in the main menu
2. Find the shift you want to swap
3. Click "Request Swap"
4. Select the reason for the swap
5. Click "Submit Request"

**To request leave:**
1. Navigate to "My Shifts" in the main menu
2. Click "Request Leave"
3. Select the date range
4. Select the leave type
5. Add a reason (optional)
6. Click "Submit Request"

#### Task Management

Officers can view and update their assigned tasks:

**To view assigned tasks:**
1. Navigate to "My Tasks" in the main menu
2. Use the filters to view tasks by status or priority
3. Click on a task to view details

**To update task status:**
1. Navigate to "My Tasks" in the main menu
2. Find the task in the list
3. Click on the task to view details
4. Click "Update Status"
5. Select the new status
6. Add a note about the update
7. Click "Save"

#### Attendance

Officers can check in and out of shifts:

**To check in to a shift:**
1. Navigate to "My Shifts" in the main menu
2. Find your current shift
3. Click "Check In"
4. Confirm your location
5. Click "Confirm Check In"

**To check out from a shift:**
1. Navigate to "My Shifts" in the main menu
2. Find your current shift
3. Click "Check Out"
4. Confirm your location
5. Click "Confirm Check Out"

## Mobile Application Guide

### Login and Authentication

**To log in to the mobile app:**
1. Open the JCF Workforce app
2. Enter your email and password
3. Tap "Login"

**To set up biometric authentication:**
1. After logging in, you will be prompted to set up biometric authentication
2. Tap "Enable Biometric Login"
3. Follow the prompts to register your fingerprint or face
4. Once registered, you can use biometrics for future logins

![Mobile Login](https://jcf-wfm.gov.jm/images/mobile-login.png)

### Officer Dashboard

The mobile dashboard provides quick access to key features:
- Current shift information
- Check-in/check-out buttons
- Active tasks count
- Upcoming shifts
- Quick access to emergency features

![Mobile Dashboard](https://jcf-wfm.gov.jm/images/mobile-dashboard.png)

### Shift Management

**To view your shifts:**
1. Tap "Shifts" in the bottom navigation
2. View your upcoming shifts in the list
3. Tap on a shift to view details

**To check in to a shift:**
1. From the dashboard, tap "Check In" when your shift starts
2. Confirm your location
3. Use biometric authentication to verify your identity
4. Tap "Confirm Check In"

**To check out from a shift:**
1. From the dashboard, tap "Check Out" when your shift ends
2. Confirm your location
3. Use biometric authentication to verify your identity
4. Tap "Confirm Check Out"

### Task Management

**To view your tasks:**
1. Tap "Tasks" in the bottom navigation
2. View your tasks sorted by status and priority
3. Tap on a task to view details

**To update a task:**
1. Tap "Tasks" in the bottom navigation
2. Find the task you want to update
3. Tap on the task to view details
4. Tap "Update Status"
5. Select the new status
6. Add a note about the update
7. Use biometric authentication to verify your identity
8. Tap "Save"

### Geolocation

**To view your location history:**
1. Tap "Location" in the bottom navigation
2. View your current location on the map
3. Scroll down to see your location history

**To enable/disable location tracking:**
1. Tap "Location" in the bottom navigation
2. Use the toggle switch to enable or disable location tracking
3. When disabling, confirm your choice and provide a reason

**To trigger an emergency alert:**
1. Tap "Location" in the bottom navigation
2. Tap the "Emergency" button
3. Confirm the emergency alert
4. Your location will be shared in real-time with the command center and nearby officers

## Common Tasks

### Password Reset

**To reset your password (Web):**
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Click "Reset Password"
4. Check your email for a password reset link
5. Click the link and follow the instructions to create a new password

**To reset your password (Mobile):**
1. Tap "Forgot Password" on the login screen
2. Enter your email address
3. Tap "Reset Password"
4. Check your email for a password reset link
5. Follow the link to reset your password

### Profile Management

**To update your profile (Web):**
1. Click on your name in the top-right corner
2. Select "My Profile"
3. Update your information
4. Click "Save Changes"

**To update your profile (Mobile):**
1. Tap "Profile" in the bottom navigation
2. Tap "Edit Profile"
3. Update your information
4. Tap "Save"

### Notifications

**To view notifications (Web):**
1. Click the bell icon in the top-right corner
2. View your notifications
3. Click on a notification to view details
4. Click "Mark All as Read" to clear notifications

**To view notifications (Mobile):**
1. Tap the bell icon in the top-right corner
2. View your notifications
3. Tap on a notification to view details
4. Tap "Clear All" to dismiss notifications

## Troubleshooting

### Common Issues

#### Login Problems

**Issue**: Unable to log in with correct credentials
- **Solution**: 
  1. Verify your email address and password
  2. Check if Caps Lock is enabled
  3. Clear browser cache and cookies
  4. Try resetting your password

**Issue**: Biometric authentication not working
- **Solution**:
  1. Ensure your finger/face is properly positioned
  2. Check if biometrics are enabled in your device settings
  3. Re-register your biometrics in the app settings
  4. Use password login as a fallback

#### Mobile App Issues

**Issue**: App crashes when opening
- **Solution**:
  1. Force close the app and reopen
  2. Restart your device
  3. Check for app updates
  4. Reinstall the app if necessary

**Issue**: Location tracking not working
- **Solution**:
  1. Ensure location services are enabled on your device
  2. Grant the app permission to access your location
  3. Check your internet connection
  4. Restart the app

#### Shift Management Issues

**Issue**: Unable to check in to shift
- **Solution**:
  1. Verify you are within the allowed time window (15 minutes before to 15 minutes after shift start)
  2. Check your internet connection
  3. Ensure location services are enabled
  4. Contact your supervisor if the issue persists

**Issue**: Shift not appearing in schedule
- **Solution**:
  1. Refresh the page/app
  2. Check the date range in the calendar view
  3. Verify with your supervisor that you are assigned to the shift

#### Task Management Issues

**Issue**: Cannot update task status
- **Solution**:
  1. Verify you are assigned to the task
  2. Check your internet connection
  3. Ensure you have the necessary permissions
  4. Try logging out and logging back in

**Issue**: Task updates not saving
- **Solution**:
  1. Check your internet connection
  2. Ensure all required fields are filled
  3. Try again after a few minutes
  4. Contact support if the issue persists

### Support Contact

If you encounter any issues that cannot be resolved using the troubleshooting steps above, please contact the JCF IT Support team:

- **Email**: support@jcf-wfm.gov.jm
- **Phone**: (876) 555-1234
- **Hours**: Monday to Friday, 8:00 AM to 5:00 PM

For urgent issues outside of regular hours, please contact the 24/7 support line at (876) 555-5678.
