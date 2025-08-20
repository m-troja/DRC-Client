import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

function AdminPanel() {
    const [isConnected, setIsConnected] = useState(false);

    const [stompClient, setStompClient] = useState(null);

    const username = `admin`;
    const role = `admin`;
    const url = `http://127.0.0.1:8080/game?username=${encodeURIComponent(username)}&role=${role}`;

    const [users, setUsers] = useState([]);

    const login = (e) => {
        e.preventDefault();
        if (!isConnected) {
            const client = new Client({ webSocketFactory: () => new SockJS(url)});

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                console.log("Succesfully connected to websocket");

                client.subscribe('/user/admin/queue/admin-event', (message) => {
                    const eventData = JSON.parse(message.body);
                    if (eventData["New user connected"]) {
                        console.log(`New player connected: ${eventData["New user connected"]}`);

                        setUsers((prev) => [...prev, eventData["New user connected"]]);
                    }
                    else if (eventData["User disconnected"]) {
                        console.log(`User disconnected: ${eventData["User disconnected"]}`);

                        setUsers(prev => prev.filter(u => u !== eventData["User disconnected"]));
                    }
                });
            };

            client.onDisconnect = () => setIsConnected(false);
            client.onWebSocketClose = () => setIsConnected(false);
            client.onStompError = (frame) => console.error('STOMP ERROR:', frame);

            client.activate();
        }
    };

    return(
        <div>
            <h1>Admin Dashboard</h1>

            <form className="d-flex gap-2 w-100">
                <button type="submit"
                        className="btn btn-primary"
                        onClick={login}>
                    Connect
                </button>
            </form>

            <table className="table my-3">
                <tbody>
                {users.map(user => (
                    <tr key={user}>
                        <td>{user}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;