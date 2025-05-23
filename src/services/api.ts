
import { ApiResponse, LoginResponse, TodoItem, TodosResponse } from "@/types";

const BASE_URL = "https://todo-list.dcism.org";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.status !== 200) {
    throw new Error(data.message || "Something went wrong");
  }
  
  return data;
}

// Authentication APIs
export const authApi = {
  signup: async (firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${BASE_URL}/signup_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
        mode: "cors",
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          password,
          confirm_password: password
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Signup response error:", errorText);
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Signup response data:", data);
      return data;
    } catch (error) {
      console.error("Signup API error:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Unable to connect to the server. Please check your internet connection and try again.");
      }
      throw error instanceof Error ? error : new Error("Registration failed. Please try again.");
    }
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await fetch(`${BASE_URL}/signin_action.php?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
        mode: "cors",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login response error:", errorText);
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Login response data:", data);
      return data;
    } catch (error) {
      console.error("Login API error:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Unable to connect to the server. Please check your internet connection and try again.");
      }
      throw error instanceof Error ? error : new Error("Login failed. Please try again.");
    }
  },
};

// Todo APIs
export const todoApi = {
  getTodos: async (userId: string, status: 'active' | 'inactive'): Promise<ApiResponse<TodosResponse>> => {
    try {
      const response = await fetch(`${BASE_URL}/getItems_action.php?status=${status}&user_id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
      });
      
      return handleResponse<TodosResponse>(response);
    } catch (error) {
      console.error("Get todos API error:", error);
      throw new Error("Failed to fetch todos. Please try again.");
    }
  },
  
  addTodo: async (userId: string, title: string, description: string): Promise<ApiResponse<TodoItem>> => {
    try {
      const response = await fetch(`${BASE_URL}/addItem_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ 
          item_name: title, 
          item_description: description,
          user_id: parseInt(userId)
        }),
      });
      
      return handleResponse<TodoItem>(response);
    } catch (error) {
      console.error("Add todo API error:", error);
      throw new Error("Failed to add todo. Please try again.");
    }
  },
  
  updateTodo: async (id: string, title: string, description: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${BASE_URL}/editItem_action.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ 
          item_id: parseInt(id), 
          item_name: title, 
          item_description: description 
        }),
      });
      
      return handleResponse<any>(response);
    } catch (error) {
      console.error("Update todo API error:", error);
      throw new Error("Failed to update todo. Please try again.");
    }
  },
  
  toggleTodoStatus: async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${BASE_URL}/statusItem_action.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ 
          item_id: parseInt(id), 
          status 
        }),
      });
      
      return handleResponse<any>(response);
    } catch (error) {
      console.error("Toggle todo status API error:", error);
      throw new Error("Failed to update todo status. Please try again.");
    }
  },
  
  deleteTodo: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${BASE_URL}/deleteItem_action.php?item_id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
      });
      
      return handleResponse<any>(response);
    } catch (error) {
      console.error("Delete todo API error:", error);
      throw new Error("Failed to delete todo. Please try again.");
    }
  },
};

export default {
  auth: authApi,
  todo: todoApi,
};
