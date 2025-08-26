import axios from "axios";

function Debug() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

    function reset() {
        axios.get(`${serverAddress}/v1/admin/clean-server`)
            .then(response => {
                console.log(response.data);

            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <button className="btn btn-primary" onClick={() => reset()}>Reload</button>
    )

}

export default Debug;