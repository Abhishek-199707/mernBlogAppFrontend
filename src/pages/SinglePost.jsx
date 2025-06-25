import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/user', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await res.json();
      if (data.success) setPost(data.post);
    } catch (err) {
      console.error("Failed to load post", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/post/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCurrentUser();
      await fetchPost();
      await fetchComments();
      setLoading(false);
    };
    load();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        await fetchComments();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  if (loading || !post) return <p className="text-center p-4">Loading...</p>;

  const latestFive = comments.slice(0, 5);

  const canDelete = (cmt) =>
    currentUser &&
    (cmt.author?._id === currentUser._id || post.author?._id === currentUser._id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        By <span className="font-semibold">{post.author?.userName || "Unknown"}</span> ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="border-t pt-6 mt-6">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        <div className="mb-4">
          <textarea
            rows="3"
            className="w-full border p-2 rounded text-sm"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 px-4 py-2 bg-black text-white rounded hover:shadow-2xl hover:text-gray-300"
          >
            Post Comment
          </button>
        </div>

        {latestFive.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {latestFive.map((cmt) => (
              <li key={cmt._id} className="border p-3 rounded bg-gray-50 relative group">
                <p className="text-sm mb-1 font-semibold">{cmt.author?.userName || "Anonymous"}</p>
                <p className="text-sm">{cmt.text}</p>
                {canDelete(cmt) && (
                  <button
                    onClick={() => {
                      setCommentToDelete(cmt._id);
                      setIsConfirmModalOpen(true);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {comments.length > 5 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Read more comments...
          </button>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-black text-white rounded hover:shadow-2xl hover:text-gray-300"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Full Comments Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0"
                enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100"
                leaveTo="scale-95 opacity-0">
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    All Comments
                  </Dialog.Title>
                  <div className="max-h-[60vh] overflow-y-auto space-y-4">
                    {comments.map((cmt) => (
                      <div key={cmt._id} className="border p-3 rounded bg-gray-50 relative">
                        <p className="text-sm mb-1 font-semibold">{cmt.author?.userName || "Anonymous"}</p>
                        <p className="text-sm">{cmt.text}</p>
                        {canDelete(cmt) && (
                          <button
                            onClick={() => {
                              setCommentToDelete(cmt._id);
                              setIsConfirmModalOpen(true);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            title="Delete comment"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirmation Modal */}
      <Transition appear show={isConfirmModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => setIsConfirmModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="scale-95 opacity-0"
                enterTo="scale-100 opacity-100" leave="ease-in duration-200" leaveFrom="scale-100 opacity-100"
                leaveTo="scale-95 opacity-0">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                    Confirm Delete
                  </Dialog.Title>
                  <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this comment?</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsConfirmModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await handleDeleteComment(commentToDelete);
                        setIsConfirmModalOpen(false);
                        setCommentToDelete(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SinglePost;
