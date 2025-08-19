import React, { useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import '../App.css';

function ChatComponent() {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);

    const [question, setQuestion] = useState('');

    const role = `user`;
    const url = `http://127.0.0.1:8080/game?username=${encodeURIComponent(username)}&role=${role}`;

    const joinToGame = (e) => {
        e.preventDefault();
        if (!isConnected) {
            const client = new Client({ webSocketFactory: () => new SockJS(url)});

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                client.subscribe('/client/messages', (message) => {
                    setMessages((prev) => [...prev, JSON.parse(message.body)]);
                });

                client.subscribe('/client/question', (message) => {
                    setQuestion((prev) => [...prev, JSON.parse(message.body)]);
                    console.log("GOT QUESTION:");
                    console.log(message.body);
                });

                // Send message after connection
                client.publish({
                    destination: '/server/chat',
                    body: JSON.stringify({ from: 'TestUser', text: username }),
                });
                setUsername('');
            };

            client.onDisconnect = () => setIsConnected(false);
            client.onWebSocketClose = () => setIsConnected(false);
            client.onStompError = (frame) => console.error('STOMP ERROR:', frame);

            client.activate();
        } else if (stompClient && username.trim()) {
            stompClient.publish({
                destination: '/server/chat',
                body: JSON.stringify({ from: 'TestUser', text: username }),
            });
            setUsername('');
        }
    };

    return (
        <div>
            <form className="d-flex gap-2 w-100">
                <input type="text"
                       id="username"
                       className="form-control flex-grow-1"
                       placeholder="Nazwa użytkownika" value={username}
                       onChange={(e) => setUsername(e.target.value)}/>

                <button type="submit"
                        className="btn btn-primary"
                        onClick={joinToGame}>
                        Submit
                </button>
            </form>

            <div className="my-3"></div>

            {isConnected && (
                <div className="alert alert-success">
                    You are connected!
                </div>
            )}
        </div>
    );
}

export default ChatComponent;