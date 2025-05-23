
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
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
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  getTodos: () => Promise<void>;
  addTodo: (title: string, description: string) => Promise<void>;
  updateTodo: (id: string, title: string, description: string) => Promise<void>;
  toggleTodoStatus: (id: string, status: 'active' | 'inactive') => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

// API Response types matching the actual API
export interface ApiResponse<T> {
  status: number;
  data?: T;
  message: string;
  count?: string;
}

export interface LoginResponse {
  id: number;
  fname: string;
  lname: string;
  email: string;
  timemodified: string;
}

export interface TodoItem {
  item_id: number;
  item_name: string;
  item_description: string;
  status: 'active' | 'inactive';
  user_id: number;
  timemodified: string;
}

export interface TodosResponse {
  [key: string]: TodoItem;
}
