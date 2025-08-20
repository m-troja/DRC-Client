import {BrowserRouter, Route, Routes} from 'react-router-dom';

import './App.css';
import PlayerPanel from "./panels/PlayerPanel";
import AdminPanel from "./panels/AdminPanel";

function App() {
  return (
      <div className="app container py-4 bg-body-tertiary rounded-3 my-5">

          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<PlayerPanel className="px-3"/>} />
                  <Route path="/admin" element={<AdminPanel />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;