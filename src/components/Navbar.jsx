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
    <nav className="flex justify-between p-2 items-center bg-gray-200">
      <Link to="/" className="text-2xl font-bold">Thoughts</Link>

      <div className="space-x-4">
        {isLoggedIn ? (
          // When logged in
          <>
            <Link to="/create" className="text-xl bg-black text-white p-3 rounded font-bold text-center hover:shadow-2xl hover:text-gray-300 ">New Post</Link>
            <button onClick={handleLogout} className="text-xl bg-black text-white p-3 rounded font-bold text-center hover:shadow-2xl hover:text-gray-300">Logout</button>
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
