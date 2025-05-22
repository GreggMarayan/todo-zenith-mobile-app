
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import TodoList from "@/components/TodoList";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { Check } from "lucide-react";

const IndexContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {isAuthenticated ? (
          <TodoList />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-md">
            <AuthForm />
          </div>
        )}
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <IndexContent />
      </TodoProvider>
    </AuthProvider>
  );
};

export default Index;
