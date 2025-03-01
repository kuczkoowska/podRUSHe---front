import React, { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '@/lib/api';

const Comment = ({ packageId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [packageId]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
      }, []);

    const fetchComments = async () => {
        try {
            const response = await getComments(packageId);
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            await addComment(packageId, {
                packageId: parseInt(packageId),
                content: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.commentId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                            <p className="text-sm text-gray-600">{comment.user.username}</p>
                            <p>{comment.content}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {isAdmin && (
                            <button 
                                onClick={() => handleDeleteComment(comment.commentId)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    className="flex-1 p-2 border rounded"
                />
                <button 
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
};

export default Comment;