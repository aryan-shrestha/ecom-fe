import { getCsrfToken } from './csrf';
import { HttpError } from './errors';
import { clientEnv } from '@/lib/env/client';
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig extends AxiosRequestConfig {
  requiresCsrf?: boolean;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

export interface HttpClientOptions {
  getAccessToken: () => string | null;
  onTokenExpired: () => Promise<string | null>;
}

type RetryableRequestConfig = AxiosRequestConfig &
  RequestConfig & {
    _retry?: boolean;
  };

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
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private refreshToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.onTokenExpired().finally(() => {
      this.isRefreshing = false;
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private normalizeMessage(rawMessage: unknown, fallback: string): string {
    if (typeof rawMessage === 'string' && rawMessage.trim()) {
      return rawMessage;
    }

    if (Array.isArray(rawMessage)) {
      const formatted = rawMessage
        .map((item) => {
          if (typeof item === 'string') return item;

          if (item && typeof item === 'object') {
            const obj = item as {
              loc?: unknown[];
              msg?: string;
              type?: string;
            };

            const path = Array.isArray(obj.loc)
              ? obj.loc.filter((part) => part !== 'body').join('.')
              : '';

            if (obj.msg && path) return `${path}: ${obj.msg}`;
            if (obj.msg) return obj.msg;
            if (obj.type) return obj.type;
          }

          return String(item);
        })
        .filter(Boolean)
        .join(' | ');

      return formatted || fallback;
    }

    if (rawMessage && typeof rawMessage === 'object') {
      const entries = Object.entries(rawMessage as Record<string, unknown>)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          if (value && typeof value === 'object') {
            return `${key}: ${JSON.stringify(value)}`;
          }
          return `${key}: ${String(value)}`;
        })
        .join(' | ');

      return entries || fallback;
    }

    return fallback;
  }

  private setupInterceptors() {
    this.axios.interceptors.request.use(
      async (config: InternalAxiosRequestConfig & RequestConfig) => {
        const headers = AxiosHeaders.from(config.headers);

        if (!config.skipAuth) {
          const token = this.getAccessToken();
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
        }

        if (config.requiresCsrf) {
          const csrf = getCsrfToken();
          if (csrf) {
            headers['X-CSRF-Token'] = csrf;
          }
        }

        config.headers = headers;
        return config;
      },
    );

    this.axios.interceptors.response.use(
      (response) => response,
      async (err: AxiosError<unknown>) => {
        const status = err.response?.status;
        const original = err.config as RetryableRequestConfig | undefined;

        if (!original || !err.response) {
          throw new HttpError(0, err.message || 'Network error');
        }

        if (status === 401 && !original._retry && !original.skipRefresh) {
          original._retry = true;

          const newToken = await this.refreshToken();

          if (newToken) {
            return this.axios.request(original);
          }
        }

        const data = err.response.data as
          | {
              message?: unknown;
              detail?: unknown;
              errors?: Record<string, string[]>;
              fieldErrors?: Record<string, string[]>;
            }
          | undefined;

        const fieldErrors = data?.errors || data?.fieldErrors;
        const fallbackMessage = `Request failed with status ${status ?? 0}`;

        const rawMessage = data?.message ?? data?.detail ?? err.message ?? fallbackMessage;

        const message = this.normalizeMessage(rawMessage, fallbackMessage);

        throw new HttpError(status ?? 0, message, fieldErrors);
      },
    );
  }

  async request<T>(method: HttpMethod, path: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.axios.request<T>({
      url: path,
      method,
      ...config,
    });

    return response.data;
  }

  get<T>(path: string, config?: RequestConfig) {
    return this.request<T>('GET', path, config);
  }

  post<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>('POST', path, {
      ...config,
      data: body,
    });
  }

  put<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>('PUT', path, {
      ...config,
      data: body,
    });
  }

  patch<T>(path: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>('PATCH', path, {
      ...config,
      data: body,
    });
  }

  delete<T>(path: string, config?: RequestConfig) {
    return this.request<T>('DELETE', path, config);
  }
}
