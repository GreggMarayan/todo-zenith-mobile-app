
import React, { useState, useEffect } from "react";
import { useTodo } from "@/context/TodoContext";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Todo } from "@/types";
import { Loader, Plus, Search, RefreshCw } from "lucide-react";

const TodoList: React.FC = () => {
  const { todos, getTodos, isLoading } = useTodo();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get todos on component mount
  useEffect(() => {
    getTodos();
  }, []);
  
  // Filter todos based on activeTab and searchQuery
  const filteredTodos = todos.filter((todo) => {
    // First filter by status
    const statusMatch =
      activeTab === "all" ||
      (activeTab === "active" && todo.status === "active") ||
      (activeTab === "completed" && todo.status === "completed");
    
    // Then filter by search query
    const searchMatch =
      searchQuery === "" ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });
  
  const handleEditTodo = (todo: Todo) => {
    setTodoToEdit(todo);
    setShowAddForm(true);
  };
  
  const handleCloseForm = () => {
    setShowAddForm(false);
    setTodoToEdit(null);
  };
  
  const handleRefresh = () => {
    getTodos();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-todo-blue hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Task
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 w-10 flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "active" | "completed")}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <TodoListContent
              todos={filteredTodos}
              isLoading={isLoading}
              onEditTodo={handleEditTodo}
            />
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <TodoListContent
              todos={filteredTodos}
              isLoading={isLoading}
              onEditTodo={handleEditTodo}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <TodoListContent
              todos={filteredTodos}
              isLoading={isLoading}
              onEditTodo={handleEditTodo}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {showAddForm && (
        <AddTodoForm onClose={handleCloseForm} todoToEdit={todoToEdit} />
      )}
    </div>
  );
};

interface TodoListContentProps {
  todos: Todo[];
  isLoading: boolean;
  onEditTodo: (todo: Todo) => void;
}

const TodoListContent: React.FC<TodoListContentProps> = ({ todos, isLoading, onEditTodo }) => {
  if (isLoading && todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader className="h-8 w-8 text-todo-blue animate-spin mb-4" />
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }
  
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 border rounded-lg bg-gray-50">
        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500">Add a new task or change your filters</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
      ))}
    </div>
  );
};

export default TodoList;
