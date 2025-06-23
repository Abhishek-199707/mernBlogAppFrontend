import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-200">
      <Link to="/" className="text-xl font-bold">Thoughts</Link>

      <div className="space-x-4">
        {isLoggedIn ? (
          // When logged in
          <>
            <Link to="/create" className="px-4 py-2 bg-green-600 text-white rounded">New Post</Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </>
        ) : (
          // When not logged in
          <>
            <Link to="/login" className="px-4 py-2 text-black rounded hover:bg-gray-900 hover:text-white text-xl">Login</Link>
            <Link to="/register" className="px-4 py-2 text-black hover:bg-gray-900 hover:text-white rounded text-xl">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
