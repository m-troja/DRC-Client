import React from "react";
import axios from "axios";

function ModifyMoney({selectedUser, players}) {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

    const [increseValue, setIncreaseValue] = React.useState(0);

    function divide() {
        players.forEach(player => {
            axios.get(`${serverAddress}/v1/balance?action=DIVIDE&username=${player.name}&value=2`)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

            })
    }

    // TODO Jest tu bug, nie nalicza odpowiedniej ilości hajsu
    function increse() {
        players.forEach(player => {
            axios.get(`${serverAddress}/v1/balance?action=INCREASE&username=${selectedUser}&value=${increseValue}`)
                .then(response => {
                    console.log(`User ${selectedUser} has been given ${increseValue} money`)
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

        })
    }

    return (
        <div>
            <hr/>
            <h2> Modify money </h2>
            <div className="d-flex gap-2 py-3">
                <input type="number" className="form-control" value={increseValue} onChange={(e) => setIncreaseValue(e.target.value)}/>
                <button type="button" className="btn btn-primary" onClick={increse}>Daj premie</button>
                <button type="button" className="btn btn-danger" onClick={divide}>Nałóż kare</button>
            </div>
        </div>

    )
}

export default ModifyMoney;