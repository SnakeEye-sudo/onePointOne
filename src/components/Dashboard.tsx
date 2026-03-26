import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Mail, Users, Briefcase, User, LogOut, Search, MapPin, Phone, CheckCircle2, AlertCircle, Download, CreditCard, Globe, IndianRupee, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currentUser, attendanceRecords, projects, emailThread, contacts } from '@/src/mockData';
import { toast } from 'sonner';

interface BroadcastRequest {
  id: string;
  targetDate: string;
  offDayToSwap: string;
  message: string;
  status: 'Broadcasting' | 'Accepted' | 'Cancelled';
  timestamp: string;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  const [myRequests, setMyRequests] = useState<BroadcastRequest[]>([]);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    targetDate: '',
    offDayToSwap: 'Friday',
    message: ''
  });
  const [incomingRequests, setIncomingRequests] = useState(
    contacts.slice(1, 4).map((contact, idx) => ({
      id: contact.id,
      name: contact.name,
      day: idx % 2 === 0 ? 'Friday' : 'Monday',
      message: `Hey Krishna, can we swap our off days? I have some urgent work on ${idx % 2 === 0 ? 'Friday' : 'Monday'}.`,
      status: 'pending' as 'pending' | 'accepted'
    }))
  );

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.designation.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 100); // Limit to 100 for performance in UI, but data has 500

  const handleMarkAttendance = () => {
    setAttendanceMarked(true);
    toast.success('Attendance marked successfully for today!');
  };

  const handleToggleBreak = () => {
    setOnBreak(!onBreak);
    toast.info(onBreak ? 'Break ended. Back to work!' : 'Break started. Enjoy your rest!');
  };

  const handleBroadcast = () => {
    if (!newRequest.targetDate) {
      toast.error('Please select a date to swap.');
      return;
    }

    const request: BroadcastRequest = {
      id: `REQ${Date.now()}`,
      targetDate: newRequest.targetDate,
      offDayToSwap: newRequest.offDayToSwap,
      message: newRequest.message || `Hey team, I need to swap my ${newRequest.offDayToSwap} off. Can someone cover for me?`,
      status: 'Broadcasting',
      timestamp: new Date().toISOString()
    };

    setMyRequests([request, ...myRequests]);
    setIsBroadcastOpen(false);
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Broadcasting to team...',
        success: 'Request broadcasted to all team members!',
        error: 'Failed to broadcast.'
      }
    );
  };

  const handleCancelRequest = (id: string) => {
    setMyRequests(myRequests.map(req => 
      req.id === id ? { ...req, status: 'Cancelled' as const } : req
    ));
    toast.info('Broadcast request cancelled.');
    
    // Remove after a delay for UI feedback
    setTimeout(() => {
      setMyRequests(prev => prev.filter(req => req.id !== id));
    }, 1500);
  };

  const handleAcceptIncoming = (id: string) => {
    setIncomingRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'accepted' as const } : req
    ));
    toast.success('Exchange request accepted!');
    
    // Optional: remove after some time or keep as "Accepted"
    setTimeout(() => {
      setIncomingRequests(prev => prev.filter(req => req.id !== id));
    }, 2000);
  };

  const handleDeclineIncoming = (id: string) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== id));
    toast.info('Exchange request declined.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-xl tracking-tight">1point1</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Employee Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={<Briefcase size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarLink icon={<CalendarIcon size={18} />} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <SidebarLink icon={<CheckCircle2 size={18} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <SidebarLink icon={<Mail size={18} />} label="Communications" active={activeTab === 'communications'} onClick={() => setActiveTab('communications')} />
          <SidebarLink icon={<Users size={18} />} label="Directory" active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} />
          <SidebarLink icon={<CreditCard size={18} />} label="ID & Gate Pass" active={activeTab === 'id-pass'} onClick={() => setActiveTab('id-pass')} />
          <SidebarLink icon={<IndianRupee size={18} />} label="Payroll" active={activeTab === 'payroll'} onClick={() => setActiveTab('payroll')} />
          <SidebarLink icon={<FileText size={18} />} label="Leaves" active={activeTab === 'leaves'} onClick={() => setActiveTab('leaves')} />
          <SidebarLink icon={<CalendarIcon size={18} />} label="Roster & Exchange" active={activeTab === 'roster'} onClick={() => setActiveTab('roster')} />
          <SidebarLink icon={<TrendingUp size={18} />} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
          <SidebarLink icon={<User size={18} />} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="w-10 h-10 border-2 border-blue-100">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">1point1</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-red-500">
            <LogOut size={20} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Section */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening at 1point1 Gurgaon today.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {attendanceMarked && (
                      <Button 
                        onClick={handleToggleBreak} 
                        variant={onBreak ? "destructive" : "outline"}
                        className="font-bold gap-2"
                      >
                        <Clock size={16} />
                        {onBreak ? 'End Break' : 'Take Break'}
                      </Button>
                    )}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                      <Clock className="text-blue-600" size={20} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Time</p>
                        <p className="text-sm font-bold text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgent Notification */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-red-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 border-2 border-red-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase tracking-tight">Urgent Requirement</p>
                      <p className="text-red-50 font-bold">Report to the Gurgaon office till 31st March 2026, Anyhow.</p>
                    </div>
                  </div>
                  <Badge className="bg-white text-red-600 font-black px-4 py-1">MANDATORY</Badge>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider">Attendance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold">{attendanceMarked ? 'Marked' : 'Not Marked'}</p>
                          <p className="text-blue-100 text-xs mt-1">Today: {new Date().toLocaleDateString()}</p>
                        </div>
                        {!attendanceMarked && (
                          <Button onClick={handleMarkAttendance} className="bg-white text-blue-600 hover:bg-blue-50 font-bold">
                            Mark Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                          <p className="text-slate-500 text-xs mt-1">1 deadline approaching</p>
                        </div>
                        <Briefcase className="text-slate-200" size={40} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Unread Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold text-slate-900">0</p>
                          <p className="text-slate-500 text-xs mt-1">All caught up!</p>
                        </div>
                        <Mail className="text-slate-200" size={40} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="text-blue-600" size={20} />
                        <span>Work Assigned</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-black text-blue-900">Current Task: API Integration</p>
                          <Badge className="bg-blue-600">Assigned</Badge>
                        </div>
                        <p className="text-xs text-blue-800 leading-relaxed">Complete the integration of the new payroll API with the employee dashboard. Ensure all edge cases for salary hold are handled correctly.</p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
                          <Clock size={12} />
                          <span>Started: 25th March 2026</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-black text-slate-900">Next Task: UI Refinement</p>
                          <Badge variant="outline" className="text-slate-500 border-slate-300">Queued</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">Refine the attendance marking UI to include break tracking and location-based verification as per Gurgaon office standards.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="text-orange-500" size={20} />
                        <span>Recent Announcements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-orange-900 text-sm">WFH Extension Request</p>
                          <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-100 animate-pulse">PENDING</Badge>
                        </div>
                        <p className="text-xs text-orange-800 mt-1">Your request to extend WFH till 5th April 2026 is currently under review by the HR department. Please check back later.</p>
                      </div>
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <p className="font-bold text-blue-900 text-sm">Salary Update - Feb/March Cycle</p>
                        <p className="text-xs text-blue-800 mt-1">The combined salary for February and March will be credited between 31st March and 10th April. Please ensure your attendance records are up to date.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Attendance Section */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">Attendance History</h1>
                  <Button onClick={handleMarkAttendance} disabled={attendanceMarked} className="bg-blue-600 hover:bg-blue-700">
                    {attendanceMarked ? 'Today\'s Attendance Marked' : 'Mark Today\'s Attendance'}
                  </Button>
                </div>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.slice().reverse().map((record, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{record.date}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  record.status === 'Present' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                                  record.status === 'WFH' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 
                                  'bg-red-100 text-red-700 hover:bg-red-100'
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.checkIn || '--'}</TableCell>
                            <TableCell>{record.checkOut || '--'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projects Section */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Project Allocation</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(project => (
                    <Card key={project.id} className="border-none shadow-sm overflow-hidden">
                      <div className="h-2 bg-blue-600" />
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <Badge>{project.status}</Badge>
                        </div>
                        <CardDescription>{project.id}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-slate-500">
                            <CalendarIcon size={14} />
                            <span>Deadline: {project.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <User size={14} />
                            <span>Assigned to: {project.assignedTo}</span>
                          </div>
                        </div>
                        <div className="pt-4">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-2/3" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">65% Progress</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Communications Section */}
            {activeTab === 'communications' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Communication History</h1>
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Email Thread: Salary & WFH Discrepancy</CardTitle>
                    <CardDescription>Official correspondence with HR and Reporting Manager</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px] p-6">
                      <div className="space-y-8">
                        {emailThread.map((msg, i) => (
                          <div key={msg.id} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'}`}>
                              <div className="flex items-center justify-between mb-2 gap-4">
                                <p className="text-xs font-bold opacity-80">{msg.sender}</p>
                                <p className="text-[10px] opacity-60">{new Date(msg.date).toLocaleString()}</p>
                              </div>
                              <p className="text-xs font-bold mb-2 underline decoration-1 underline-offset-2">Subject: {msg.subject}</p>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                            {i < emailThread.length - 1 && <div className="w-px h-4 bg-slate-200 my-2 ml-4" />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Directory Section */}
            {activeTab === 'directory' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold text-slate-900">Employee Directory</h1>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search by name, dept, or role..." 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Designation</TableHead>
                          <TableHead>Contact Info</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm text-slate-900">{contact.name}</p>
                                  <p className="text-[10px] text-slate-400">{contact.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">{contact.department}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{contact.designation}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Phone size={12} />
                                  <span>{contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Mail size={12} />
                                  <span>{contact.email}</span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredContacts.length === 0 && (
                      <div className="p-12 text-center">
                        <Users className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-500">No employees found matching your search.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ID & Gate Pass Section */}
            {activeTab === 'id-pass' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">ID Card & Gate Pass</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ID Card Section */}
                  <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-blue-600 text-white pb-8">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard size={20} />
                        <span>Digital ID Card</span>
                      </CardTitle>
                      <CardDescription className="text-blue-100">Official 1point1 Solutions Employee ID</CardDescription>
                    </CardHeader>
                    <CardContent className="relative -mt-6">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                          <User size={48} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{currentUser.name}</h2>
                        <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">{currentUser.role}</p>
                        
                        <div className="w-full mt-8 space-y-4 text-left">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase">Employee ID</span>
                            <span className="text-slate-900 font-bold text-sm">1P1-GUR-2026-042</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase">Department</span>
                            <span className="text-slate-900 font-bold text-sm">{currentUser.department}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase">Blood Group</span>
                            <span className="text-slate-900 font-bold text-sm">B+</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase">Emergency Contact</span>
                            <span className="text-slate-900 font-bold text-sm">+91 99999 88888</span>
                          </div>
                        </div>

                        <div className="mt-8 w-full">
                          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                              <Globe size={16} />
                            </div>
                            <span className="text-xs font-bold tracking-widest">1POINT1 SOLUTIONS LTD</span>
                          </div>
                        </div>

                        <Button 
                          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 font-bold gap-2"
                          onClick={() => {
                            toast.success('ID Card download started...');
                            setTimeout(() => toast.success('ID Card downloaded successfully!'), 2000);
                          }}
                        >
                          <Download size={18} />
                          Download ID Card (PDF)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gate Pass Section */}
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe size={20} className="text-blue-600" />
                        <span>Inter-City Gate Pass</span>
                      </CardTitle>
                      <CardDescription>Request access to other 1point1 branches across India</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-slate-400">Select Destination Branch</Label>
                          <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select a city...</option>
                            <option value="mumbai">Mumbai (Head Office)</option>
                            <option value="bangalore">Bangalore (Tech Hub)</option>
                            <option value="pune">Pune (Operations)</option>
                            <option value="chennai">Chennai (Regional)</option>
                            <option value="hyderabad">Hyderabad (Support)</option>
                            <option value="ahmedabad">Ahmedabad (Sales)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-400">Visit Start Date</Label>
                            <Input type="date" className="rounded-xl border-slate-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-400">Visit End Date</Label>
                            <Input type="date" className="rounded-xl border-slate-200" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-slate-400">Purpose of Visit</Label>
                          <textarea 
                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Briefly explain the reason for your visit..."
                          ></textarea>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                          <AlertCircle className="text-blue-600 shrink-0" size={18} />
                          <p className="text-xs text-blue-800 leading-relaxed">
                            Gate pass requests are subject to approval by your Reporting Manager and the Destination Branch Head. Please apply at least 48 hours in advance.
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl"
                          onClick={() => {
                            toast.success('Gate Pass request submitted successfully!');
                            toast.info('Status: Pending Approval');
                          }}
                        >
                          Request Gate Pass
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Recent Requests</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">Mumbai Branch</p>
                                <p className="text-[10px] text-slate-500">12th April - 15th April</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">PENDING</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Payroll Section */}
            {activeTab === 'payroll' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">Payroll & Finance</h1>
                  <Button variant="outline" className="gap-2">
                    <Download size={16} />
                    Download CTC Structure
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm bg-slate-900 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly CTC</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={24} className="text-blue-400" />
                        <p className="text-3xl font-black">75,000</p>
                      </div>
                      <p className="text-slate-400 text-xs mt-2">Effective from 1st Feb 2026</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-orange-50 border border-orange-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-orange-600 uppercase tracking-wider">Payment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-orange-700">
                        <Clock size={24} />
                        <p className="text-2xl font-black uppercase">On Hold</p>
                      </div>
                      <p className="text-orange-600 text-xs mt-2 font-bold">Processing Feb/March Cycle</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-blue-50 border border-blue-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-blue-600 uppercase tracking-wider">Next Credit Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-blue-700">
                        <CalendarIcon size={24} />
                        <p className="text-2xl font-black">31 Mar - 10 Apr</p>
                      </div>
                      <p className="text-blue-600 text-xs mt-2 font-bold">Estimated Credit Window</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Salary History & Payslips</CardTitle>
                    <CardDescription>You joined on 1st Feb 2026. Your first salary cycle is currently under processing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText size={32} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">No Payslips Available Yet</p>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">Your first payslip will be generated once the combined Feb/March salary is credited.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Leaves Section */}
            {activeTab === 'leaves' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">Leave Management</h1>
                  <div className="flex gap-2">
                    <Badge className="bg-green-600 px-3 py-1">Probation Completed: 15 Mar</Badge>
                    <Button className="bg-blue-600 hover:bg-blue-700 font-bold">Apply for Leave</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Entitlement</p>
                    <p className="text-4xl font-black text-slate-900">12</p>
                    <p className="text-[10px] text-slate-500 mt-1">Annual Quota</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Leaves Used</p>
                    <p className="text-4xl font-black text-blue-600">4</p>
                    <p className="text-[10px] text-slate-500 mt-1">Since Joining</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Leaves Balance</p>
                    <p className="text-4xl font-black text-green-600">8</p>
                    <p className="text-[10px] text-slate-500 mt-1">Available to use</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Pending Requests</p>
                    <p className="text-4xl font-black text-orange-600">1</p>
                    <p className="text-[10px] text-slate-500 mt-1">Awaiting Approval</p>
                  </div>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Leave History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText size={32} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">No Leave History</p>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">You haven't taken any leaves since your probation ended on 15th March.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Roster & Exchange Section */}
            {activeTab === 'roster' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">Leave Roster & Exchange</h1>
                  <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
                        <CalendarIcon size={18} />
                        New Exchange Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Broadcast Exchange Request</DialogTitle>
                        <DialogDescription>
                          Your request will be visible to all 500+ members in the directory.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="swap-date">Date you want OFF</Label>
                          <Input 
                            id="swap-date" 
                            type="date" 
                            value={newRequest.targetDate}
                            onChange={(e) => setNewRequest({...newRequest, targetDate: e.target.value})}
                            className="col-span-3" 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Your Off Day to Swap</Label>
                          <Select 
                            value={newRequest.offDayToSwap} 
                            onValueChange={(val) => setNewRequest({...newRequest, offDayToSwap: val})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Monday">Monday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Input 
                            id="message" 
                            placeholder="e.g. Family function, need to travel..." 
                            value={newRequest.message}
                            onChange={(e) => setNewRequest({...newRequest, message: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleBroadcast} className="bg-blue-600 w-full">Broadcast to Team</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle>My Roster (March 2026)</CardTitle>
                      <CardDescription>Your fixed off days are Friday and Monday.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="text-[10px] font-bold text-slate-400 uppercase py-2">{day}</div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => {
                          const dayNum = i + 1;
                          const date = new Date(2026, 2, dayNum);
                          const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri
                          const isOff = dayOfWeek === 1 || dayOfWeek === 5;
                          
                          return (
                            <div 
                              key={i} 
                              className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${
                                isOff 
                                  ? 'bg-blue-50 border-blue-100 text-blue-700 font-bold' 
                                  : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-sm">{dayNum}</span>
                              {isOff && <span className="text-[8px] uppercase tracking-tighter">OFF</span>}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    {/* My Sent Requests */}
                    {myRequests.length > 0 && (
                      <Card className="border-none shadow-sm border-2 border-blue-100 bg-blue-50/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span>My Sent Requests</span>
                            <Badge className="bg-blue-600 animate-pulse">LIVE</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {myRequests.map(req => (
                            <div key={req.id} className="p-3 bg-white rounded-xl border border-blue-100 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs font-bold text-slate-900">Swapping {req.offDayToSwap}</p>
                                  <p className="text-[10px] text-slate-500">For: {req.targetDate}</p>
                                </div>
                                <Badge variant={req.status === 'Cancelled' ? 'destructive' : 'outline'} className="text-[8px]">
                                  {req.status}
                                </Badge>
                              </div>
                              {req.status === 'Broadcasting' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="w-full h-7 text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold"
                                  onClick={() => handleCancelRequest(req.id)}
                                >
                                  Cancel Broadcast
                                </Button>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm">Incoming Requests</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {incomingRequests.length === 0 ? (
                          <div className="py-8 text-center">
                            <p className="text-xs text-slate-400 italic">No new requests</p>
                          </div>
                        ) : (
                          incomingRequests.map((req) => (
                            <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.name}`} />
                                  <AvatarFallback>{req.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{req.name}</p>
                                  <p className="text-[10px] text-slate-500">Wants to exchange {req.day}</p>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-600 italic">"{req.message}"</p>
                              <div className="flex gap-2">
                                {req.status === 'accepted' ? (
                                  <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-100 py-1">
                                    ACCEPTED
                                  </Badge>
                                ) : (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="flex-1 bg-blue-600 text-[10px] h-7"
                                      onClick={() => handleAcceptIncoming(req.id)}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1 text-[10px] h-7"
                                      onClick={() => handleDeclineIncoming(req.id)}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-blue-600 text-white">
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-2">Need a swap?</h3>
                        <p className="text-xs text-blue-100 mb-4 leading-relaxed">Broadcast your off-day exchange request to all 500+ team members and get instant notifications.</p>
                        <Button 
                          className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold"
                          onClick={() => setIsBroadcastOpen(true)}
                        >
                          Broadcast Request
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Performance Section */}
            {activeTab === 'performance' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-slate-900">Performance & Growth</h1>
                  <Badge className="bg-blue-600 px-4 py-1">Cycle: 2026-27</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="text-blue-600" size={20} />
                        <span>Key Performance Indicators (KPIs)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-700">Project Delivery (API Integration)</span>
                          <span className="text-blue-600 font-bold">85%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[85%]"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-700">Code Quality & Review</span>
                          <span className="text-green-600 font-bold">92%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-green-600 h-full w-[92%]"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-700">System Architecture Design</span>
                          <span className="text-orange-600 font-bold">70%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-600 h-full w-[70%]"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="text-green-600" size={20} />
                        <span>Growth Path</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold text-green-800 uppercase">Current Role</p>
                          <Badge className="bg-green-600 text-[8px] h-4">CONFIRMED</Badge>
                        </div>
                        <p className="font-black text-green-900">Senior Software Developer</p>
                        <p className="text-[10px] text-green-700 mt-1 font-medium">Probation ended: 15 Mar 2026</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Next Milestone</p>
                        <p className="font-black text-slate-900">Technical Lead</p>
                        <p className="text-[10px] text-slate-500 mt-2">Target: Q1 2027</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Manager's Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-blue-900 text-sm">
                      "Krishna has shown exceptional technical depth since joining in February. His contribution to the payroll API integration project has been vital. Looking forward to seeing him take more ownership of the system architecture in the coming months."
                      <p className="not-italic font-bold mt-4 text-xs text-blue-600">— Rajesh Kumar, Senior Manager</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm lg:col-span-1">
                    <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                      <Avatar className="w-32 h-32 border-4 border-blue-50 mb-4">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>KS</AvatarFallback>
                      </Avatar>
                      <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                      <p className="text-blue-600 font-medium">{currentUser.role}</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">Employee ID: {currentUser.id}</Badge>
                      
                      <Separator className="my-6 w-full" />
                      
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Department</span>
                          <span className="font-bold text-slate-900">{currentUser.department}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Joining Date</span>
                          <span className="font-bold text-slate-900">{currentUser.joiningDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Office Location</span>
                          <span className="font-bold text-slate-900">Gurgaon, Sector 18</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <Label className="text-slate-400 text-[10px] uppercase font-bold">Official Email</Label>
                          <p className="text-slate-900 font-medium">{currentUser.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-400 text-[10px] uppercase font-bold">Reporting Manager</Label>
                          <p className="text-slate-900 font-medium">Rajesh Kumar (Senior Manager)</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-400 text-[10px] uppercase font-bold">Employment Type</Label>
                          <p className="text-slate-900 font-medium">Full-Time (Permanent)</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-slate-400 text-[10px] uppercase font-bold">Work Location</Label>
                          <p className="text-slate-900 font-medium">Hybrid (Gurgaon Office / WFH)</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Bank & Payroll Information</h3>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500">Salary Status</span>
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">On Hold (Processing)</Badge>
                          </div>
                          <p className="text-xs text-slate-500">Next expected credit: 31st March - 10th April (Combined Feb/March)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </button>
  );
}
