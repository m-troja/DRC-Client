import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Panel from "./components/userPanel/Panel";
import Join from "./components/join/Join";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Join/> } />
                <Route path="/user/:username" element={ <Panel role="user"/> } />
                <Route path="/admin" element={ <Panel username="ADMIN" role="admin"/> } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;