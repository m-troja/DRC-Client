/**
 * Component is used to display the list of players in the lobby in admin view
 *
 * @param players - list of players it's a useState of users
 * @returns {JSX.Element}
 */

function Players({ players = [] }) {

    return (
        <div className="my-3">
            <h2> Players in lobby </h2>
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Money</th>
                </tr>
                </thead>
                <tbody>
                {players.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.money}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Players;

