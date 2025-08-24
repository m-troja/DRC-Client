import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
import {useParams} from "react-router-dom";
import Players from "../Players";

/**
 * Component is used as the main panel for users. It changes the content based on the role
 *
 * @param username - username that will be used to communicate with the server. We can pass it during the creation of the component or get it from the url
 * @param role - role of the user. It can be admin or user
 * @returns {JSX.Element}
 */
function Panel({username, role}) {

    // Use states
    const [isConnected, setIsConnected] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const [players, setPlayers] = useState([]);

    // CONFIG VARIABLES
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const pingIntervalMiliseconds = 5;

    // Getting username from url
    const params = useParams();
    if (!username) {
        username = params.username;
    }

    const url = `${serverAddress}/game?username=${username}&role=${role}`;

    useEffect(() => {
        if (!isConnected && !stompClient) {
            const client = new Client({ webSocketFactory: () => new SockJS(url) });

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                console.log("Succesfully connected to websocket");

                switch (role) {
                    case "admin":
                        // Get already connected users
                        getAndDisplayAlreadyConnectedUsers();

                        // Subscribe admin events
                        client.subscribe(`/user/${username}/queue/admin-event`, (message) => {
                            const eventData = JSON.parse(message.body);

                            // Update players list
                            if (eventData["New user connected"]) {
                                console.log(`New player connected: ${eventData["New user connected"]}`);

                                // TODO replace this get method when Michał will update response from joining subscription

                                axios.get(`${serverAddress}/v1/user?name=${eventData["New user connected"]}`)
                                    .then(response => {
                                        setPlayers(prev => [...prev, response.data]);
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            } else if (eventData["User disconnected"]) {
                                console.log(`User disconnected: ${eventData["User disconnected"]}`);
                                setPlayers(prev => prev.filter(u => u.name !== eventData["User disconnected"]));
                            }
                        });
                        break;
                    case "user":
                        // PLACEHOLDER
                        break;
                }
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

            // SENDING PING to keep connection alive
            const pingInterval = setInterval(() => {
                if (client.connected) {
                    console.log("Sending ping");

                    client.publish({
                        destination: '/server/ping',
                        body: JSON.stringify({ ping: Date.now()}),
                    });
                }
            }, pingIntervalMiliseconds);

            // Cleaning up
            return () => {
                clearInterval(pingInterval);
                client.deactivate();
            };
        }
    }, []);

    // =================== ADMIN FUNCTIONS ===================
    function startGame(e) {
        axios.get(`${serverAddress}/v1/admin/cmd?cmd=START_GAME`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function getAndDisplayAlreadyConnectedUsers() {
        axios.get(`${serverAddress}/v1/users?gameId=0`)
            .then(response => {
                response.data.forEach(user => {
                    const nonAdminUsers = response.data.filter(user => user.roleName !== "ROLE_ADMIN");
                    console.log(nonAdminUsers);
                    setPlayers(nonAdminUsers);
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    // =================== RENDER ===================
    return(
        <div className="container">
            <h1 className="display-4">Hello {username}</h1>

            <div className="my-3"></div>

            {
                isConnected && (
                    <div className="alert alert-success">
                        You are connected!
                    </div>
                )
            }

            {role === "admin" && (
                <>
                    <button type="button" className="btn btn-primary" onClick={startGame}>Start game</button>

                    <Players players={players}/>
                </>
            )}

        </div>
    );
}

export default Panel;