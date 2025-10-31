import axios from "axios";

export interface ClockInPayload {
  employeeId: string;
}

export interface ClockInResponse {
  employee: string;
  clockIn: Date;
}

export interface ClockOutResponse {
  employee: string;
  date: Date;
}

export interface UpdateStatusPayload {
  status: string;
}

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

export const getProfileDetails = async(id: string) => {
  return await api.get(`${baseUrl}/api/employee/profile/${id}`)
}

export const clockIn = async(payload: ClockInPayload) => {
  return await api.post<ClockInResponse>(`${baseUrl}/api/employee/attendance/clock-in`, payload);
}

export const clockOut = async(payload: ClockInPayload) => {
  return await api.post<ClockOutResponse>(`${baseUrl}/api/employee/attendance/clock-out`, payload);
}

export const getEmployeeTasks = async (id: string) => {
  return await api.get(`/api/employee/my-tasks/${id}`);
};

export const updateTaskStatus = async ({id, payload}: { id: string, payload: UpdateStatusPayload }) => {
  return await api.patch(`/api/employee/my-tasks/${id}`, payload);
}