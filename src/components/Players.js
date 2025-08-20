import React, {useEffect} from "react";

function Players(props){

    useEffect(() => {
        console.log("Players updated:", props.players);
    }, [props.players]);

    if (props.players.length === 0) {
        return <div>No players connected.</div>;
    }

    return (
        <table className="table my-3">
            <tbody>
            {props.players.map(user => (
                <tr key={user}>
                    <td>{user}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Players;