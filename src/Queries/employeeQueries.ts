import { useQuery } from "@tanstack/react-query";
import { clockIn, clockOut, getEmployeeTasks, getProfileDetails, updateTaskStatus, type UpdateStatusPayload } from "../Services/EmployeeService";
import { useMutation } from "@tanstack/react-query";

export const useGetProfileDetails = (id: string) => {
  return useQuery({
    queryKey: ["getProfileDetails"],
    queryFn: () => getProfileDetails(id)
  })
}

export const useClockIn = () => {
  return useMutation({ mutationFn: clockIn })
}

export const useClockOut = () => {
  return useMutation({ mutationFn: clockOut })
}

export const useGetEmployeeTasks = (id: string) => {
  return useQuery({
    queryKey: ["getEmployeeTasks"],
    queryFn: () => getEmployeeTasks(id),
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({ mutationFn: ({id, payload}: {id: string, payload: UpdateStatusPayload}) => updateTaskStatus({id, payload}) })
}; 