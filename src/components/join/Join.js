import React from "react";
import {useNavigate} from "react-router-dom";

/**
 * Component is used to get the name from the user and redirect it to /user/:username
 *
 * @returns {JSX.Element}
 */
function Join() {
    const [username, setUsername] = React.useState('');
    const [messages, setMessages] = React.useState('');

    const navigate = useNavigate();

    function joinToGame(e) {
        e.preventDefault();

        if (!username) {
            setMessages("Aby kontynuować musisz podać imie");
            return;
        }

        console.log("Joining to game");
        navigate(`/user/${username}`);
    }

    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="mx-auto bg-body-tertiary text-light p-5 rounded gap-2">
                <h1> Czy będziesz kłamczuchem? </h1>

                <form className="d-flex gap-2 w-100 my-3">
                    <input type="text"
                           id="username"
                           className="form-control flex-grow-1"
                           placeholder="Podaj imie" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>

                    <button type="submit"
                            className="btn btn-primary"
                            onClick={joinToGame}>
                        Dołącz
                    </button>
                </form>

                {messages && <div className="alert alert-danger">{messages}</div>}
            </div>
        </div>

    )
}

export default Join;