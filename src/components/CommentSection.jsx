import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  addComment,
  deleteComment,
} from '../app/commentSlice';

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.data[postId]) || [];
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addComment({ postId, comment: { text } }));
      setText('');
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded flex-grow"
          placeholder="Write a comment..."
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-3 rounded">
          Add
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment._id} className="flex justify-between items-center mb-2">
          <p className="text-sm">{comment.text}</p>
          <button
            onClick={() => dispatch(deleteComment({ commentId: comment._id, postId }))}
            className="text-red-500 text-xs"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
