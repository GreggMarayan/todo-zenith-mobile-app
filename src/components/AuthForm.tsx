
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const AuthForm: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const [signupErrors, setSignupErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // Validate login form
  const validateLoginForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;
    
    if (!loginEmail) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
      isValid = false;
    }
    
    setLoginErrors(errors);
    return isValid;
  };
  
  // Validate signup form
  const validateSignupForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;
    
    if (!firstName) {
      errors.firstName = "First name is required";
      isValid = false;
    }
    
    if (!lastName) {
      errors.lastName = "Last name is required";
      isValid = false;
    }
    
    if (!signupEmail) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    
    if (!signupPassword) {
      errors.password = "Password is required";
      isValid = false;
    } else if (signupPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== signupPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setSignupErrors(errors);
    return isValid;
  };
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateLoginForm()) {
      try {
        await login(loginEmail, loginPassword);
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };
  
  // Handle signup submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSignupForm()) {
      try {
        await signup(firstName, lastName, signupEmail, signupPassword);
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-10 h-10 bg-todo-blue rounded-full flex items-center justify-center">
          <Check className="text-white h-6 w-6" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Welcome to Todo App
      </h2>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={loginErrors.email ? "border-red-500" : ""}
              />
              {loginErrors.email && (
                <p className="text-xs text-red-500">{loginErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={loginErrors.password ? "border-red-500" : ""}
              />
              {loginErrors.password && (
                <p className="text-xs text-red-500">{loginErrors.password}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-todo-blue hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={signupErrors.firstName ? "border-red-500" : ""}
                />
                {signupErrors.firstName && (
                  <p className="text-xs text-red-500">{signupErrors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={signupErrors.lastName ? "border-red-500" : ""}
                />
                {signupErrors.lastName && (
                  <p className="text-xs text-red-500">{signupErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className={signupErrors.email ? "border-red-500" : ""}
              />
              {signupErrors.email && (
                <p className="text-xs text-red-500">{signupErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className={signupErrors.password ? "border-red-500" : ""}
              />
              {signupErrors.password && (
                <p className="text-xs text-red-500">{signupErrors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={signupErrors.confirmPassword ? "border-red-500" : ""}
              />
              {signupErrors.confirmPassword && (
                <p className="text-xs text-red-500">{signupErrors.confirmPassword}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-todo-blue hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
