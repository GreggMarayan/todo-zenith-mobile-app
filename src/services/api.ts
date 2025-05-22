
import { ApiResponse, LoginResponse, SignupResponse, TodoResponse, TodosResponse } from "@/types";

const BASE_URL = "https://todo-list.dcism.org";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Something went wrong");
  }
  
  const data = await response.json();
  return data;
}

// Authentication APIs
export const authApi = {
  signup: async (firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<SignupResponse>> => {
    const response = await fetch(`${BASE_URL}/signup_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    
    return handleResponse<ApiResponse<SignupResponse>>(response);
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${BASE_URL}/signin_action.php?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse<ApiResponse<LoginResponse>>(response);
  },
};

// Todo APIs
export const todoApi = {
  getTodos: async (token: string): Promise<ApiResponse<TodosResponse>> => {
    const response = await fetch(`${BASE_URL}/getItems_action.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    return handleResponse<ApiResponse<TodosResponse>>(response);
  },
  
  addTodo: async (token: string, title: string, description: string): Promise<ApiResponse<TodoResponse>> => {
    const response = await fetch(`${BASE_URL}/addItem_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    
    return handleResponse<ApiResponse<TodoResponse>>(response);
  },
  
  updateTodo: async (token: string, id: string, title: string, description: string): Promise<ApiResponse<TodoResponse>> => {
    const response = await fetch(`${BASE_URL}/editItem_action.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id, title, description }),
    });
    
    return handleResponse<ApiResponse<TodoResponse>>(response);
  },
  
  toggleTodoStatus: async (token: string, id: string, status: 'active' | 'completed'): Promise<ApiResponse<TodoResponse>> => {
    const response = await fetch(`${BASE_URL}/statusItem_action.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });
    
    return handleResponse<ApiResponse<TodoResponse>>(response);
  },
  
  deleteTodo: async (token: string, id: string): Promise<ApiResponse<{}>> => {
    const response = await fetch(`${BASE_URL}/deleteItem_action.php`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    
    return handleResponse<ApiResponse<{}>>(response);
  },
};

export default {
  auth: authApi,
  todo: todoApi,
};
