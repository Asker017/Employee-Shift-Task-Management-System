import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  department: number;
  designation: number;
}

export interface EditEmployeePayload {
  name: string;
  email: string;
  department: number;
  designation: number;
}

export interface CreateEmployeeResponse {
  _id: number;
  name: string;
  email: string;
  role: number;
}

export interface ShiftAssignmentPayload {
  employee: string;
  shift: number;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assignedTo: string;
}

export const createEmployee = async (payload: CreateEmployeePayload) => {
  return await api.post<CreateEmployeeResponse>(
    `${baseUrl}/api/add-employee`,
    payload
  );
};

export const getEmployees = async(page: number, limit: number) => {
  return await api.get(`${baseUrl}/api/employees-list?page=${page}&limit=${limit}`);
}

export const deleteEmployees = async(id: string) => {
  return await api.delete(`${baseUrl}/api/employees/${id}`)
}

export const editEmployees = async({ id, payload}: {id: string; payload: EditEmployeePayload }) => {
  return await api.put(`${baseUrl}/api/employees/${id}`, payload)
}

export const getDepartments = async() => {
  return await api.get(`${baseUrl}/api/departments`)
}

export const getDesignations = async() => {
  return await api.get(`${baseUrl}/api/designations`)
}

export const getEmployeesForShift = async() => {
  return await api.get(`${baseUrl}/api/employeesForShift`);
}

export const getShifts = async() => {
  return await api.get(`${baseUrl}/api/shifts`)
}

export const assignShift = async (payload: ShiftAssignmentPayload) => {
  return await api.post<ShiftAssignmentPayload>(
    `${baseUrl}/api/assign-shift`,
    payload
  );
};

export const getEmployeesWithShifts = async(page: number, limit: number) => {
  return await api.get(`${baseUrl}/api/employees-with-shifts?page=${page}&limit=${limit}`);
}

export const editEmployeeShift = async({ id, payload}: {id: string; payload: ShiftAssignmentPayload }) => {
  return await api.put(`${baseUrl}/api/employees-shift/${id}`, payload);
}

export const deleteShift = async (id: string) => {
  return await api.delete(`${baseUrl}/api/employees-shift/${id}`);
};

export const getDataCounts = async () => {
  return await api.get(
    `${baseUrl}/api/employees-stats`
  );
};

export const createTask = async (payload: CreateTaskPayload) => {
  return await api.post("/api/create-task", payload)
}

export const getAllTasks = async () => {
  return await api.get("/api/all-tasks");
};

export const deleteTask = async (id: string) => {
  return await api.delete(`/api/all-tasks/${id}`)
}

export const getRecentEmployees = async () => {
  return await api.get("/api/recent-employees")
}