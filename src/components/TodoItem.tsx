
import React from "react";
import { Todo } from "@/types";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleTodoStatus, deleteTodo, isLoading } = useTodo();
  
  const isCompleted = todo.status === "inactive";
  
  const handleToggleStatus = () => {
    toggleTodoStatus(todo.id, isCompleted ? "active" : "inactive");
  };
  
  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div 
      className={cn(
        "todo-card mb-3 animate-slide-in",
        isCompleted && "opacity-75"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={cn(
              "todo-checkbox",
              isCompleted && "checked"
            )}
          >
            {isCompleted && <Check className="h-3 w-3 text-white" />}
          </button>
          
          <div className="flex-1">
            <h3 
              className={cn(
                "text-lg font-medium",
                isCompleted && "line-through text-gray-500"
              )}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className={cn(
                "text-sm text-gray-600 mt-1",
                isCompleted && "text-gray-400"
              )}>
                {todo.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(todo.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => onEdit(todo)}
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 text-todo-red hover:bg-red-50 hover:text-todo-red hover:border-todo-red"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
