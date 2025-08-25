function AllAnswers({answers}) {

    return (
        <div className="my-3">
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Answer</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {answers.map(answer => (
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

export default AllAnswers;