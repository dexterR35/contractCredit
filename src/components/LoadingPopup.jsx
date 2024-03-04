import React from "react";

const LoadingPopup = ({ isLoading }) => {
  return (
    <div className={`loading-popup ${isLoading ? 'active' : ''}`}>
      <div className="loading-spinner">fgas</div>
      <p>Multumim</p>
    </div>
  );
};

export default LoadingPopup;