"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Printer, 
  Eye, 
  Trash2,
  DollarSign,
  FileText,
  AlertCircle,
  Users,
  Calendar,
  TrendingUp,
  CreditCard
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  joinDate: Date;
  status: "active" | "inactive";
}

interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: Date;
  paymentMethod: string;
  status: "pending" | "paid" | "cancelled";
  remarks?: string;
}

const departments = [
  "Administration",
  "Teaching",
  "IT",
  "Finance",
  "Human Resources",
  "Maintenance",
  "Security",
  "Other"
];

const positions = [
  "Principal",
  "Vice Principal",
  "Teacher",
  "Administrative Officer",
  "Accountant",
  "IT Support",
  "Maintenance Staff",
  "Security Guard",
  "Other"
];

const paymentMethods = [
  "Bank Transfer",
  "Cash",
  "Check",
  "Online Payment"
];

export function StaffPayrollManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isProcessPayrollDialogOpen, setIsProcessPayrollDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [staffFormData, setStaffFormData] = useState({
    name: "",
    position: "",
    department: "",
    basicSalary: "",
    allowances: "",
    deductions: ""
  });

  const [payrollFormData, setPayrollFormData] = useState({
    staffId: "",
    month: "",
    year: new Date().getFullYear().toString(),
    allowances: "",
    deductions: "",
    paymentMethod: "",
    remarks: ""
  });

  // Load sample data
  useEffect(() => {
    const sampleStaff: StaffMember[] = [
      {
        id: "STAFF-001",
        name: "John Smith",
        position: "Principal",
        department: "Administration",
        basicSalary: 45000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 48000,
        joinDate: new Date("2020-01-15"),
        status: "active"
      },
      {
        id: "STAFF-002",
        name: "Sarah Johnson",
        position: "Teacher",
        department: "Teaching",
        basicSalary: 35000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 36500,
        joinDate: new Date("2021-03-20"),
        status: "active"
      },
      {
        id: "STAFF-003",
        name: "Mike Wilson",
        position: "IT Support",
        department: "IT",
        basicSalary: 30000,
        allowances: 2000,
        deductions: 1200,
        netSalary: 30800,
        joinDate: new Date("2022-06-10"),
        status: "active"
      }
    ];

    const samplePayroll: PayrollRecord[] = [
      {
        id: "PAY-2024-001",
        staffId: "STAFF-001",
        staffName: "John Smith",
        month: "January",
        year: 2024,
        basicSalary: 45000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 48000,
        paymentDate: new Date("2024-01-31"),
        paymentMethod: "Bank Transfer",
        status: "paid"
      },
      {
        id: "PAY-2024-002",
        staffId: "STAFF-002",
        staffName: "Sarah Johnson",
        month: "January",
        year: 2024,
        basicSalary: 35000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 36500,
        paymentDate: new Date("2024-01-31"),
        paymentMethod: "Bank Transfer",
        status: "paid"
      },
      {
        id: "PAY-2024-003",
        staffId: "STAFF-003",
        staffName: "Mike Wilson",
        month: "January",
        year: 2024,
        basicSalary: 30000,
        allowances: 2000,
        deductions: 1200,
        netSalary: 30800,
        paymentDate: new Date("2024-01-31"),
        paymentMethod: "Bank Transfer",
        status: "paid"
      }
    ];

    setStaff(sampleStaff);
    setPayrollRecords(samplePayroll);
  }, []);

  const handleAddStaff = () => {
    if (!staffFormData.name || !staffFormData.position || !staffFormData.basicSalary) {
      alert("Please fill in all required fields");
      return;
    }

    const basicSalary = parseFloat(staffFormData.basicSalary);
    const allowances = parseFloat(staffFormData.allowances) || 0;
    const deductions = parseFloat(staffFormData.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;

    const newStaff: StaffMember = {
      id: `STAFF-${String(staff.length + 1).padStart(3, "0")}`,
      name: staffFormData.name,
      position: staffFormData.position,
      department: staffFormData.department,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      joinDate: new Date(),
      status: "active"
    };

    setStaff([...staff, newStaff]);
    setStaffFormData({
      name: "",
      position: "",
      department: "",
      basicSalary: "",
      allowances: "",
      deductions: ""
    });
    setIsAddStaffDialogOpen(false);
  };

  const handleProcessPayroll = () => {
    if (!payrollFormData.staffId || !payrollFormData.month) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedStaff = staff.find(s => s.id === payrollFormData.staffId);
    if (!selectedStaff) {
      alert("Staff member not found");
      return;
    }

    const allowances = parseFloat(payrollFormData.allowances) || selectedStaff.allowances;
    const deductions = parseFloat(payrollFormData.deductions) || selectedStaff.deductions;
    const netSalary = selectedStaff.basicSalary + allowances - deductions;

    const newPayroll: PayrollRecord = {
      id: `PAY-${payrollFormData.year}-${String(payrollRecords.length + 1).padStart(3, "0")}`,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      month: payrollFormData.month,
      year: parseInt(payrollFormData.year),
      basicSalary: selectedStaff.basicSalary,
      allowances,
      deductions,
      netSalary,
      paymentDate: new Date(),
      paymentMethod: payrollFormData.paymentMethod,
      status: "paid",
      remarks: payrollFormData.remarks
    };

    setPayrollRecords([newPayroll, ...payrollRecords]);
    setPayrollFormData({
      staffId: "",
      month: "",
      year: new Date().getFullYear().toString(),
      allowances: "",
      deductions: "",
      paymentMethod: "",
      remarks: ""
    });
    setIsProcessPayrollDialogOpen(false);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this payroll record?")) {
      setPayrollRecords(payrollRecords.filter(record => record.id !== id));
    }
  };

  const filteredRecords = payrollRecords.filter(record => {
    return record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.month.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const pendingPayments = payrollRecords.filter(record => record.status === "pending");
  const paidPayments = payrollRecords.filter(record => record.status === "paid");

  const printPayslip = (record: PayrollRecord) => {
    const payslipContent = `
      PAYSLIP
      =======
      
      Payslip ID: ${record.id}
      Month: ${record.month} ${record.year}
      Payment Date: ${record.paymentDate.toLocaleDateString()}
      
      Employee Details:
      Name: ${record.staffName}
      ID: ${record.staffId}
      
      Salary Breakdown:
      Basic Salary: Rs.${record.basicSalary.toLocaleString()}
      Allowances: Rs.${record.allowances.toLocaleString()}
      Deductions: Rs.${record.deductions.toLocaleString()}
      
      Net Salary: Rs.${record.netSalary.toLocaleString()}
      
      Payment Method: ${record.paymentMethod}
      Status: ${record.status.toUpperCase()}
      
      ${record.remarks ? `Remarks: ${record.remarks}` : ''}
      
      =======
      School Management System
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payslip - ${record.id}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${payslipContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Payroll Management</h2>
          <p className="text-muted-foreground">
            Manage staff salaries, process payments, and track payroll history
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="staff-name">Staff Name *</Label>
                  <Input
                    id="staff-name"
                    value={staffFormData.name}
                    onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                    placeholder="Enter staff name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Select value={staffFormData.position} onValueChange={(value) => setStaffFormData({ ...staffFormData, position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>{position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={staffFormData.department} onValueChange={(value) => setStaffFormData({ ...staffFormData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="basic-salary">Basic Salary (Rs.) *</Label>
                    <Input
                      id="basic-salary"
                      type="number"
                      value={staffFormData.basicSalary}
                      onChange={(e) => setStaffFormData({ ...staffFormData, basicSalary: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowances">Allowances (Rs.)</Label>
                    <Input
                      id="allowances"
                      type="number"
                      value={staffFormData.allowances}
                      onChange={(e) => setStaffFormData({ ...staffFormData, allowances: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deductions">Deductions (Rs.)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={staffFormData.deductions}
                      onChange={(e) => setStaffFormData({ ...staffFormData, deductions: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff}>Add Staff</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isProcessPayrollDialogOpen} onOpenChange={setIsProcessPayrollDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Process Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Process Payroll Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="staff-select">Select Staff *</Label>
                  <Select value={payrollFormData.staffId} onValueChange={(value) => setPayrollFormData({ ...payrollFormData, staffId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((staffMember) => (
                        <SelectItem key={staffMember.id} value={staffMember.id}>
                          {staffMember.name} - {staffMember.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="month">Month *</Label>
                    <Select value={payrollFormData.month} onValueChange={(value) => setPayrollFormData({ ...payrollFormData, month: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={payrollFormData.year}
                      onChange={(e) => setPayrollFormData({ ...payrollFormData, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payroll-allowances">Additional Allowances (Rs.)</Label>
                    <Input
                      id="payroll-allowances"
                      type="number"
                      value={payrollFormData.allowances}
                      onChange={(e) => setPayrollFormData({ ...payrollFormData, allowances: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payroll-deductions">Additional Deductions (Rs.)</Label>
                    <Input
                      id="payroll-deductions"
                      type="number"
                      value={payrollFormData.deductions}
                      onChange={(e) => setPayrollFormData({ ...payrollFormData, deductions: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={payrollFormData.paymentMethod} onValueChange={(value) => setPayrollFormData({ ...payrollFormData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={payrollFormData.remarks}
                    onChange={(e) => setPayrollFormData({ ...payrollFormData, remarks: e.target.value })}
                    placeholder="Enter any remarks"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsProcessPayrollDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProcessPayroll}>Process Payment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payrollRecords.length} payments processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.filter(s => s.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>View and manage all payroll payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payroll records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.staffName}</div>
                        <div className="text-sm text-muted-foreground">ID: {record.staffId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.month} {record.year}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">Rs.{record.netSalary.toLocaleString()}</TableCell>
                    <TableCell>{record.paymentDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "paid"
                            ? "default"
                            : record.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => printPayslip(record)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payroll ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.paymentDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Staff Name</Label>
                <p className="text-sm text-muted-foreground">{selectedRecord.staffName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Month/Year</Label>
                  <Badge variant="outline">{selectedRecord.month} {selectedRecord.year}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.paymentMethod}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Basic Salary</Label>
                  <p className="text-lg font-bold">Rs.{selectedRecord.basicSalary.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Allowances</Label>
                  <p className="text-lg font-bold text-green-600">+Rs.{selectedRecord.allowances.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Deductions</Label>
                  <p className="text-lg font-bold text-red-600">-Rs.{selectedRecord.deductions.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Net Salary</Label>
                <p className="text-2xl font-bold text-primary">Rs.{selectedRecord.netSalary.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge
                  variant={
                    selectedRecord.status === "paid"
                      ? "default"
                      : selectedRecord.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedRecord.status}
                </Badge>
              </div>
              {selectedRecord.remarks && (
                <div>
                  <Label className="text-sm font-medium">Remarks</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.remarks}</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => printPayslip(selectedRecord)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Payslip
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 