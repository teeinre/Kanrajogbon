
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Handshake, User, Menu, X } from "lucide-react";
import logoImage from "@assets/findermeister logo real_1756395091374.jpg";
import type { Category } from "@shared/schema";

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();

  const [userType, setUserType] = useState<'client' | 'finder'>('client');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "",
    category: "", // Keep for backward compatibility if needed, but primarily use categories
    categories: [] as string[],
    skills: "",
    availability: "full-time"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch categories for registration
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time password validation
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    validation.isValid = Object.values(validation).every(Boolean);
    setPasswordValidation(validation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password does not meet security requirements",
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please accept the terms and conditions",
      });
      return;
    }

    if (userType === 'finder' && formData.categories.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one category",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare skills for backend if needed (e.g., comma-separated string)
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

      const registrationData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: userType,
      };

      // Add finder-specific fields only if registering as finder
      if (userType === 'finder') {
        registrationData.bio = formData.bio;
        registrationData.category = formData.category; // Keep for backward compatibility
        registrationData.categories = formData.categories; // New multiple categories field
        registrationData.skills = skillsArray;
        registrationData.availability = formData.availability;
      }

      await register(registrationData);

      toast({
        title: "Success!",
        description: `Your ${userType} account has been created successfully.`,
      });

      navigate(userType === 'finder' ? "/finder/dashboard" : "/client/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Failed to create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-finder-red text-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <img
                src={logoImage}
                alt="FinderMeister Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-full"
              />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold truncate">FinderMeister</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="#how-it-works" className="hover:underline hover:text-gray-200 transition-all duration-200 text-sm xl:text-base">
                How it Works
              </Link>
              <Link href="/login" className="hover:underline hover:text-gray-200 transition-all duration-200 text-sm xl:text-base">
                Log In
              </Link>
              <span className="bg-white text-finder-red px-4 py-2 rounded-lg font-medium text-sm xl:text-base shadow-sm hover:shadow-md transition-shadow duration-200">
                Sign Up
              </span>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-finder-red-dark p-2 rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-finder-red-light/30 animate-in slide-in-from-top-2 duration-200">
              <nav className="flex flex-col space-y-2 pt-4 px-2">
                <Link 
                  href="#how-it-works" 
                  className="hover:bg-finder-red-dark px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link 
                  href="/login" 
                  className="hover:bg-finder-red-dark px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <div className="bg-white text-finder-red px-4 py-3 rounded-lg font-medium text-sm text-center shadow-sm">
                  Sign Up
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <section className="py-4 sm:py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Join FinderMeister as a {userType === 'client' ? 'client to request services' : 'finder to offer your services'}.
                </p>
                <div className="bg-finder-red rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* User Type Selection */}
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-base sm:text-lg font-semibold text-gray-900">I want to:</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setUserType('client')}
                      className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-all ${
                        userType === 'client'
                          ? 'border-finder-red bg-finder-red/10 text-finder-red'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-sm sm:text-base">Client</div>
                      <div className="text-xs mt-1">Request services</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('finder')}
                      className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-all ${
                        userType === 'finder'
                          ? 'border-finder-red bg-finder-red/10 text-finder-red'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-sm sm:text-base">Finder</div>
                      <div className="text-xs mt-1">Provide services</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="firstName" className="sr-only">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="sr-only">Last name</Label>
                    <Input
                       id="lastName"
                       name="lastName"
                       type="text"
                       required
                       value={formData.lastName}
                       onChange={handleInputChange}
                       placeholder="Last name"
                       className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                     />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     required
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="Email"
                     className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                   />
                </div>

                <div>
                  <Label htmlFor="password" className="sr-only">Password</Label>
                  <div className="relative">
                    <Input
                       id="password"
                       name="password"
                       type={showPassword ? "text" : "password"}
                       required
                       value={formData.password}
                       onChange={handleInputChange}
                       placeholder="Password"
                       className="h-10 sm:h-12 border-gray-300 rounded-md pr-12 text-sm sm:text-base"
                     />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordValidation.minLength ? "✓" : "•"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordValidation.hasUppercase ? "✓" : "•"}</span>
                      <span>Contains uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordValidation.hasLowercase ? "✓" : "•"}</span>
                      <span>Contains lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordValidation.hasNumber ? "✓" : "•"}</span>
                      <span>Contains a number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordValidation.hasSpecialChar ? "✓" : "•"}</span>
                      <span>Contains a special character (!@#$%^&*...)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="sr-only">Confirm password</Label>
                  <Input
                     id="confirmPassword"
                     name="confirmPassword"
                     type="password"
                     required
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     placeholder="Confirm password"
                     className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                   />
                </div>

                <div>
                  <Label htmlFor="phone" className="sr-only">Phone number</Label>
                  <Input
                     id="phone"
                     name="phone"
                     type="tel"
                     required
                     value={formData.phone}
                     onChange={handleInputChange}
                     placeholder="Phone number"
                     className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                   />
                </div>

                {/* Finder-specific fields */}
                {userType === 'finder' && (
                  <>
                    {/* Bio Input */}
                    <div>
                      <Label htmlFor="bio" className="sr-only">Bio</Label>
                      <Input
                         id="bio"
                         name="bio"
                         value={formData.bio}
                         onChange={handleInputChange}
                         placeholder="Short bio (optional)"
                         className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                       />
                    </div>

                    {/* Skills Input */}
                    <div>
                      <Label htmlFor="skills" className="sr-only">Skills</Label>
                      <Input
                         id="skills"
                         name="skills"
                         value={formData.skills}
                         onChange={handleInputChange}
                         placeholder="Skills (comma-separated)"
                         className="h-10 sm:h-12 border-gray-300 rounded-md text-sm sm:text-base"
                       />
                    </div>

                    {/* Categories Selection */}
                    <div>
                      <Label htmlFor="categories">Categories</Label>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Select all categories that match your skills and expertise:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border rounded-md bg-white/80">
                          {categoriesLoading ? (
                            <div className="col-span-full text-center py-4 text-gray-500">Loading categories...</div>
                          ) : categories.length > 0 ? (
                            categories
                              .filter(category => category.isActive)
                              .map((category) => (
                                <label key={category.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                  <input
                                    type="checkbox"
                                    checked={formData.categories.includes(category.name)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setFormData(prev => ({
                                        ...prev,
                                        categories: isChecked
                                          ? [...prev.categories, category.name]
                                          : prev.categories.filter(cat => cat !== category.name)
                                      }));
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                </label>
                              ))
                          ) : (
                            <div className="col-span-full text-center py-4 text-gray-500">No categories available</div>
                          )}
                        </div>
                        {formData.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.categories.map((categoryName) => (
                              <Badge key={categoryName} variant="secondary" className="text-xs">
                                {categoryName}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(cat => cat !== categoryName)
                                    }));
                                  }}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Availability Selection */}
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                        <SelectTrigger className="bg-white/80 h-12">
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="flex items-start space-x-3 mb-6">
                  <input
                    type="checkbox"
                    id="acceptTermsFinder"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-finder-red focus:ring-finder-red"
                  />
                  <label htmlFor="acceptTermsFinder" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms-and-conditions" className="text-finder-red hover:underline font-medium">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !acceptedTerms || (userType === 'finder' && formData.categories.length === 0)}
                  className="w-full h-12 bg-finder-red hover:bg-finder-red-dark text-white font-medium text-lg rounded-md"
                >
                  {isLoading ? "Creating Account..." : `Sign Up as ${userType === 'client' ? 'Client' : 'Finder'}`}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-finder-red hover:underline font-medium">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}