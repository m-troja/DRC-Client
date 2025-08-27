import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Panel from "./components/userPanel/Panel";
import Join from "./components/join/Join";
import Kicked from "./components/Kicked";
import Debug from "./components/Debug";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Join/> } />
                <Route path="/user/:username" element={ <Panel role="user"/> } />
                <Route path="/admin" element={ <Panel username="ADMIN" role="admin"/> } />
                <Route path="/kicked/:username" element={ <Kicked/> } />
                <Route path="/debug" element={ <Debug/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;