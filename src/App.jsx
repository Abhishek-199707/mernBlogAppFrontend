import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/Registration';
import LoginForm from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SinglePost from './pages/SinglePost';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Home /></>} />
        <Route path="/login" element={<><Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><LoginForm setIsLoggedIn={setIsLoggedIn} /></>} />
        <Route path="/register" element={<><Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><RegisterForm /></>} />
        <Route path="/create" element={<><Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><NewPost /></>} />
        <Route path="/post/:id" element={<SinglePost />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
