import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import axios from "axios";

function AdminPanel() {
    const [isConnected, setIsConnected] = useState(false);

    const [stompClient, setStompClient] = useState(null);

    const username = `admin`;
    const role = `admin`;
    const url = `http://127.0.0.1:8080/game?username=${encodeURIComponent(username)}&role=${role}`;

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!isConnected && !stompClient) {
            const client = new Client({ webSocketFactory: () => new SockJS(url) });

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                console.log("Succesfully connected to websocket");

                client.subscribe('/user/admin/queue/admin-event', (message) => {
                    const eventData = JSON.parse(message.body);

                    // Update players list
                    if (eventData["New user connected"]) {
                        console.log(`New player connected: ${eventData["New user connected"]}`);
                        setPlayers(prev => [...prev, eventData["New user connected"]]);
                    } else if (eventData["User disconnected"]) {
                        console.log(`User disconnected: ${eventData["User disconnected"]}`);
                        setPlayers(prev => prev.filter(u => u !== eventData["User disconnected"]));
                    }
                });
            };

            client.onDisconnect = () => setIsConnected(false);
            client.onWebSocketClose = () => setIsConnected(false);
            client.onStompError = (frame) => console.error('STOMP ERROR:', frame);

            client.activate();

            return () => {
                client.deactivate();
            };
        }
    }, []);

    function startGame(e) {
        axios.get('http://127.0.0.1:8080/v1/admin/cmd?cmd=START_GAME')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return(
        <div>
            <h1 className="display-4">Admin Dashboard</h1>

            <button type="button" className="btn btn-primary" onClick={startGame}>Start game</button>


            <table className="table my-3">
                <tbody>
                {players.map(user => (
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