
import React, { createContext, useState, useContext, useEffect } from "react";
import { Todo, TodoContextType } from "@/types";
import { todoApi } from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

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

  // Helper function to transform API todo to our Todo type
  const transformApiTodo = (apiTodo: any): Todo => ({
    id: apiTodo.item_id.toString(),
    title: apiTodo.item_name,
    description: apiTodo.item_description,
    status: apiTodo.status,
    createdAt: apiTodo.timemodified,
    updatedAt: apiTodo.timemodified,
    userId: apiTodo.user_id.toString(),
  });

  // Get all todos (both active and inactive)
  const getTodos = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both active and inactive todos
      const [activeResponse, inactiveResponse] = await Promise.all([
        todoApi.getTodos(user.id, 'active'),
        todoApi.getTodos(user.id, 'inactive')
      ]);
      
      const allTodos: Todo[] = [];
      
      // Process active todos
      if (activeResponse.status === 200 && activeResponse.data) {
        Object.values(activeResponse.data).forEach(todo => {
          allTodos.push(transformApiTodo(todo));
        });
      }
      
      // Process inactive todos  
      if (inactiveResponse.status === 200 && inactiveResponse.data) {
        Object.values(inactiveResponse.data).forEach(todo => {
          allTodos.push(transformApiTodo(todo));
        });
      }
      
      setTodos(allTodos);
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
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.addTodo(user.id, title, description);
      
      if (response.status === 200 && response.data) {
        const newTodo = transformApiTodo(response.data);
        setTodos([...todos, newTodo]);
        toast({
          title: "Success",
          description: "Todo added successfully",
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
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.updateTodo(id, title, description);
      
      if (response.status === 200) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, title, description } : todo
          )
        );
        toast({
          title: "Success",
          description: "Todo updated successfully",
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
  const toggleTodoStatus = async (id: string, status: 'active' | 'inactive') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.toggleTodoStatus(id, status);
      
      if (response.status === 200) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, status } : todo
          )
        );
        toast({
          title: "Success",
          description: `Todo marked as ${status}`,
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
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await todoApi.deleteTodo(id);
      
      if (response.status === 200) {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast({
          title: "Success",
          description: "Todo deleted successfully",
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
