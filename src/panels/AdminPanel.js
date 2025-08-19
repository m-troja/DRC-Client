import {useEffect} from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

function AdminPanel() {
    const username = `admin`;
    const role = `admin`;
    const url = `http://127.0.0.1:8080/game?username=${encodeURIComponent(username)}&role=${role}`;

    useEffect(() => {
        console.log("Logging as admin to the game")

        const client = new Client({ webSocketFactory: () => new SockJS(url)});

        client.onConnect = () => {
            console.log("Succesfully connected to websocket");
        };

        client.activate();
    });

    return(
        <div>
             <h1>Admin Dashboard</h1>

            <p className="alert alert-warning alert-dismissible fade show"> Work in progress. Right now it's placeholder for an admin dashboard. </p>
         </div>
    );
}

export default AdminPanel;