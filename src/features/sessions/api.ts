import { apiClient, unwrap } from "@/lib/api/client";
import type {
  ApiResponse,
  FilterOptions,
  SessionSort,
  SessionsPage,
  TimeBand,
} from "@/types/api";

export const fetchFilterOptions = (signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<FilterOptions>>("/filter-options", { signal })
    .then(unwrap);

export interface SessionsParams {
  date?: string;
  venues?: string[];
  formats?: string[];
  languages?: string[];
  bands?: TimeBand[];
  sort?: SessionSort;
  page?: number;
}

const omitEmpty = (params: SessionsParams) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined && !(Array.isArray(value) && value.length === 0),
    ),
  );

export const fetchSessions = (params: SessionsParams, signal?: AbortSignal) =>
  apiClient
    .get<SessionsPage>("/sessions", { params: omitEmpty(params), signal })
    .then((response) => response.data);
