import axios, { type AxiosResponse } from "axios";
import { API_URL } from "@/lib/config";
import type { ApiResponse } from "@/types/api";
import { toApiError } from "./errors";
import { tokenStorage } from "./token";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.delete("Authorization");
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isCancel(error)) throw error;
  throw toApiError(error);
});

export const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>) =>
  response.data.data;
