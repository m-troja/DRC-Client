import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function ChatComponent() {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://127.0.0.1:8080/chat'),
      connectHeaders: { username: 'TestUser', role: 'ROLE_USER' },
    });

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe('/client/messages', (message) => {
        setMessages((prev) => [...prev, JSON.parse(message.body)]);
      });
    };

    client.onDisconnect = () => setIsConnected(false);
    client.onWebSocketClose = () => setIsConnected(false);
    client.onStompError = (frame) => console.error('STOMP ERROR:', frame);

    client.activate();
    setStompClient(client);

    return () => { client.deactivate(); };
  }, []);

  const sendMessage = () => {
    if (stompClient && isConnected && input.trim()) {
      stompClient.publish({
        destination: '/server/chat',
        body: JSON.stringify({ from: 'TestUser', text: input }),
      });
      setInput('');
    }
  };

  return (
      <div>
        <div>
          <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
          />
          <button onClick={sendMessage} disabled={!isConnected || !input.trim()}>
            Send
          </button>
        </div>
        <div>
          <h3>Responses:</h3>
          <ul>
            {messages.map((msg, idx) => (
                <li key={idx}>
                  <strong>{msg.from}:</strong> {msg.text}
                </li>
            ))}
          </ul>
        </div>
        <div>
          Status: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </div>
      </div>
  );
}

export default ChatComponent;