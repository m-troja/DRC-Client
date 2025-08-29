import React from "react";

function ControlView({gameId, stompClient}){

    function showAreYouCheater() {
        publish("ARE_YOU_CHEATER");
    }

    function showQuestion() {
        publish("SHOW_QUESTION");
    }

    function showScore() {
        publish("SHOW_SCORE");
    }

    function showButton() {
        publish("SHOW_BUTTON");
    }

    function publish(x) {
        if (stompClient && stompClient.connected) {
            console.log("Sending message: " + x);

            stompClient.publish({
                destination: '/client/command',
                body: JSON.stringify({ "goTo": x}),
            });
        } else {
            console.error("Cannot send message because the client is not connected");
        }
    }


    return (
        <div>
            <hr/>
            <h2> Control View </h2>

            <div className="d-flex gap-2 py-3">
                <button type="button" className="btn btn-primary" onClick={showAreYouCheater}>Are you</button>
                <button type="button" className="btn btn-primary" onClick={showQuestion}>Question</button>
                <button type="button" className="btn btn-primary" onClick={showScore}>Score</button>
                <button type="button" className="btn btn-primary" onClick={showButton}>Button</button>
            </div>
        </div>
    )
}

export default ControlView;
