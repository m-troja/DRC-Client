/**
 * Component is used to display the list of players in the lobby in admin view
 *
 * @param players - list of players it's a useState of users
 * @param setPlayers - function to update the list of players
 * @returns {JSX.Element}
 */
import axios from "axios";

function Players({ players, setPlayers, selectedUser, setSelectedUser, answeredPlayers}) {

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
                    <td>Select</td>
                    <th>Kick</th>
                </tr>
                </thead>
                <tbody>
                {players.map(user => (
                    <tr key={user.id} className={answeredPlayers.includes(user.name) ? "table-success" : ""}>
                        <td>{user.name}</td>
                        <td>{user.money}</td>
                        <td>
                            {
                                !answeredPlayers.includes(user.name) && (
                                    <button type="button" className="btn btn-warning" onClick={() => selectUser(user.name)}> Select </button>
                                )
                            }
                        </td>
                        <td>
                            <button type="button" className="btn btn-danger" onClick={() => kickUser(user.name)}> Kick </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Players;

