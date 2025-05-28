import { ApiResponse, LoginResponse, TodoItem, TodosResponse } from "@/types";
import { getUniqPayload } from "recharts/types/util/payload/getUniqPayload";

const BASE_URL = "https://todo-list.dcism.org";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok || data.status !== 200) {
    throw new Error(data.message || `Error ${response.status}`);
  }
  return data;
}

export const authApi = {
  signup: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    params.append("first_name", firstName);
    params.append("last_name", lastName);
    params.append("email", email);
    params.append("password", password);
    params.append("confirm_password", password);

    try {
      const response = await fetch(`${BASE_URL}/signup_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: password
        }),
      });
      return await handleResponse<any>(response);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        throw new Error("Connection failed. Check network.");
      }
      throw err instanceof Error ? err : new Error("Signup failed.");
    }
  },

  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    try {
      const response = await fetch(`${BASE_URL}/signin_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: params.toString(),
        mode: "cors"
      });

      return await handleResponse<LoginResponse>(response);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        throw new Error("Connection failed. Check network.");
      }
      throw err instanceof Error ? err : new Error("Login failed.");
    }
  }
};

export const todoApi = {
  getTodos: async (userId: string, status: 'active' | 'inactive'): Promise<ApiResponse<TodosResponse>> => {
    try {
      const response = await fetch(`${BASE_URL}/getItems_action.php?status=${status}&user_id=${userId}`, {
        method: "GET",
        mode: "cors"
      });
      return handleResponse<TodosResponse>(response);
    } catch (error) {
      throw new Error("Failed to fetch todos.");
    }
  },

  addTodo: async (
    userId: string,
    title: string,
    description: string
  ): Promise<ApiResponse<TodoItem>> => {
    const params = new URLSearchParams();
    params.append("item_name", title);
    params.append("item_description", description);
    params.append("user_id", userId);

    try {
      const payload = {
        item_name: params.get("item_name")?.trim() || "",
        item_description: params.get("item_description")?.trim() || "",
        user_id: params.get("user_id") || ""
      };
      
      const response = await fetch(`${BASE_URL}/addItem_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(payload),
      });
      return await handleResponse<TodoItem>(response);
    } catch {
      throw new Error("Adding todo failed.");
    }
  },

  updateTodo: async (
    id: string,
    title: string,
    description: string
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    params.append("item_id", id);
    params.append("item_name", title);
    params.append("item_description", description);

    try {

      const payload = {
        item_id: params.get("item_id") || "",
        item_name: params.get("item_name")?.trim() || "",
        item_description: params.get("item_description")?.trim() || ""
      };
      const response = await fetch(`${BASE_URL}/editItem_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(payload)
      });
      return await handleResponse<any>(response);
    } catch {
      throw new Error("Updating todo failed.");
    }
  },

  toggleTodoStatus: async (
    id: string,
    status: "active" | "inactive"
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    params.append("item_id", id);
    params.append("status", status);

    try {
      const payload = {
        item_id: params.get("item_id") || "",
        status: params.get("status") || ""
      };

      const response = await fetch(`${BASE_URL}/statusItem_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "cors",
        body: JSON.stringify(payload)
      });
      return await handleResponse<any>(response);
    } catch {
      throw new Error("Toggling todo status failed.");
    }
  },

  deleteTodo: async (id: string): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    params.append("item_id", id);

    try {
      const response = await fetch(`${BASE_URL}/deleteItem_action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        mode: "cors",
        body: params.toString()
      });
      return await handleResponse<any>(response);
    } catch {
      throw new Error("Deleting todo failed.");
    }
  }
};

export default {
  auth: authApi,
  todo: todoApi
};
