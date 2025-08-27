import axios from "axios";

function AllAnswers({answers, selectedUser}) {

    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

    function userAnswered(answer, value) {
        axios.get(`${serverAddress}/v1/admin/correct-answer-response?value=${value}&username=${selectedUser}`)
            .then(response => {
                console.log("Sent information that user answered correctly");
            })
            .catch(error => {
                console.error(error);
            });
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