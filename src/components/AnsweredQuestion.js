function AnsweredQuestion({answersForPlayers}) {
    return (
        <div className="my-3">
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Odpowiedź</th>
                    <th>Wartość</th>
                </tr>
                </thead>
                <tbody>
                {answersForPlayers.map(answer => (
                    <tr key={answer.text}>
                        <td>{answer.text}</td>
                        <td>{answer.value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default AnsweredQuestion;