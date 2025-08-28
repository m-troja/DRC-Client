function Score({players}) {
    return (
        <div className="my-3">
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Imię</th>
                    <th>Hajsy</th>
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

export default Score;