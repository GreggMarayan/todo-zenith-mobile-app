
import { ApiResponse, LoginResponse, TodoItem, TodosResponse } from "@/types";

const BASE_URL = "https://todo-list.dcism.org";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (data.status !== 200) {
    throw new Error(data.message || "Something went wrong");
  }
  
  return data;
}

// Authentication APIs
export const authApi = {
  signup: async (firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/signup_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        password,
        confirm_password: password
      }),
    });
    
    return handleResponse<any>(response);
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${BASE_URL}/signin_action.php?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse<LoginResponse>(response);
  },
};

// Todo APIs
export const todoApi = {
  getTodos: async (userId: string, status: 'active' | 'inactive'): Promise<ApiResponse<TodosResponse>> => {
    const response = await fetch(`${BASE_URL}/getItems_action.php?status=${status}&user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse<TodosResponse>(response);
  },
  
  addTodo: async (userId: string, title: string, description: string): Promise<ApiResponse<TodoItem>> => {
    const response = await fetch(`${BASE_URL}/addItem_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        item_name: title, 
        item_description: description,
        user_id: parseInt(userId)
      }),
    });
    
    return handleResponse<TodoItem>(response);
  },
  
  updateTodo: async (id: string, title: string, description: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/editItem_action.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        item_id: parseInt(id), 
        item_name: title, 
        item_description: description 
      }),
    });
    
    return handleResponse<any>(response);
  },
  
  toggleTodoStatus: async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/statusItem_action.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        item_id: parseInt(id), 
        status 
      }),
    });
    
    return handleResponse<any>(response);
  },
  
  deleteTodo: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/deleteItem_action.php?item_id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse<any>(response);
  },
};

export default {
  auth: authApi,
  todo: todoApi,
};
