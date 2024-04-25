import React, { useState } from "react";
import "./hoverComponent.scss";
const HoverComponent = ({ defaultComponent, hoverComponent }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="hovercom"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <div className="onhover">{hoverComponent}</div>
      ) : (
        <div className="outhover">{defaultComponent}</div>
      )}
    </div>
  );
};
export default HoverComponent;
