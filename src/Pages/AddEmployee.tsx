import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SheetFooter } from '../components/ui/sheet';
import * as z from "zod";
import { createEmployee, deleteEmployees, editEmployees, type CreateEmployeePayload, type EditEmployeePayload } from '../Services/AdminService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useGetDepartments, useGetDesignations, useGetEmployees } from '../Queries/useEmployeeTypes';
import EmployeeTable from './EmployeeTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be less than 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: passwordSchema,
  department: z.number().min(1, "Department is required"),
  designation: z.number().min(1, "Designation is required"),
})

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  department: z.number().min(1, "Department is required"),
  designation: z.number().min(1, "Designation is required"),
});

function AddEmployee() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [openSheet, setOpenSheet] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: 0,
    designation: 0,
  })
  const [edit, setEdit] = useState(false)
  const [editedEmployeeId, setEditedEmployeeId] = useState<string>("")
  const [page, setPage] = useState(1)
  const limit = 10
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mutation = useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: (response) => {
      toast.success("Registered successfully");
      queryClient.invalidateQueries({ queryKey: ["getEmployees"] });
      console.log(response?.data);
      setOpenSheet(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        department: 0,
        designation: 0,
      });
      setErrors({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Sign up failed");
    },
  });
  const { data, isPending, isError } = useGetEmployees(page, limit)
  const { data: departments, isPending: departmentsPending } = useGetDepartments()
  const { data: designations, isPending: designationsPending } = useGetDesignations()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployees(id),
    onSuccess: () => {
      toast.success("Employee deleted");
      queryClient.invalidateQueries({ queryKey: ["getEmployees"] });
    },
    onError: () => {
      toast.error("Failed to delete employee");
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: {id: string; payload: EditEmployeePayload}) => editEmployees({id, payload}),
    onSuccess: () => {
      toast.success("Employee edited");
      queryClient.invalidateQueries({ queryKey: ["getEmployees"] });
      setOpenSheet(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        department: 0,
        designation: 0,
      });
      setErrors({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
      });
      setEdit(false)
      setEditedEmployeeId("")
    },
    onError: () => {
      toast.error("Failed to edit employee");
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleClose = () => {
    setEdit(false)
    setEditedEmployeeId("")
    setOpenSheet(false)
    setFormData({
      name: "",
      email: "",
      password: "",
      department: 0,
      designation: 0,
    });
    setErrors({})
  }

  const handleSubmit = () => {
    try { 
      if(edit) {
        editSchema.parse(formData);
      } else {
        schema.parse(formData);
      }
      if(edit) {
        editMutation.mutate({
          id: editedEmployeeId,
          payload: {
            name: formData.name,
            email: formData.email,
            department: formData.department,
            designation: formData.designation,
          },
        }); 
      } else {
        mutation.mutate({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          designation: formData.designation,
        });
      }
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (id: string) => {
    setEdit(true)
    const editedEmployee = data?.data?.data.find((emp: any) => emp._id === id)
    setFormData({
      name: editedEmployee.name,
      email: editedEmployee.email,
      password: "",
      department: editedEmployee.department,
      designation: editedEmployee.designation,
    });
    setEditedEmployeeId(id)
    setOpenSheet(true)
  }

  const handleDropdown = (value: number, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-[100px] p-8 flex justify-between items-center">
        <p className="text-2xl font-bold text-black">Employees List</p>
        <button
          className="px-4 py-2 font-bold text-white rounded-md bg-[#7251b5] cursor-pointer"
          onClick={() => setOpenSheet(true)}
        >
          Add Employee
        </button>
      </div>
      {isPending ? (
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <ClipLoader />
          <p>Fetching table data</p>
        </div>
      ) : data?.data?.data.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <p>No employees yet. Add one</p>
        </div>
      ) : (
        <div className="flex-1 px-4">
          <EmployeeTable
            data={data?.data?.data}
            page={page}
            setPage={setPage}
            totalPages={data?.data?.totalPages}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            departments={departments?.data?.data ?? []}
            designations={designations?.data?.data ?? []}
          />
        </div>
      )}

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="bg-[#362f44]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-white">
              Add Employee
            </SheetTitle>
            <SheetDescription className="flex flex-col gap-4 pt-16 text-white">
              <label>Name</label>
              <div className="w-full">
                <input
                  name="name"
                  className="border border-gray-400 p-2 rounded-md w-full"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="my-1 text-red-400">{errors.name}</p>
                )}
              </div>
              <label>Email</label>
              <div className="w-full">
                <input
                  name="email"
                  className="border border-gray-400 p-2 rounded-md w-full"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="my-1 text-red-400">{errors.email}</p>
                )}
              </div>
              {!edit && (
                <>
                  <label>Password</label>
                  <div className="w-full">
                    <input
                      name="password"
                      className="border border-gray-400 p-2 rounded-md w-full"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <p className="my-1 text-red-400">{errors.password}</p>
                    )}
                  </div>
                </>
              )}
              <label>Department</label>
              <Select
                onValueChange={(value: number) =>
                  handleDropdown(value, "department")
                }
                value={formData.department || ""}
              >
                <SelectTrigger className="border border-gray-400 p-2 rounded-md w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsPending ? (
                    <SelectItem className="flex justify-center items-center">
                      <ClipLoader size={22} />
                    </SelectItem>
                  ) : (
                    departments?.data?.data.map((dep: any) => (
                      <SelectItem value={dep.id}>{dep.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="my-1 text-red-400">{errors.department}</p>
              )}
              <label>Designation</label>
              <Select
                onValueChange={(value: number) =>
                  handleDropdown(value, "designation")
                }
                value={formData.designation || ""}
              >
                <SelectTrigger className="border border-gray-400 p-2 rounded-md w-full">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designationsPending ? (
                    <SelectItem className="flex justify-center items-center">
                      <ClipLoader size={22} />
                    </SelectItem>
                  ) : (
                    designations?.data?.data.map((des: any) => (
                      <SelectItem value={des.id}>{des.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.designation && (
                <p className="my-1 text-red-400">{errors.designation}</p>
              )}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <div className="w-full flex justify-evenly items-center">
              <button
                className="border border-white bg-transparent h-10 w-36 rounded-md text-white font-bold"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="bg-[#7251b5] px-4 py-2 h-10 w-36 rounded-md text-white font-bold cursor-pointer"
                onClick={handleSubmit}
              >
                {mutation.isPending || editMutation.isPending ? (
                  <ClipLoader size={12} color="white" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AddEmployee