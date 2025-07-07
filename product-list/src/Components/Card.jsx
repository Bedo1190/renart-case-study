import "../Styles/Card.css";
import Stars from "./Stars";
import { useState } from "react";

function Card() {
  const [selectedGold, setSelectedGold] = useState("Yellow Gold");

  const handleChange = (e) => {
    setSelectedGold(e.target.value);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src="https://placehold.co/300x300?text=Lamba"
          alt="Modern Masa Lambası"
        />
      </div>

      <div className="product-info">
        <h3>Modern Masa Lambası</h3>
        <p>749.99 TL</p>
      </div>

      <form>
        <div className="radio-wrapper">
          <input
            type="radio"
            id="YellowGold"
            name="gold"
            value="Yellow Gold"
            onChange={handleChange}
            checked={selectedGold === "Yellow Gold"}
          />
        </div>

        <div className="radio-wrapper">
          <input
            type="radio"
            id="WhiteGold"
            name="gold"
            value="White Gold"
            onChange={handleChange}
            checked={selectedGold === "White Gold"}
          />
        </div>

        <div className="radio-wrapper">
          <input
            type="radio"
            id="RoseGold"
            name="gold"
            value="Rose Gold"
            onChange={handleChange}
            checked={selectedGold === "Rose Gold"}
          />
        </div>
      </form>

      <p className="selected-gold-text">{selectedGold}</p>

      <Stars />
    </div>
  );
}

export default Card;
