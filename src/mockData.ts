import { Employee, AttendanceRecord, Project, Message, Contact } from './types';

export const currentUser: Employee = {
  id: 'EMP1024',
  name: 'Krishna Sangam',
  email: 'Krishna.sangam11@gmail.com',
  role: 'Senior Software Developer',
  department: 'Technology',
  joiningDate: '2026-02-01',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krishna'
};

export const attendanceRecords: AttendanceRecord[] = [
  { date: '2026-03-26', status: 'Present', checkIn: '09:00 AM', checkOut: '--' },
  { date: '2026-02-26', status: 'WFH', checkIn: '09:30 AM', checkOut: '06:30 PM' },
  { date: '2026-02-27', status: 'Leave', checkIn: '--', checkOut: '--' }, // Friday - Week Off
  { date: '2026-02-28', status: 'WFH', checkIn: '09:15 AM', checkOut: '06:15 PM' },
  { date: '2026-03-01', status: 'WFH', checkIn: '09:05 AM', checkOut: '06:45 PM' },
  { date: '2026-03-02', status: 'Leave', checkIn: '--', checkOut: '--' }, // Monday - Week Off
  { date: '2026-03-03', status: 'WFH', checkIn: '09:10 AM', checkOut: '06:20 PM' },
  { date: '2026-03-04', status: 'WFH', checkIn: '09:30 AM', checkOut: '06:00 PM' },
  { date: '2026-03-05', status: 'WFH', checkIn: '09:30 AM', checkOut: '06:00 PM' },
  { date: '2026-03-06', status: 'Leave', checkIn: '--', checkOut: '--' }, // Friday - Week Off
  { date: '2026-03-07', status: 'WFH', checkIn: '08:55 AM', checkOut: '06:10 PM' },
  { date: '2026-03-08', status: 'WFH', checkIn: '09:00 AM', checkOut: '06:05 PM' },
  { date: '2026-03-09', status: 'Leave', checkIn: '--', checkOut: '--' }, // Monday - Week Off
  { date: '2026-03-10', status: 'WFH', checkIn: '09:10 AM', checkOut: '06:30 PM' },
  { date: '2026-03-11', status: 'WFH', checkIn: '09:05 AM', checkOut: '06:40 PM' },
  { date: '2026-03-12', status: 'WFH', checkIn: '09:45 AM', checkOut: '06:15 PM' },
  { date: '2026-03-13', status: 'Leave', checkIn: '--', checkOut: '--' }, // Friday - Week Off
  { date: '2026-03-14', status: 'WFH', checkIn: '09:00 AM', checkOut: '06:00 PM' },
  { date: '2026-03-15', status: 'WFH', checkIn: '09:15 AM', checkOut: '06:20 PM' },
  { date: '2026-03-16', status: 'Leave', checkIn: '--', checkOut: '--' }, // Monday - Week Off
  { date: '2026-03-17', status: 'WFH', checkIn: '09:05 AM', checkOut: '06:10 PM' },
  { date: '2026-03-18', status: 'WFH', checkIn: '09:10 AM', checkOut: '06:35 PM' },
  { date: '2026-03-19', status: 'WFH', checkIn: '10:00 AM', checkOut: '06:00 PM' },
  { date: '2026-03-20', status: 'Leave', checkIn: '--', checkOut: '--' }, // Friday - Week Off
  { date: '2026-03-21', status: 'WFH', checkIn: '09:00 AM', checkOut: '06:15 PM' },
  { date: '2026-03-22', status: 'WFH', checkIn: '09:10 AM', checkOut: '06:25 PM' },
  { date: '2026-03-23', status: 'Leave', checkIn: '--', checkOut: '--' }, // Monday - Week Off
  { date: '2026-03-24', status: 'WFH', checkIn: '09:05 AM', checkOut: '06:40 PM' },
  { date: '2026-03-25', status: 'WFH', checkIn: '09:00 AM', checkOut: '06:10 PM' },
];

export const projects: Project[] = [
  {
    id: 'PRJ001',
    name: 'BPM Automation Tool',
    description: 'Developing a tool to automate internal BPM processes for 1point1 clients.',
    deadline: '2026-04-15',
    status: 'In Progress',
    assignedTo: 'Krishna Sangam'
  },
  {
    id: 'PRJ002',
    name: 'Customer Service Portal',
    description: 'Revamping the customer service portal for improved user experience.',
    deadline: '2026-05-01',
    status: 'Pending',
    assignedTo: 'Krishna Sangam'
  }
];

export const emailThread: Message[] = [
  {
    id: 'MSG001',
    sender: 'Krishna Sangam',
    recipient: 'HR Department',
    subject: 'Salary Not Credited - February 2026',
    content: 'Dear HR Team,\n\nI am writing to bring to your attention that my salary for the month of February 2026 has not yet been credited to my account. My joining date was 1st February 2026.\n\nPlease look into this matter and let me know the status.\n\nRegards,\nKrishna Sangam',
    date: '2026-03-01T10:00:00Z',
    isRead: true
  },
  {
    id: 'MSG002',
    sender: 'Rajesh Kumar (Reporting Manager)',
    recipient: 'Krishna Sangam',
    subject: 'Re: Salary Not Credited - February 2026',
    content: 'Hi Krishna,\n\nI have received your email. I am checking with the accounts department regarding the delay. I will update you as soon as I hear back from them.\n\nBest,\nRajesh',
    date: '2026-03-05T14:30:00Z',
    isRead: true
  },
  {
    id: 'MSG003',
    sender: 'Krishna Sangam',
    recipient: 'HR Department',
    subject: 'Follow-up: Salary Status',
    content: 'Dear Team,\n\nIt has been 10 days since my last email, and I still haven\'t received any update or the salary credit. This is causing some financial inconvenience.\n\nCould you please provide an urgent update?\n\nRegards,\nKrishna',
    date: '2026-03-10T09:15:00Z',
    isRead: true
  },
  {
    id: 'MSG004',
    sender: 'Sneha Sharma (HR)',
    recipient: 'Krishna Sangam',
    subject: 'Re: Follow-up: Salary Status',
    content: 'Hi Krishna,\n\nApologies for the delay. Your payroll is currently being processed. You should expect the credit by the 15th of this month.\n\nRegards,\nSneha Sharma',
    date: '2026-03-12T11:45:00Z',
    isRead: true
  },
  {
    id: 'MSG005',
    sender: 'Krishna Sangam',
    recipient: 'Rajesh Kumar',
    subject: 'Urgent: Salary still not received',
    content: 'Hi Rajesh,\n\nI was told by HR that I would receive the salary by the 15th, but it\'s now the 18th and there is still no credit. I am facing significant issues due to this.\n\nPlease help escalate this.\n\nRegards,\nKrishna',
    date: '2026-03-18T16:20:00Z',
    isRead: true
  },
  {
    id: 'MSG006',
    sender: 'Rajesh Kumar',
    recipient: 'Krishna Sangam',
    subject: 'Re: Urgent: Salary still not received',
    content: 'Hi Krishna,\n\nI understand your concern. I have escalated this directly to the Finance Head. We will resolve this shortly.\n\nBest,\nRajesh',
    date: '2026-03-20T10:10:00Z',
    isRead: true
  },
  {
    id: 'MSG007',
    sender: 'Sneha Sharma (HR)',
    recipient: 'Krishna Sangam',
    subject: 'Salary Hold - Clarification Required',
    content: 'Dear Krishna,\n\nUpon review, it was found that your salary was put on hold because you extended your Work From Home (WFH) period without formal approval from the management. This has caused a discrepancy in the attendance records.\n\nPlease submit a formal apology letter explaining the situation to proceed with the release of your salary.\n\nRegards,\nSneha Sharma',
    date: '2026-03-24T11:00:00Z',
    isRead: true
  },
  {
    id: 'MSG008',
    sender: 'Krishna Sangam',
    recipient: 'Sneha Sharma (HR)',
    subject: 'Apology Letter - WFH Extension',
    content: 'Dear Sneha,\n\nPlease find attached my formal apology letter regarding the unauthorized WFH extension. I apologize for the oversight and ensure that all future leaves/WFH will be formally approved.\n\nI request you to kindly release my pending salary.\n\nRegards,\nKrishna Sangam',
    date: '2026-03-24T15:30:00Z',
    isRead: true
  },
  {
    id: 'MSG009',
    sender: 'Sneha Sharma (HR)',
    recipient: 'Krishna Sangam',
    subject: 'Salary Release Confirmation',
    content: 'Dear Krishna,\n\nYour apology has been accepted by the management. We have initiated the process to release your pending salary for February and March.\n\nYou will receive the combined credit for both months between 31st March and 10th April.\n\nRegards,\nSneha Sharma',
    date: '2026-03-25T12:00:00Z',
    isRead: true
  },
  {
    id: 'MSG010',
    sender: 'Krishna Sangam',
    recipient: 'Sneha Sharma (HR)',
    subject: 'Request for WFH Extension - Till 5th April',
    content: 'Dear Sneha,\n\nThank you for the confirmation regarding the salary release.\n\nI would like to request a further extension of my Work From Home (WFH) until 5th April 2026 due to some personal commitments at home. I will ensure that my productivity remains high and all deadlines are met.\n\nI request you to kindly approve this request.\n\nRegards,\nKrishna Sangam',
    date: '2026-03-25T16:45:00Z',
    isRead: true
  }
];

const departments = ['Operations', 'Technology', 'HR', 'Finance', 'Sales', 'Customer Support', 'Quality Assurance'];
const designations = ['Executive', 'Senior Executive', 'Team Lead', 'Manager', 'Senior Manager', 'Developer', 'Analyst'];
const names = ['Amit', 'Priya', 'Rahul', 'Anjali', 'Vikram', 'Sonia', 'Karan', 'Megha', 'Deepak', 'Ritu', 'Arjun', 'Pooja', 'Sanjay', 'Kavita', 'Manish', 'Neha', 'Rohan', 'Swati', 'Abhishek', 'Divya'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Yadav', 'Jain', 'Agrawal', 'Mishra', 'Tiwari', 'Choudhary', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Bose', 'Chatterjee', 'Das', 'Malhotra', 'Kapoor'];

export const contacts: Contact[] = [
  {
    id: currentUser.id,
    name: currentUser.name,
    phone: '+91 98765 43210',
    email: currentUser.email,
    designation: currentUser.role,
    department: currentUser.department
  },
  ...Array.from({ length: 499 }, (_, i) => {
  const firstName = names[Math.floor(Math.random() * names.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const dept = departments[Math.floor(Math.random() * departments.length)];
  const desig = designations[Math.floor(Math.random() * designations.length)];
  
  return {
    id: `EMP${1000 + i}`,
    name: `${firstName} ${lastName}`,
    phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@1point1.in`,
    designation: desig,
    department: dept
  };
})];
