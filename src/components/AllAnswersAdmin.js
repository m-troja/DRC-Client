function AllAnswers({answers, selectedUser}) {

    function userAnswered(answer, value) {
        alert(`User ${selectedUser} answered ${answer} with value ${value}`)
    }

    return (
        <div className="my-3">
            <table className="table my-3">
                <thead>
                <tr>
                    <th>Answer</th>
                    <th>Value</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {answers.map(answer => (
                    <tr key={answer.text}>
                        <td>{answer.text}</td>
                        <td>{answer.value}</td>
                        <td>
                            <button type="button" className="btn btn-primary" disabled={!selectedUser} onClick={() => userAnswered(answer.text, answer.value)}> User Answered </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default AllAnswers;