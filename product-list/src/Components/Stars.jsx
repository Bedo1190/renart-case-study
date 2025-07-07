import { Rating } from "react-simple-star-rating";
import "../Styles/Stars.css";

export default function Stars({
  count = 5,
  defaultRating = 0,
  color = "#FACC6B",
  iconSize = 14,
}) {
  const ratingOutOfFive = Math.round((defaultRating * 5 + Number.EPSILON) * 10) / 10;

  return (
    <div className="starsContainer">
      <Rating
        initialValue={ratingOutOfFive}
        readonly
        allowFraction
        size={iconSize}
        fillColor={color}
        emptyColor="grey"
        SVGstyle={{ display: "inline-block" }}
        style={{ marginRight: "5px" }}
      />
      <p>{ratingOutOfFive.toFixed(1) +'/5'}</p>
    </div>
  );
}
