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
import { Plus, Search, Printer, Eye, Trash2, DollarSign, FileText, AlertCircle } from "lucide-react";

interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  purpose: string;
  type: string;
  date: Date;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedDate?: Date;
}

const expenseTypes = [
  "Office Supplies",
  "Equipment",
  "Utilities",
  "Maintenance",
  "Transportation",
  "Food & Catering",
  "Training",
  "Marketing",
  "Software",
  "Other",
];

export function ExpensesManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    purpose: "",
    type: "",
  });

  useEffect(() => {
    const sampleExpenses: Expense[] = [
      {
        id: "EXP-2024-001",
        name: "Office Stationery",
        description: "Purchase of pens, papers, and other office supplies",
        amount: 2500,
        purpose: "Daily office operations",
        type: "Office Supplies",
        date: new Date("2024-01-15"),
        status: "approved",
        approvedBy: "Admin User",
        approvedDate: new Date("2024-01-16"),
      },
      {
        id: "EXP-2024-002",
        name: "Computer Equipment",
        description: "New laptops for IT department",
        amount: 45000,
        purpose: "Upgrade IT infrastructure",
        type: "Equipment",
        date: new Date("2024-01-20"),
        status: "pending",
      },
    ];
    setExpenses(sampleExpenses);
  }, []);

  const handleAddExpense = () => {
    if (!formData.name || !formData.amount || !formData.type) {
      alert("Please fill in all required fields");
      return;
    }

    const newExpense: Expense = {
      id: `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, "0")}`,
      name: formData.name,
      description: formData.description,
      amount: parseFloat(formData.amount),
      purpose: formData.purpose,
      type: formData.type,
      date: new Date(),
      status: "pending",
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({ name: "", description: "", amount: "", purpose: "", type: "" });
    setIsAddDialogOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const handleApproveExpense = (id: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              status: "approved" as const,
              approvedBy: "Current User",
              approvedDate: new Date(),
            }
          : expense
      )
    );
  };

  const filteredExpenses = expenses.filter((expense) => {
    return (
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter((expense) => expense.status === "pending");
  const approvedExpenses = expenses.filter((expense) => expense.status === "approved");

  const printReceipt = (expense: Expense) => {
    const receiptContent = `
      EXPENSE RECEIPT
      ===============
      
      Receipt ID: ${expense.id}
      Date: ${expense.date.toLocaleDateString()}
      
      Item: ${expense.name}
      Description: ${expense.description}
      Amount: ₹${expense.amount.toLocaleString()}
      Purpose: ${expense.purpose}
      Type: ${expense.type}
      Status: ${expense.status.toUpperCase()}
      
      ${expense.approvedBy ? `Approved by: ${expense.approvedBy}` : ""}
      ${expense.approvedDate ? `Approved on: ${expense.approvedDate.toLocaleDateString()}` : ""}
      
      ===============
      School Management System
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Expense Receipt - ${expense.id}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
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
          <h2 className="text-2xl font-bold tracking-tight">Expenses Management</h2>
          <p className="text-muted-foreground">Track and manage all institutional expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Expense Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter expense name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter expense description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Enter purpose"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} expenses recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedExpenses.length}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month total</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>View and manage all expense records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.name}</div>
                        <div className="text-sm text-muted-foreground">{expense.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expense.status === "approved"
                            ? "default"
                            : expense.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => printReceipt(expense)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        {expense.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveExpense(expense.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
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
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Expense ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedExpense.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">{selectedExpense.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{selectedExpense.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedExpense.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-lg font-bold">₹{selectedExpense.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge variant="outline">{selectedExpense.type}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Purpose</Label>
                <p className="text-sm text-muted-foreground">{selectedExpense.purpose}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge
                  variant={
                    selectedExpense.status === "approved"
                      ? "default"
                      : selectedExpense.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedExpense.status}
                </Badge>
              </div>
              {selectedExpense.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Approved By</Label>
                    <p className="text-sm text-muted-foreground">{selectedExpense.approvedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Approved Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedExpense.approvedDate ? selectedExpense.approvedDate.toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => printReceipt(selectedExpense)}>
                  <Printer className="h-4 w-4 mr-2" /> Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 