import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import ApiRequest from '../../Utils/apirequest.js';
import { useAuthStore } from '../../Zustand/AuthStore';
import Loginimage from "../../images/login.jpg";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate(); // Use useNavigate hook

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ApiRequest('POST', '/admin/login', formData);
      
      if (response.status === 200) {
        toast.success('Login Successful');
        // toast.success('Login Successful', { autoClose: 2000 }); // Display toast for 2 seconds
        document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; HttpOnly; SameSite=Strict`;
        login(response.data.token);
      
        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate('/settings'); // Programmatically navigate to the dashboard
        }, 2000);
      } else {
        toast.error('Login Failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden w-full xl:block xl:w-1/2 "
       style={{backgroundImage: `url(${Loginimage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
      >
        {/* <div className="flex flex-col items-center justify-center h-full text-white">
          <User size={100} />
          <h1 className="mt-6 text-4xl font-bold">Professional Spotlight</h1>
          <p className="mt-2 text-xl">For Professional Spotlight Admin Team</p>
        </div> */}
      </div>

      <div className="w-full xl:w-1/2">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-3xl font-bold text-gray-800">
            Sign In to Professional Spotlight
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={handleInput}
                  required
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={handleInput}
                  required
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <div className="absolute right-3 top-3 cursor-pointer" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default SignIn;