import React from "react";
import "../styles/LoadingSkeleton.css";

const LoadingSkeleton = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-card"></div>
      <div className="loading-card"></div>
      <div className="loading-card"></div>
    </div>
  );
};

export default LoadingSkeleton;