
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, LogOut } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Todo App" }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-todo-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Check className="h-6 w-6" />
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              Welcome, {user.firstName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-600"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
