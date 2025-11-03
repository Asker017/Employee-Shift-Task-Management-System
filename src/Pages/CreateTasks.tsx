import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useGetEmployeesForShift } from "../Queries/useEmployeeTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { useCreateTask, useDeleteTask } from "../Queries/adminQueries";
import toast from "react-hot-toast";
import z from "zod";
import { useGetAllTasks } from "../Queries/adminQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  assignedTo: z.string().min(1, "Please assign an employee")
})

function CreateTasks() {
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: employeesList, isPending: employeesPending } = useGetEmployeesForShift()
  const { mutate: createTaskMutate, isPending: createTaskPending } = useCreateTask();
  const { data: allTasksData, isPending: allTasksPending } = useGetAllTasks();
  const { mutate: deleteTaskMutate } = useDeleteTask()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target; 
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const allTasks = allTasksData?.data?.data || []
  const pendingTasks = allTasks.filter((task: any) => task.status === "Pending")
  const inProgressTasks = allTasks.filter((task: any) => task.status === "In Progress")
  const completedTasks = allTasks.filter((task: any) => task.status === "Completed")

  const handleDropdown = (value: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
    });
    setErrors({})
    setOpenDialog(false)
  }

  const handleSubmit = () => {
    try {
      schema.parse(formData)
      createTaskMutate(formData, {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["getAllTasks"] })
        toast.success("Task created successfully")
        handleClose()
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      },
    });
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

  const handleDeleteTask = (id: string) => {
    deleteTaskMutate(id, {
      onSuccess: (data: any) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["getAllTasks"] });
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[100px] p-8 flex justify-between items-center">
        <p className="text-2xl font-bold text-black">
          Employee Tasks Assignment
        </p>
        <button
          className="px-4 py-2 font-bold text-white rounded-md bg-[#7251b5] cursor-pointer"
          onClick={() => setOpenDialog(true)}
        >
          Create Task
        </button>
      </div>

      {allTasksPending ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader size={22} color="black" />
        </div>
      ) : (
        <div className="flex justify-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg px-2">Pending</p>
            <div className="w-[350px] h-[550px] p-2 flex flex-col overflow-auto gap-4 no-scrollbar">
              {pendingTasks?.length > 0 ? (
                pendingTasks.map((task: any, index: number) => (
                  <div
                    className="w-full shrink-0 rounded-sm shadow-[0_5px_5px_rgba(0,0,0,0.25)] flex flex-col gap-2 p-4"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <p className="font-semibold">
                        Title:{" "}
                        <span className="text-gray-400">{task?.title}</span>
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis color="black" className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="font-semibold">
                      Description:{" "}
                      <span className="text-gray-400">
                        {task?.description || "-"}
                      </span>
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        Assigned to:{" "}
                        <span className="text-gray-400">
                          {task?.assignedTo?.name}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex justify-center items-center">
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg px-2">In Progress</p>
            <div className="w-[350px] h-[550px] p-2  flex flex-col overflow-auto gap-4 no-scrollbar">
              {inProgressTasks?.length > 0 ? (
                inProgressTasks.map((task: any, index: number) => (
                  <div
                    className="w-full shrink-0 rounded-sm shadow-[0_5px_5px_rgba(0,0,0,0.25)] flex flex-col gap-2 p-4"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <p className="font-semibold">
                        Title:{" "}
                        <span className="text-gray-400">{task?.title}</span>
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis color="black" className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="font-semibold">
                      Description:{" "}
                      <span className="text-gray-400">
                        {task?.description || "-"}
                      </span>
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        Assigned to:{" "}
                        <span className="text-gray-400">
                          {task?.assignedTo?.name}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex justify-center items-center">
                  <p>No in progress tasks</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg py-2">Closed</p>
            <div className="w-[350px] h-[550px] p-2  flex flex-col overflow-auto gap-4 no-scrollbar">
              {completedTasks?.length > 0 ? (
                completedTasks.map((task: any, index: number) => (
                  <div
                    className="w-full shrink-0 rounded-sm shadow-[0_5px_5px_rgba(0,0,0,0.25)] flex flex-col gap-2 p-4"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <p className="font-semibold">
                        Title:{" "}
                        <span className="text-gray-400">{task?.title}</span>
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis color="black" className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="font-semibold">
                      Description:{" "}
                      <span className="text-gray-400">
                        {task?.description || "-"}
                      </span>
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        Assigned to:{" "}
                        <span className="text-gray-400">
                          {task?.assignedTo?.name}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex justify-center items-center">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#362f44] text-white">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Title</label>
            <div>
              <input
                name="title"
                className="border border-gray-500 rounded-sm w-full p-2 placeholder:text-gray-400"
                placeholder="Enter a title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="my-1 text-red-400">{errors.title}</p>
              )}
            </div>
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              className="border border-gray-500 rounded-sm w-full h-[100px] p-2 placeholder:text-gray-400"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <label className="font-semibold">Assign to</label>
            <div>
              <Select
                onValueChange={(value: string) =>
                  handleDropdown(value, "assignedTo")
                }
                value={formData.assignedTo || undefined}
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
                      employeesList?.data?.data.map(
                        (emp: any, index: number) => (
                          <SelectItem key={index} value={emp?._id}>
                            {emp?.name}
                          </SelectItem>
                        )
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="my-1 text-red-400">{errors.assignedTo}</p>
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
              onClick={handleSubmit}
            >
              {createTaskPending ? (
                <ClipLoader color="white" size={20} />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTasks;
