import { useMutation } from "@tanstack/react-query";
import { assignShift, createTask, deleteShift, deleteTask, getAllTasks, getDataCounts, getEmployeesWithShifts, getRecentEmployees } from "../Services/AdminService";
import { useQuery } from "@tanstack/react-query";

export const useAssignShift = () => {
  return useMutation({ mutationFn: assignShift });
};

export const useGetEmployeesWithShifts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["getEmployeesWithShifts", page, limit],
    queryFn: () => getEmployeesWithShifts(page, limit)
  })
};

export const useGetDataCounts = () => {
  return useQuery({
    queryKey: ["getDataCounts"],
    queryFn: getDataCounts
  })
}

export const useDeleteShift = () => {
  return useMutation({ mutationFn: deleteShift })
}

export const useCreateTask = () => {
  return useMutation({ mutationFn: createTask });
};

export const useGetAllTasks = () => {
  return useQuery({
    queryKey: ["getAllTasks"],
    queryFn: getAllTasks
  })
}

export const useDeleteTask = () => {
  return useMutation({ mutationFn: deleteTask })
}

export const useGetRecentEmployees = () => {
  return useQuery({
    queryKey: ["getRecentEmployees"],
    queryFn: getRecentEmployees
  })
}