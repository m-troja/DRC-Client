import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";
import Players from "../Players";
import AllAnswers from "../AllAnswers";
import Question from "../Question";
import AllAnswersAdmin from "../AllAnswersAdmin";

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
    const [isKicked, setIsKicked] = useState(false);
    const [players, setPlayers] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [gameId, setGameId] = useState(-1);
    const [question, setQuestion] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    const [stompClient, setStompClient] = useState(null);
    const [pingInterval, setPingInterval] = useState(null);

    // CONFIG VARIABLES
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const pingIntervalMilliseconds = 5000;

    // Getting username from url
    const params = useParams();
    if (!username) {
        username = params.username;
    }

    // CONNECTION FUNCTIONS ========================================
    const url = `${serverAddress}/game?username=${username}&role=${role}`;

    console.log(`Connecting to ${url}`);

    useEffect(() => {
        if (!isConnected && !stompClient) {
            const client = new Client({ webSocketFactory: () => new SockJS(url) });

            client.onConnect = () => {
                setIsConnected(true);
                setStompClient(client);

                console.log("Successfully connected to websocket");

                if(role === "admin") {
                    // Get already connected users
                    getAndDisplayAlreadyConnectedUsers();
                }

                // Subscribe admin events
                client.subscribe(`/user/${username}/queue/admin-event`, (message) => {
                    const eventData = JSON.parse(message.body);
                    console.log("Recieved admin event: " + eventData);

                    // Update players list
                    if (role === "admin" && eventData.messageType === "USER_CONNECTED") {
                        console.log(`User connected: ${eventData.user.name}`);

                        setPlayers(prev => [...prev, eventData.user]);
                    }
                    else if (role === "admin" &&  eventData.messageType === "USER_DISCONNECTED") {
                        console.log(`User disconnected: ${eventData.user.name}`);

                        setPlayers(prev => prev.filter(u => u.name !== eventData.user.name));
                    }
                });

                // Subscribe to all answers
                client.subscribe(`/user/${username}/queue/all-answers`, (message) => {
                    setAnswers(JSON.parse(message.body));
                });

                // Kick from the web socket on request
                client.subscribe(`/user/${username}/queue/kick`, (message) => {
                    console.log("Kicked from game");

                    setIsKicked(true);
                    disconnectFromWebSocket();
                    }
                )

                // Update current question
                client.subscribe(`/client/question`, (message) => {
                    console.log("Received question: " + message.body);
                    const eventData = JSON.parse(message.body);

                    setQuestion(eventData.text);
                })
            };

            client.onDisconnect = () => {
                console.log("Disconnected from websocket");

                cleanUpConnection();
            }

            client.onWebSocketClose = () => {
                console.log("Disconnected from websocket");

                cleanUpConnection()
            }

            client.onStompError = (frame) => {
                console.error('STOMP ERROR:', frame);
                cleanUpConnection();
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
            }, pingIntervalMilliseconds);
            setPingInterval(pingInterval);

            // Cleaning up
            return () => {
                cleanUpConnection();
            };
        }
    }, []);

    /**
     * Use this function to disconnect from the websocket
     */
    function disconnectFromWebSocket() {
        if(stompClient.connected) {
            console.log("Disconnecting from websocket");
            stompClient.deactivate();

            cleanUpConnection();
        }
    }

    /**
     * Use this function to clean up the connection
     */
    function cleanUpConnection() {
        setIsConnected(false);
        setStompClient(null);
        clearInterval(pingInterval);
    }

    // ADMIN FUNCTIONS =============================================
    function startGame(e) {
        axios.get(`${serverAddress}/v1/admin/cmd?cmd=START_GAME`)
            .then(response => {
                console.log(response.data);

                setGameId(response.data.gameId)
            })
            .catch(error => {
                console.error(error);
            });
    }

    function nextQuestion(e) {
        const game = gameId.valueOf();

        console.log("Sending next question request");

        axios.get(`${serverAddress}/v1/admin/next-question?gameId=${game}`)
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
                    setPlayers(nonAdminUsers);
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    function findNewCheater() {
        const game = gameId.valueOf();

        axios.get(`${serverAddress}/v1/admin/draw-cheater?gameId=${game}`)
            .then(response => {
                console.log("Requested a new cheater");
            })
            .catch(error => {
                console.error(error);
            });
    }

    // RENDER ======================================================
    if (isKicked) {
        return <Navigate to={`/kicked/${username}`} replace />
    }

    if (role === "admin") {
        return (
            <div className="container">
                <div className="mx-auto bg-body-tertiary text-light p-5 rounded gap-2">
                    <div className="d-flex gap-2 py-3">

                        {gameId === -1 && (
                            <button type="button" className="btn btn-primary" onClick={startGame}>Start game</button>
                        )}

                        {gameId !== -1 && (
                            <>
                                <button type="button" className="btn btn-primary" onClick={nextQuestion}>Next question</button>
                                <button type="button" className="btn btn-primary" onClick={() => findNewCheater()}>Find a new Cheater</button>
                            </>
                        )}

                    </div>

                    <Players players={players} setPlayers={setPlayers} selectedUser={selectedUser}
                             setSelectedUser={setSelectedUser}/>

                    <hr/>

                    <Question question={question}/>

                    {answers.length > 0 && (
                        <AllAnswersAdmin answers={answers} selectedUser={selectedUser}/>
                    )}
                </div>
            </div>)
    }

    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="mx-auto bg-body-tertiary text-light p-5 rounded gap-2">

                <Question question={question}/>

                {answers.length > 0 && (
                    <AllAnswers answers={answers}/>
                )}

            </div>
        </div>
    );
}

export default Panel;