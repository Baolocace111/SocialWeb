import React, { useState } from "react";
import "./rateStarInput.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RateStarInput = ({ onHandle }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  return (
    <div className="starInput">
      {rating}
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => {
                setRating(ratingValue);
                onHandle(ratingValue);
              }}
            />
            <FontAwesomeIcon
              icon={faStar}
              className="star"
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              style={{
                color:
                  ratingValue <= (hover || rating)
                    ? getColor(ratingValue)
                    : "#e4e5e9",
              }}
            />
          </label>
        );
      })}
    </div>
  );
};

// Function to return the color based on the rating value
function getColor(value) {
  const colors = ["#ff4500", "#ffa500", "#ffd700", "#90ee90", "#008000"];
  return colors[value - 1] || "#e4e5e9";
}

export default RateStarInput;
