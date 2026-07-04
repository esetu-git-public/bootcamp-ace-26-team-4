import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Search from "../pages/Search";
import Chat from "../pages/Chat";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/search" element={<Search />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;