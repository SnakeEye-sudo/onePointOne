export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joiningDate: string;
  avatar?: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'WFH' | 'Leave';
  checkIn?: string;
  checkOut?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  assignedTo: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  designation: string;
  department: string;
}
