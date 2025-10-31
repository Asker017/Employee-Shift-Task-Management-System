import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  role: number;
  token: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  _id: number;
  name: string;
  email: string;
  role: number;
}

export const login = async(payload: LoginPayload) => {
  return await axios.post<LoginResponse>(`${baseUrl}/api/auth/login`, payload);
}

export const signUp = async (payload: SignupPayload) => {
  return await axios.post<SignupResponse>(`${baseUrl}/api/auth/register`, payload);
};