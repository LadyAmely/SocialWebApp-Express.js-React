import React, { useEffect, useState } from 'react';
import "../css/components/comments.css";
import Avatar from "react-avatar";

interface CommentsProps {
    postId: number;
}

function Comment({postId} : CommentsProps){

    const [comments, setComments] = useState<any[]>([]);
    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await fetch(`/api/comments/${postId}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                setComments(data);
            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        }

        fetchComments();
    }, [postId]);

    const commentItems = comments.map(comment =>
        React.createElement('li', { key: comment.comment_id, className: 'comment' },
            React.createElement('div', { className: 'comment-avatar' },
              //  React.createElement('img', { src: comment.avatar, alt: `${comment.username}'s avatar`, width: 40, height: 40 })
                React.createElement(Avatar, {name: comment.username, size: '40', round: true}),
            ),
            React.createElement('div', { className: 'comment-user-info' },
                React.createElement('span', null, comment.timestamp)
            ),
            React.createElement('p', { className: 'comment-content' }, comment.comment_text),

        )

    );

    return React.createElement('div', {className: 'comment-section'},
        React.createElement('ul', null, commentItems)
    );



}

export default Comment;