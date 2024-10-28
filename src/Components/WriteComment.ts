import React, { useEffect, useState } from 'react';
import Avatar from "react-avatar";

interface writeCommentProps{
    username: string,
}

function WriteComment({username}: writeCommentProps){

    return React.createElement('div', { className: 'create-post-comment' },
        React.createElement('div', { className: 'post-line' },
            React.createElement('div', { className: 'post-photo' },
               React.createElement(Avatar, { name: username, size: '100%', round: true }),
            ),
            React.createElement('textarea', {
                className: "create-post-comment-textarea",
                placeholder: "Add a comment...",
            }),
        )
    )

}

export default WriteComment;