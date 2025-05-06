"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileEdit, Search, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { generatePDF } from "@/lib/pdf-generator"

interface StaffListProps {
  searchQuery?: string;
  filterRole?: string;
}

export function StaffList({ searchQuery = "", filterRole = "all" }: StaffListProps) {
  const [staffMembers, setStaffMembers] = useState([
    {
      id: "31",
      name: "Abdul Sattar",
      fatherName: "Muhammad Akram",
      designation: "Staff",
      gender: "Male",
      phone: "03090909286",
      salary: "₹11,000",
      status: "Active",
    },
    {
      id: "32",
      name: "Fatima Zahra",
      fatherName: "Ali Hassan",
      designation: "Teacher",
      gender: "Female",
      phone: "03001234567",
      salary: "₹25,000",
      status: "Active",
    },
    {
      id: "33",
      name: "Muhammad Ali",
      fatherName: "Ahmed Khan",
      designation: "Admin",
      gender: "Male",
      phone: "03331234567",
      salary: "₹35,000",
      status: "Active",
    },
    {
      id: "34",
      name: "Ayesha Bibi",
      fatherName: "Imran Ahmed",
      designation: "Teacher",
      gender: "Female",
      phone: "03211234567",
      salary: "₹28,000",
      status: "Active",
    },
    {
      id: "35",
      name: "Zainab Khan",
      fatherName: "Khalid Khan",
      designation: "Teacher",
      gender: "Female",
      phone: "03451234567",
      salary: "₹27,000",
      status: "Inactive",
    },
  ])

  const [viewStaff, setViewStaff] = useState<any>(null)
  const [editStaff, setEditStaff] = useState<any>(null)
  const [deleteStaff, setDeleteStaff] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [designationFilter, setDesignationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")

  // Update the searchTerm when searchQuery prop changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Update the designationFilter when filterRole prop changes
  useEffect(() => {
    setDesignationFilter(filterRole);
  }, [filterRole]);

  const handleView = (staff: any) => {
    setViewStaff(staff)
  }

  const handleEdit = (staff: any) => {
    setEditStaff({ ...staff })
  }

  const handleDelete = (staff: any) => {
    setDeleteStaff(staff)
  }

  const handleSaveEdit = () => {
    if (editStaff) {
      setStaffMembers(staffMembers.map((s) => (s.id === editStaff.id ? editStaff : s)))
      setEditStaff(null)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteStaff) {
      setStaffMembers(staffMembers.filter((s) => s.id !== deleteStaff.id))
      setDeleteStaff(null)
    }
  }

  const handleGenerateStaffList = () => {
    generatePDF({
      title: "Staff List",
      data: filteredStaff,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Father's Name", key: "fatherName" },
        { header: "Designation", key: "designation" },
        { header: "Gender", key: "gender" },
        { header: "Phone", key: "phone" },
        { header: "Salary", key: "salary" },
        { header: "Status", key: "status" },
      ],
    })
  }

  // Filter staff based on search term, designation, and status
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      designationFilter === "all" || staff.designation.toLowerCase() === designationFilter.toLowerCase()

    const matchesStatus = statusFilter === "all" || staff.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesDesignation && matchesStatus
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateStaffList}>Generate PDF</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father's Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.id}</TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.fatherName}</TableCell>
                  <TableCell>{staff.designation}</TableCell>
                  <TableCell>{staff.gender}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.salary}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        staff.status === "Active"
                          ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(staff)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(staff)}>
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(staff)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* View Staff Dialog */}
      <Dialog open={!!viewStaff} onOpenChange={() => setViewStaff(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>Detailed information about the staff member.</DialogDescription>
          </DialogHeader>
          {viewStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Staff ID</Label>
                  <div className="font-medium">{viewStaff.id}</div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div className="font-medium">{viewStaff.name}</div>
                </div>
                <div>
                  <Label>Father's Name</Label>
                  <div className="font-medium">{viewStaff.fatherName}</div>
                </div>
                <div>
                  <Label>Designation</Label>
                  <div className="font-medium">{viewStaff.designation}</div>
                </div>
                <div>
                  <Label>Gender</Label>
                  <div className="font-medium">{viewStaff.gender}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="font-medium">{viewStaff.phone}</div>
                </div>
                <div>
                  <Label>Salary</Label>
                  <div className="font-medium">{viewStaff.salary}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      viewStaff.status === "Active"
                        ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }
                  >
                    {viewStaff.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewStaff(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={!!editStaff} onOpenChange={() => setEditStaff(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>Update staff information.</DialogDescription>
          </DialogHeader>
          {editStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editStaff.name}
                    onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-father">Father's Name</Label>
                  <Input
                    id="edit-father"
                    value={editStaff.fatherName}
                    onChange={(e) => setEditStaff({ ...editStaff, fatherName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-designation">Designation</Label>
                  <Select
                    value={editStaff.designation}
                    onValueChange={(value) => setEditStaff({ ...editStaff, designation: value })}
                  >
                    <SelectTrigger id="edit-designation">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={editStaff.gender}
                    onValueChange={(value) => setEditStaff({ ...editStaff, gender: value })}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editStaff.phone}
                    onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input
                    id="edit-salary"
                    value={editStaff.salary}
                    onChange={(e) => setEditStaff({ ...editStaff, salary: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editStaff.status}
                    onValueChange={(value) => setEditStaff({ ...editStaff, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStaff(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Dialog */}
      <AlertDialog open={!!deleteStaff} onOpenChange={() => setDeleteStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              {deleteStaff && ` ${deleteStaff.name}`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
