import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const StarRating = ({ rate }) => {
  return (
    <div className="rate">
      {Array(rate)
        .fill()
        .map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} />
        ))}
    </div>
  );
};
export default StarRating;
