export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token: string;
  user: AuthUser;
};

export type MeResponse = {
  success: boolean;
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
  message?: string;
};

export type TaskStatus = "pending" | "running" | "success" | "failed";

export type TaskOperation =
  | "uppercase"
  | "lowercase"
  | "reverse"
  | "word_count";

export type TaskItem = {
  id: string;
  title: string;
  operation: TaskOperation;
  status: TaskStatus;
  createdAt: string;
  inputText?: string;
  result?: string;
  logs?: Array<{ level: string; message: string; at?: string }>;
};

export type TaskListResponse = {
  success: boolean;
  count: number;
  tasks: Array<{
    _id?: string;
    id?: string;
    title: string;
    operation: TaskOperation;
    status: TaskStatus;
    createdAt: string;
  }>;
};

export type TaskDetailResponse = {
  success: boolean;
  task: {
    _id?: string;
    id?: string;
    title: string;
    operation: TaskOperation;
    status: TaskStatus;
    inputText: string;
    result?: string;
    logs?: Array<{ level: string; message: string; at?: string }>;
    createdAt: string;
  };
};

export type CreateTaskInput = {
  title: string;
  inputText: string;
  operation: TaskOperation;
};

export type CreateTaskResponse = {
  success: boolean;
  message?: string;
  task: TaskDetailResponse["task"];
};

export type UpdateTaskInput = Partial<{
  title: string;
  inputText: string;
  operation: TaskOperation;
  status: TaskStatus;
}>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

const TOKEN_KEY = "ai-task-platform-token";

const normalizeTask = (task: {
  _id?: string;
  id?: string;
  title: string;
  operation: TaskOperation;
  status: TaskStatus;
  createdAt: string;
  inputText?: string;
  result?: string;
  logs?: Array<{ level: string; message: string; at?: string }>;
}): TaskItem => ({
  id: task.id ?? task._id ?? "",
  title: task.title,
  operation: task.operation,
  status: task.status,
  createdAt: task.createdAt,
  inputText: task.inputText,
  result: task.result,
  logs: task.logs,
});

export const session = {
  getToken(): string {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  },
  setToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, token);
      document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  },
  clearToken() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  },
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  if (!response.ok) {
    const message =
      (isRecord(payload) &&
        typeof payload.message === "string" &&
        payload.message) ||
      (isRecord(payload) &&
        typeof payload.error === "string" &&
        payload.error) ||
      "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export const authApi = {
  register(input: { name: string; email: string; password: string }) {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  login(input: { email: string; password: string }) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  me(token: string) {
    return apiRequest<MeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  logout(token: string) {
    return apiRequest<LogoutResponse>("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const tasksApi = {
  list(token: string, filters?: { status?: string; search?: string }) {
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    if (filters?.search) {
      params.set("search", filters.search);
    }

    const query = params.toString() ? `?${params.toString()}` : "";

    return apiRequest<TaskListResponse>(`/tasks${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => ({
      ...response,
      tasks: response.tasks.map(normalizeTask),
    }));
  },
  detail(token: string, id: string) {
    return apiRequest<TaskDetailResponse>(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => ({
      ...response,
      task: normalizeTask(response.task),
    }));
  },
  create(token: string, input: CreateTaskInput) {
    return apiRequest<CreateTaskResponse>("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    }).then((response) => ({
      ...response,
      task: normalizeTask(response.task),
    }));
  },
  update(token: string, id: string, input: UpdateTaskInput) {
    return apiRequest<CreateTaskResponse>(`/tasks/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    }).then((response) => ({
      ...response,
      task: normalizeTask(response.task),
    }));
  },
};
