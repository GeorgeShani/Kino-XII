import axios, { type AxiosResponse, isAxiosError } from "axios";
import { API_URL } from "@/lib/config";
import type { ApiResponse } from "@/types/api";
import { toApiError } from "./errors";
import { tokenStorage } from "./token";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRecovery?: boolean;
    authRetried?: boolean;
  }
}

type UnauthenticatedHandler = () => Promise<void>;

let unauthenticatedHandler: UnauthenticatedHandler | null = null;

export function setUnauthenticatedHandler(
  handler: UnauthenticatedHandler | null,
) {
  unauthenticatedHandler = handler;
}

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

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (axios.isCancel(error)) throw error;

  const apiError = toApiError(error);
  const config = isAxiosError(error) ? error.config : undefined;
  const handler = unauthenticatedHandler;

  const canRecover =
    apiError.kind === "unauthenticated" &&
    config &&
    handler &&
    !config.skipAuthRecovery &&
    !config.authRetried;

  if (!canRecover) throw apiError;

  try {
    await handler();
  } catch {
    throw apiError;
  }

  config.authRetried = true;
  return apiClient.request(config);
});

export const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>) =>
  response.data.data;
