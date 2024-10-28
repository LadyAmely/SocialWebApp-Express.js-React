import React, { useEffect, useRef, useState } from 'react';
import "../css/components/chat.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import Avatar from "react-avatar";

function Chat({ user }: { user: string }): React.ReactElement {
    const [messages, setMessages] = useState<{ text: string, type: string}[]>([]);
    const [input, setInput] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(true);

    const closeChat = () => {
        setIsChatOpen(false);
    };

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:5000');
        ws.current.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = event.data;
            console.log('Received Message:', receivedMessage);
            setMessages((prevMessages) => [...prevMessages, { text: receivedMessage, type: 'received' }]);
        };


        ws.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };


    }, []);


    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {

            const message = JSON.stringify({
                targetUsername: user,
                message: input,

            });

            try {

                ws.current.send(message);
                console.log('Sent Message:', message);


                setMessages((prevMessages) => [...prevMessages, { text: input, type: 'sent' }]);
                setInput('');
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Wystąpił błąd podczas wysyłania wiadomości. Sprawdź konsolę.');
            }
        } else {
            console.log('WebSocket is not open or input is empty');
        }
    };

    return React.createElement(
        'div',
        { className: 'chat-container' },
        createChatHeader(user),
        createMessageList(messages),
        createChatInput(input, setInput, sendMessage),

    );
}


function createChatHeader(user: string): React.ReactElement {

    return React.createElement(
        'div',
        { className: 'chat-header' },
        React.createElement(Avatar, { name: `${user}`, size: '30', round: true }),
        React.createElement('p', {style:{marginRight: 'auto', marginLeft: '10px'} }, `${user}`,
         React.createElement('button', {className:"chat-close-btn"},
             React.createElement(FontAwesomeIcon, { icon: faTimes }),
             )
        )
    );
}


function createMessageList(messages: { text: string; type: string}[]): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'chat-messages' },
        messages.map((message, index) =>
            React.createElement(
                'div',
                { key: index, className: `message ${message.type}` },
                React.createElement('p', null, message.text)
            )
        )
    );
}


function createChatInput(
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    sendMessage: () => void
): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'chat-input' },
        React.createElement('input', {
            type: 'text',
            placeholder: 'Write a message...',
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: (e) => {
                if (e.key === 'Enter') sendMessage();
            }
        }),
        React.createElement(
            'button',
            { onClick: sendMessage },
            'Send'
        )
    );
}

export default Chat;