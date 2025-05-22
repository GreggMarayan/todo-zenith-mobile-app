
import React, { createContext, useState, useContext, useEffect } from "react";
import { Todo, TodoContextType } from "@/types";
import { todoApi } from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

// Create the context
const TodoContext = createContext<TodoContextType | null>(null);

// Custom hook to use the todo context
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch todos when authenticated user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      getTodos();
    }
  }, [isAuthenticated, user]);

  // Get all todos
  const getTodos = async () => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.getTodos(user.token);
      
      if (response.success && response.data) {
        setTodos(response.data.todos);
      } else {
        setError(response.error || "Failed to fetch todos");
        toast({
          title: "Error",
          description: response.error || "Failed to fetch todos",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch todos";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (title: string, description: string) => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.addTodo(user.token, title, description);
      
      if (response.success && response.data) {
        setTodos([...todos, response.data.todo]);
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      } else {
        setError(response.error || "Failed to add todo");
        toast({
          title: "Error",
          description: response.error || "Failed to add todo",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add todo";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing todo
  const updateTodo = async (id: string, title: string, description: string) => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.updateTodo(user.token, id, title, description);
      
      if (response.success && response.data) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? response.data.todo : todo
          )
        );
        toast({
          title: "Success",
          description: "Todo updated successfully",
        });
      } else {
        setError(response.error || "Failed to update todo");
        toast({
          title: "Error",
          description: response.error || "Failed to update todo",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update todo";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle todo status
  const toggleTodoStatus = async (id: string, status: 'active' | 'completed') => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.toggleTodoStatus(user.token, id, status);
      
      if (response.success && response.data) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? response.data.todo : todo
          )
        );
        toast({
          title: "Success",
          description: `Todo marked as ${status}`,
        });
      } else {
        setError(response.error || "Failed to update todo status");
        toast({
          title: "Error",
          description: response.error || "Failed to update todo status",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update todo status";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.deleteTodo(user.token, id);
      
      if (response.success) {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        });
      } else {
        setError(response.error || "Failed to delete todo");
        toast({
          title: "Error",
          description: response.error || "Failed to delete todo",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete todo";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    todos,
    isLoading,
    error,
    getTodos,
    addTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
