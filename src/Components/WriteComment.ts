import React, { useState } from 'react';
import Avatar from "react-avatar";
import { FaPaperPlane } from 'react-icons/fa';

interface WriteCommentProps {
    username: string;
    news_id: number;
    refreshComments: () => void;
}

function WriteComment({ username, news_id, refreshComments }: WriteCommentProps) {
    const [commentText, setCommentText] = useState("");

    const submitComment = async () => {
        if (!commentText.trim()) return;
        const created_at = new Date().toISOString();
        const commentData = { username, news_id, comment_text: commentText, created_at };

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (response.ok) {
                setCommentText("");
                refreshComments();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            submitComment();
        }
    };

    return React.createElement(
        'div',
        { className: 'create-post-comment' },
        React.createElement(
            'div',
            { className: 'post-line' },
            React.createElement(
                'div',
                { className: 'post-photo' },
                React.createElement(Avatar, { name: username, size: '100%', round: true })
            ),
            React.createElement('textarea', {
                className: "create-post-comment-textarea",
                placeholder: "Add a comment...",
                value: commentText,
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value),
                    onKeyDown: handleKeyDown
            },

            ),
        )
    );
}

export default WriteComment;
