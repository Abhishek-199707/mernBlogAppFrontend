import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setModalMessage('Please fill all fields');
      setSuccess(false);
      setIsModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      setModalMessage(data.message || (data.success ? 'Post created successfully!' : 'Failed to create post'));
      setSuccess(data.success);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalMessage('Error creating post');
      setSuccess(false);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Post</h1>
      {user && (
        <p className="text-center mb-4 text-gray-500">
          Posting as <strong>{user.userName}</strong>
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          style={{ height: '250px' }}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-2">
              {success ? 'Post Created' : 'Error'}
            </Dialog.Title>
            <p className="text-sm text-gray-700">{modalMessage}</p>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default NewPost;
