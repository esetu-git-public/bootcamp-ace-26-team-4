import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const location = useLocation();

  const hideNavbarFooter = location.pathname === "/";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <main className="main-content">
        <AppRoutes />
      </main>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;