import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useGetEmployeesForShift, useGetShifts } from "../Queries/useEmployeeTypes";
import { ClipLoader } from "react-spinners";
import { useAssignShift, useDeleteShift, useGetEmployeesWithShifts } from "../Queries/adminQueries";
import { editEmployeeShift, type ShiftAssignmentPayload } from "../Services/AdminService";
import toast from "react-hot-toast";
import ShiftTable from "./ShiftTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

const schema = z.object({
  employee: z.string().min(1, "Please select an employee"),
  shift: z.number().min(1, "Please select a shift")
});

function ShiftAssignment() {

  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ShiftAssignmentPayload>({
    employee: "",
    shift: 0
  })  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const limit = 10;
  const [edit, setEdit] = useState(false)
  const [editedEmployeeId, setEditedEmployeeId] = useState("")

  const [openDialog, setOpenDialog] = useState(false)
  const { data: employeesList, isPending: employeesPending } = useGetEmployeesForShift()
  const { data: shifts, isPending: shiftsPending } = useGetShifts()
  const { mutate: assignShiftMutate, isPending: assignShiftPending } = useAssignShift();
  const { data: employeesData, isPending: employeesDataPending } = useGetEmployeesWithShifts(page, limit)
  const { mutate: deleteShiftMutate, isPending: deleteShiftPending } = useDeleteShift()

  const editMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ShiftAssignmentPayload;
    }) => editEmployeeShift({ id, payload }),
    onSuccess: () => {
      setFormData({
        employee: "",
        shift: 0,
      });
      toast.success("Shift edited");
      queryClient.invalidateQueries({
        queryKey: ["getEmployeesWithShifts"],
      });
      setOpenDialog(false);
      setErrors({})
      setEdit(false);
      setEditedEmployeeId("");
    },
    onError: () => {
      toast.error("Failed to edit employee");
    },
  });

  const handleAssignShift = () => {
    try {
      schema.parse(formData)

      if(edit) {
        editMutation.mutate({
          id: editedEmployeeId,
          payload: formData
        })
      } else {
        assignShiftMutate(formData, {
          onSuccess: (data) => {
            console.log(data);
            toast.success("Shift assigned");
            setFormData({
              employee: "",
              shift: 0,
            });
            queryClient.invalidateQueries({
              queryKey: ["getEmployeesWithShifts"],
            });
            setOpenDialog(false);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
          },
        });
      }
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
  };

  const handleClose = () => {
    setFormData({
      employee: "",
      shift: 0
    })
    setErrors({})
    setOpenDialog(false)
  }

  const handleDropdown = (value: any, name: string) => {
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleEdit = (id: string) => {
    setEdit(true)
    const editedEmployee = employeesData?.data?.data.find((emp: any) => emp._id === id)
    setFormData((prev) => ({...prev, 
      employee: editedEmployee?.employeeId,
      shift: editedEmployee?.shift
    }))
    setEditedEmployeeId(id)
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    deleteShiftMutate(id, {
      onSuccess: (data) => {
        console.log(data)
        toast.success("Shift deleted successfully")
        queryClient.invalidateQueries({
          queryKey: ["getEmployeesWithShifts"],
        });
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong")
      }
    })
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="h-[100px] p-8 flex justify-between items-center">
        <p className="text-2xl font-bold text-black">
          Employee Shift Assignment
        </p>
        <button
          className="px-4 py-2 font-bold text-white rounded-md bg-[#7251b5] cursor-pointer"
          onClick={() => setOpenDialog(true)}
        >
          Assign Shift
        </button>
      </div>
      <div className="flex-1 px-4">
        <ShiftTable
          data={employeesData?.data?.data ?? []}
          shifts={shifts?.data?.data ?? []}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          page={page}
          setPage={setPage}
          totalPages={employeesData?.data?.totalPages}
        />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <form>
          <DialogContent className="sm:max-w-[425px] bg-[#362f44] text-white">
            <DialogHeader>
              <DialogTitle>Assign Shift</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Select
                  onValueChange={(value: string) =>
                    handleDropdown(value, "employee")
                  }
                  value={formData.employee || undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {employeesPending ? (
                        <div className="flex justify-center items-center">
                          <ClipLoader size={22} color="white" />
                        </div>
                      ) : (
                        employeesList?.data?.data.map((emp: any, index: number) => (
                          <SelectItem key={index} value={emp?._id}>{emp?.name}</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.employee && (
                  <p className="my-1 text-red-400">{errors.employee}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Shift</Label>
                <Select
                  onValueChange={(value: number) =>
                    handleDropdown(value, "shift")
                  }
                  value={formData.shift > 0 ? formData.shift : undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {shiftsPending ? (
                        <div className="flex justify-center items-center">
                          <ClipLoader size={22} color="white" />
                        </div>
                      ) : (
                        shifts?.data?.data.map((shift: any, index: number) => (
                          <SelectItem key={index} value={shift?.id}>
                            {shift?.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.shift && (
                  <p className="text-red-400">{errors.shift}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-transparent w-[80px]"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-[80px] bg-[#7251b5]"
                onClick={handleAssignShift}
              >
                {(assignShiftPending || editMutation.isPending) ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

export default ShiftAssignment;
