import { getCsrfToken } from "./csrf";
import { HttpError } from "./errors";
import { clientEnv } from "@/lib/env/client";
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig extends AxiosRequestConfig {
  requiresCsrf?: boolean;
  skipAuth?: boolean; // do not attach Authorization
  skipRefresh?: boolean; // do not run 401 refresh logic
}

export interface HttpClientOptions {
  getAccessToken: () => string | null;
  onTokenExpired: () => Promise<string | null>;
}

export class HttpClient {
  private axios: AxiosInstance;
  private getAccessToken: () => string | null;
  private onTokenExpired: () => Promise<string | null>;

  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(options: HttpClientOptions) {
    this.getAccessToken = options.getAccessToken;
    this.onTokenExpired = options.onTokenExpired;

    this.axios = axios.create({
      baseURL: clientEnv.apiBaseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private refreshToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) return this.refreshPromise;

    this.isRefreshing = true;
    this.refreshPromise = this.onTokenExpired().finally(() => {
      this.isRefreshing = false;
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private setupInterceptors() {
    // Request: add auth + optional CSRF
    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig & RequestConfig) => {
        const headers = AxiosHeaders.from(config.headers);

        if (!config.skipAuth) {
          const token = this.getAccessToken();
          if (token) headers.Authorization = `Bearer ${token}`;
        }

        if (config.requiresCsrf) {
          const csrf = getCsrfToken();
          if (csrf) headers["X-CSRF-Token"] = csrf;
        }

        config.headers = headers;
        return config;
      },
    );

    // Response: map errors + refresh once on 401
    this.axios.interceptors.response.use(
      (res) => res,
      async (err: AxiosError<any>) => {
        const status = err.response?.status;
        const original = err.config as
          | (AxiosRequestConfig & RequestConfig & { _retry?: boolean })
          | undefined;

        // network / CORS / no response
        if (!original || !err.response) {
          throw new HttpError(0, err.message || "Network error");
        }

        if (status === 401 && !original._retry && !original.skipRefresh) {
          original._retry = true;

          const newToken = await this.refreshToken();

          if (newToken) {
            // assumes onTokenExpired() persisted token for getAccessToken()
            return this.axios.request(original);
          }
        }

        const data = err.response?.data;
        const message =
          data?.message ||
          data?.detail ||
          `Request failed with status ${status}`;
        const fieldErrors = data?.errors || data?.fieldErrors;

        throw new HttpError(status ?? 0, message, fieldErrors);
      },
    );
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const res = await this.axios.request<T>({ url: path, method, ...config });
    return res.data;
  }

  get<T>(path: string, config?: RequestConfig) {
    return this.request<T>("GET", path, config);
  }
  post<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>("POST", path, { ...config, data: body });
  }
  put<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>("PUT", path, { ...config, data: body });
  }
  patch<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>("PATCH", path, { ...config, data: body });
  }
  delete<T>(path: string, config?: RequestConfig) {
    return this.request<T>("DELETE", path, config);
  }
}
