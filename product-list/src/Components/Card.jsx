import "../Styles/Card.css";
import Stars from "./Stars";
import { useState } from "react";

function Card({ ring }) {
  const [selectedGold, setSelectedGold] = useState("yellow");

  const handleChange = (e) => {
    setSelectedGold(e.target.value);
  };

  const goldOptions = ["yellow", "white", "rose"];
  const goldLabels = {
    yellow: "Yellow Gold",
    white: "White Gold",
    rose: "Rose Gold",
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={ring?.images?.[selectedGold] || ""}
          alt={ring?.name || "Ring"}
        />
      </div>

      <div className="product-info">
        <h3>{ring.name}</h3>
        <p className="price">{ring.priceUSD}$</p>
      </div>

      <form>
        {goldOptions.map((color) => (
          <div className="radio-wrapper" key={color}>
            <input
              type="radio"
              id={`${ring.id}-${color}`}              
              name={`gold-${ring.id}`}               
              value={color}
              onChange={handleChange}
              checked={selectedGold === color}
            />
          </div>
        ))}
      </form>

      <p className="selected-gold-text">{goldLabels[selectedGold]}</p>

     <Stars defaultRating={ring.popularityScore} iconSize={14} />
    </div>
  );
}

export default Card;
