import React, { useState } from "react";
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
import Home from "./components/notLoggedInHome";
import ProtectedRoute from "./components/ProtectedRoutes";
import Customize from "./components/Customize";
import Homepage from "./components/Homepage";
import LoginRegister from "./components/LoginRegister"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />

        <Routes>
          <Route path="/" element={<Homepage />} />


          {/* Makes it so that user needs to be logged in to access dashboard. */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
          <Route path="/dashboard" element={<Dashboard />} />


          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginregister" element={<LoginRegister />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/playnow" element={<PlayNow />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/customize" element={<Customize />} />
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
