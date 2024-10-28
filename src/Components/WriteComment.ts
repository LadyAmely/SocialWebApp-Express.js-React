import React, { useEffect, useState } from 'react';
import Avatar from "react-avatar";

interface writeCommentProps{
    username: string,
    news_id: number;
}

function WriteComment({username, news_id}: writeCommentProps){

    const [commentText, setCommentText] = useState("");

    const submitComment = async () => {

        const created_at = new Date().toISOString(); // Current timestamp
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
            }
        } catch (err) {
            console.error(err);
        }
    };


    return React.createElement('div', { className: 'create-post-comment' },
        React.createElement('div', { className: 'post-line' },
            React.createElement('div', { className: 'post-photo' },
               React.createElement(Avatar, { name: username, size: '100%', round: true }),
            ),
            React.createElement('textarea', {
                className: "create-post-comment-textarea",
                placeholder: "Add a comment...",
                value: commentText,
                onChange: (e: { target: { value: React.SetStateAction<string>; }; }) => setCommentText(e.target.value)
            }),
            React.createElement(
                'button',
                {onClick: submitComment},
                'send'
            )
        )
    )

}

export default WriteComment;