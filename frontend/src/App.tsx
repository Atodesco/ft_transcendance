import React, { Profiler } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Credits from "./pages/Credits";
import Friendlist from "./pages/Friendlist";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import PlayGame from "./pages/PlayGame";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";

function App() {
  const DefaultRoutes = () => {
    return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/PlayGame" element={<PlayGame />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/Friendlist" element={<Friendlist />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Credits" element={<Credits />} />
          {/* DANS SETTINGS IL Y AURA LOGOUT*/}
          <Route path="/Settings" element={<Settings />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </div>
    );
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<DefaultRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
