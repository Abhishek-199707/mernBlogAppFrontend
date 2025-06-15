import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setMessage('Please provide all fields');
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await response.json();
      
      setSuccess(data.success);
      setMessage(data.message);

      if (data.success) {
        setUserName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
      setMessage('Server error');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Register here
        </h2>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded ${
              success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="userName" className="block mb-2 text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
          />

          <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />

          <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Register
          </button>
        </form>
         <p className="mt-4 text-center text-sm text-gray-600">
          Already registered? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
