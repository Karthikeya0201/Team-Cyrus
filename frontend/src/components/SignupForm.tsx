import React, { useState, useEffect } from 'react';
import config from '../config';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, FileText } from "lucide-react"; // Import FileText

interface SignupFormProps {
  onSignupSuccess: () => void;
}

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

const cardStyle = "w-full max-w-md p-6 shadow-xl rounded-lg";
const cardHeaderStyle = "flex items-center justify-center text-2xl font-semibold text-center text-indigo-600"; // Updated style
const inputLabelStyle = "block text-sm font-medium text-gray-700";
const inputStyle = "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const buttonStyle = "w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50";
const linkButtonStyle = "ml-2 text-indigo-600 hover:underline focus:outline-none";
const errorStyle = "mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200";
const successStyle = "mb-4 p-2 text-sm text-green-600 bg-green-50 rounded border border-green-200";

export const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword && formData.confirmPassword !== undefined) {
        throw new Error('Passwords do not match');
      }

      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.signup}`, {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      setIsSuccess(true);
      setError('Account created successfully! Redirecting to login...');
      onSignupSuccess();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <br />
      <br />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className={cardStyle}>
          <CardHeader>
            <Link to="/" className="flex items-center justify-center"> {/* Added flex styles */}
              <FileText className="w-6 h-6 mr-2" /> {/* Added logo */}
              <span className={cardHeaderStyle}>Builder.io</span> {/* Added text */}
            </Link>
          </CardHeader>
          <CardContent>
            {error && (
              <div className={error ? errorStyle : successStyle}>
                {error || 'Account created successfully! Redirecting to login...'}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="email" className={inputLabelStyle}>
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="password" className={inputLabelStyle}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`${inputStyle} pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="confirmPassword" className={inputLabelStyle}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`${inputStyle} pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className={buttonStyle}
                disabled={loading || formData.password !== formData.confirmPassword}
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link to="/login" className={linkButtonStyle}>
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignupForm;