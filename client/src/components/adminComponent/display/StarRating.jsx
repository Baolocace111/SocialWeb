import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const StarRating = ({ rate }) => {
  return (
    <div className="rate">
      {Array.from({ length: rate }, (_, i) => (
        <FontAwesomeIcon key={`star_${rate}_${i}`} icon={faStar} />
      ))}
    </div>
  );
};

export default StarRating;