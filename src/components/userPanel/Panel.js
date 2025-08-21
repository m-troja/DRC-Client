import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
import {useParams} from "react-router-dom";

/**
 * Component is used as the main panel for users. It changes the content based on the role
 *
 * @param username - username that will be used to communicate with the server. We can pass it during the creation of the component or get it from the url
 * @param role - role of the user. It can be admin or user
 * @returns {JSX.Element}
 */
function Panel({username, role}) {
    const [isConnected, setIsConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    // Getting username from url
    const params = useParams();
    if (!username) {
        username = params.username;
    }

    const url = `${process.env.REACT_APP_SERVER_ADDRESS}/game?username=${username}&role=${role}`;

    // TODO romove it to separate component
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!isConnected && !stompClient) {
            const client = new Client({ webSocketFactory: () => new SockJS(url) });

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                console.log("Succesfully connected to websocket");

                // SUBSCRIPTIONS
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

            client.onDisconnect = () => {
                setIsConnected(false);
                console.log("Disconnected from websocket");
            }

            client.onWebSocketClose = () => {
                setIsConnected(false);
            }

            client.onStompError = (frame) => {
                setIsConnected(false);
                console.error('STOMP ERROR:', frame);
            }

            client.activate();

            // SENDING PING
            const pingInterval = setInterval(() => {
                if (client.connected) {
                    console.log("Sending ping");

                    client.publish({
                        destination: '/server/ping',
                        body: JSON.stringify({ ping: Date.now()}),
                    });
                }
            }, 5000);

            // Cleaning up
            return () => {
                clearInterval(pingInterval);
                client.deactivate();
            };
        }
    }, []);

    function startGame(e) {
        axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/v1/admin/cmd?cmd=START_GAME`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return(
        <div className="container">
            <h1 className="display-4">Hello {username}</h1>

            <button type="button" className="btn btn-primary" onClick={startGame}>Start game</button>

            <div className="my-3"></div>

            {
                isConnected && (
                    <div className="alert alert-success">
                        You are connected!
                    </div>
                )
            }

            <div className="my-3">
                <h2> Connected users</h2>
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

        </div>
    );
}

export default Panel;