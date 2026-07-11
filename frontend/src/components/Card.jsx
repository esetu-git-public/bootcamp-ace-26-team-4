import React from "react";
import "../styles/Card.css";

const Card = ({ children }) => {
  return (
    <div className="custom-card">
      {children}
    </div>
  );
};

export default Card;