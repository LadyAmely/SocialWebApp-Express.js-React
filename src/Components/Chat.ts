import React, { useEffect, useRef, useState } from 'react';
import "../css/components/chat.css";

function Chat({ user }: { user: string }): React.ReactElement {
    const [messages, setMessages] = useState<{ text: string, type: string }[]>([]);
    const [input, setInput] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);


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

        /*

        ws.current.onclose = (event) => {
            console.log('WebSocket Closed:', event);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket connection closed during cleanup');
            }
        };

         */
    }, []);



    /*
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:5000');

        ws.current.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);

            // Start sending pings every 30 seconds
            const pingInterval = setInterval(() => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send('ping');
                    console.log('Ping sent to server');
                }
            }, 30000); // 30 seconds

            return () => clearInterval(pingInterval);
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = event.data;
            console.log('Received Message:', receivedMessage);
            setMessages((prevMessages) => [...prevMessages, { text: receivedMessage, type: 'received' }]);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket Closed:', event);
            setIsConnected(false);
            // Opcjonalnie spróbuj nawiązać ponowne połączenie
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                ws.current = new WebSocket('ws://localhost:5000');
            }, 5000); // 5 seconds
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket connection closed during cleanup');
            }
        };
    }, []);

     */


    /*
    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {

            setMessages((prevMessages) => [...prevMessages, { text: input, type: 'sent' }]);
            //ws.current.send(input);
            const message = input;
            setInput('');

        } else {
            console.log('WebSocket is not open or input is empty');
        }
    };

     */

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {
            try {
                ws.current.send(input);
                console.log('Sent Message:', input);
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



    /*
    const sendMessage = () => {

        if(ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()){
            setMessages((prevMessages) => [...prevMessages, { text: input, type: 'sent' }]);
            setInput('');
            ws.current.send(input);
        } else{
            console.log('WebSocket is not open or input is empty');
        }


    };

     */



    /*


    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {
            ws.current.send(input);
            console.log('Sent Message:', input);
            setMessages((prevMessages) => [...prevMessages, { text: input, type: 'sent' }]);
            setInput('');
        } else {
            console.log('WebSocket is not open or input is empty');
        }
    };

     */



    return React.createElement(
        'div',
        { className: 'chat-container' },
        createChatHeader(user),
        createMessageList(messages),
        createChatInput(input, setInput, sendMessage)
    );
}


function createChatHeader(user: string): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'chat-header' },
        React.createElement('h3', null, `Chat with ${user}`)
    );
}


function createMessageList(messages: { text: string; type: string }[]): React.ReactElement {
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
