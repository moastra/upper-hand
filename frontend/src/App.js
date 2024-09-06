import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import PlayNow from "./components/PlayNow";
import Nav from "./components/Nav";
import Privacy from "./components/Privacy";
import AccountDetails from "./components/AccountDetails";
import SetAvatar from "./components/SetAvatar";
import FindMatch from "./components/FindMatch";
import LocalGame from "./components/LocalGame";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatVideo from "./components/ChatVideoLayout";
import Chat from "./components/ChatLayout";


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/playnow" element={<PlayNow />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accountdetails" element={<AccountDetails />} />
          <Route path="/setavatar" element={<SetAvatar />} />

{/* All stuff which only needs chat function */}
          <Route element={<Chat />}>
            <Route path="/findmatch" element={<FindMatch />} /> {/* Outlet stuff, works great love it */}
          </Route>

{/* All stuff that needs both chat and video function */}
          <Route element={<ChatVideo />}>
            <Route path="/localgame" element={<LocalGame />} />
          </Route>

          <Route
            path="*"
            element={<h1>No lizards, nor Spock to be found :/</h1>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
