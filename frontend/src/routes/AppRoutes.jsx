import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Search from "../pages/Search";
import About from "../pages/About";
import Analytics from "../pages/Analytics";

import NotFound from "../pages/NotFound";

function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/chat"
        element={<Chat />}
      />

      <Route
        path="/search"
        element={<Search />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

}

export default AppRoutes;