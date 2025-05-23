
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types";
import { authApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("todo_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem("todo_user");
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.status === 200 && response.data) {
        const userData = {
          id: response.data.id.toString(),
          firstName: response.data.fname,
          lastName: response.data.lname,
          email: response.data.email,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("todo_user", JSON.stringify(userData));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.firstName}!`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.signup(firstName, lastName, email, password);
      
      if (response.status === 200) {
        toast({
          title: "Registration Successful",
          description: "Please login with your new account.",
        });
        // After successful signup, automatically try to login
        await login(email, password);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("todo_user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
