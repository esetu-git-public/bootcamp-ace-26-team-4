import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {

  return (

    <div className="notfound-page">

      <h1>

        404

      </h1>

      <h2>

        Page Not Found

      </h2>

      <p>

        The page you're looking for doesn't exist.

      </p>

      <Link
        to="/home"
        className="home-btn"
      >

        Back to Dashboard

      </Link>

    </div>

  );

}

export default NotFound;