import { useQuery } from "@tanstack/react-query";
import { getDepartments, getDesignations, getEmployees, getEmployeesForShift, getShifts } from "../Services/AdminService";

export const useGetEmployees = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["getEmployees", page, limit],
    queryFn: () => getEmployees(page, limit),
  });
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["getDepartments"],
    queryFn: getDepartments,
  });
};

export const useGetDesignations = () => {
  return useQuery({
    queryKey: ["getDesignations"],
    queryFn: getDesignations,
  });
};

export const useGetEmployeesForShift = () => {
  return useQuery({
    queryKey: ["getEmployeesForShift"],
    queryFn: getEmployeesForShift,
  });
};

export const useGetShifts = () => {
  return useQuery({
    queryKey: ["getShifts"],
    queryFn: getShifts,
  });
};