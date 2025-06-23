import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        }
      })
      .catch((err) => console.error("Failed to load post", err));
  }, [id]);

  if (!post) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      <p className="text-gray-500 text-sm mb-4">
        By <span className="font-semibold">{post.author?.userName || "Unknown"}</span> ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-6">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SinglePost;
