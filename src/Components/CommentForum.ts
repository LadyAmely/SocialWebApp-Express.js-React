import React, { useEffect, useState } from 'react';
import "../css/components/comments.css";
import Avatar from "react-avatar";
import WriteForumComment from './WriteForumComment';

interface CommentsForumProps {
    postId: number;
    username: string;
}

function CommentForum({ postId, username }: CommentsForumProps) {
    const [comments, setComments] = useState<any[]>([]);


    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments-forum-posts/${postId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            setComments(data);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };


    useEffect(() => {
        fetchComments();
    }, [postId]);

    const commentItems = comments.map(comment =>
        React.createElement('li', { key: comment.comment_id, className: 'comment' },
            React.createElement('div', { className: 'comment-avatar' },
                React.createElement(Avatar, { name: comment.username, size: '20', round: true })
            ),
            React.createElement('div', { className: 'comment-user-info' },
                React.createElement('span', null, comment.timestamp)
            ),
            React.createElement('p', { className: 'comment-content' }, comment.comment_text)
        )
    );

    return React.createElement(
        'div',
        { className: 'comment-section' },
        React.createElement(WriteForumComment, {
            username: username,
            forum_post_id: postId,
            refreshComments: fetchComments
        }),
        React.createElement('ul', null, commentItems)
    );
}

export default CommentForum;