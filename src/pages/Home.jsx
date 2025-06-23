import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?page=${page}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">All Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border p-4 mb-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
            <p className="text-sm text-gray-600 mb-2">By {post.author?.userName || "Unknown Author"}</p>
            <div
              className="text-sm mb-3"
              dangerouslySetInnerHTML={{
                __html: post.content.length > 150
                  ? post.content.slice(0, 150) + '...'
                  : post.content,
              }}
            />
            <Link
              to={`/post/${post._id}`}
              className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              View
            </Link>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
