const API_BASE_URL =
  "http://localhost:4000";

type RequestOptions = RequestInit & {
  params?: Record<
    string,
    string | number | boolean | undefined
  >;
};

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private buildUrl(
    path: string,
    params?: RequestOptions["params"]
  ) {
    const url = new URL(
      `${this.baseUrl}${path}`
    );

    if (params) {
      Object.entries(params).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null
          ) {
            url.searchParams.set(
              key,
              String(value)
            );
          }
        }
      );
    }

    return url.toString();
  }

  async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      params,
      headers,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(
      path,
      params
    );
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, {
      ...fetchOptions,

      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    let data: unknown = null;

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      contentType?.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data
          ? String(
              (
                data as {
                  message: unknown;
                }
              ).message
            )
          : `Request failed with status ${response.status}`;

      throw new ApiError(
        message,
        response.status,
        data
      );
    }

    return data as T;
  }

  get<T>(
    path: string,
    params?: RequestOptions["params"]
  ) {
    return this.request<T>(path, {
      method: "GET",
      params,
    });
  }

  post<T>(
    path: string,
    body?: unknown
  ) {
    return this.request<T>(path, {
      method: "POST",
      body: body
        ? JSON.stringify(body)
        : undefined,
    });
  }

  put<T>(
    path: string,
    body?: unknown
  ) {
    return this.request<T>(path, {
      method: "PUT",
      body: body
        ? JSON.stringify(body)
        : undefined,
    });
  }

  patch<T>(
    path: string,
    body?: unknown
  ) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body
        ? JSON.stringify(body)
        : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, {
      method: "DELETE",
    });
  }
}

export const api =
  new HttpClient(API_BASE_URL);

export { ApiError };