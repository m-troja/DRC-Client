import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

/**
 * Component is used to let a user know that he/she has been kicked from the game
 *
 * @returns {JSX.Element}
 */
function Kicked({username}) {
    const [message, setMessage] = React.useState('');

    const params = useParams();
    if (!username) {
        username = params.username;
        username = username.toLowerCase();
    }

    useEffect(() => {
        if(username === "kuba") {
            setMessage("Zostałeś wyeliminowany");
        }
        else if(username.endsWith("a")) {
            setMessage("Zostałaś wyeliminowana");
        }
        else {
            setMessage("Zostałeś wyeliminowany");
        }
        }, [username]
    )

    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="mx-auto bg-body-tertiary text-light p-5 rounded gap-2">
                <h1> {message} </h1>
            </div>
        </div>

    )
}

export default Kicked;