/**
 * Component is used to display the list of players in the lobby in admin view
 *
 * @param players - list of players it's a useState of users
 * @param setPlayers - function to update the list of players
 * @returns {JSX.Element}
 */
import axios from "axios";

function Players({ players, setPlayers, selectedUser, setSelectedUser}) {

    // CONFIG VARIABLES
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

    function kickUser(name) {
        axios.get(`${serverAddress}/v1/admin/kick?name=${name}`)
            .then(response => {
                console.log("> Sent request to kick user: " + name);
                setPlayers(prev => prev.filter(u => u.name !== name));
            })
            .catch(error => {
                console.error(error);
            });
    }

    function selectUser(name) {
        setSelectedUser(name);
    }

    return (
        <div className="my-3">
            <h2> Players: </h2>
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Money</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {players.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.money}</td>
                        <td>
                            <div className="d-flex gap-2">
                                <button type="button" className={`btn ${selectedUser === user.name ? "btn-warning" : "btn-secondary"}`} onClick={() => selectUser(user.name)}> {selectedUser === user.name ? "Selected" : "Select"} </button>
                                <button type="button" className="btn btn-danger" onClick={() => kickUser(user.name)}> Kick </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Players;

