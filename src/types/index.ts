
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  getTodos: () => Promise<void>;
  addTodo: (title: string, description: string) => Promise<void>;
  updateTodo: (id: string, title: string, description: string) => Promise<void>;
  toggleTodoStatus: (id: string, status: 'active' | 'completed') => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface TodoResponse {
  todo: Todo;
}
