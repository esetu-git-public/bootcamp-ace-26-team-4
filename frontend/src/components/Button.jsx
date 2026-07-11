import React from "react";
import "../styles/Button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      className={`custom-btn ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;