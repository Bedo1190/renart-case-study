import { useState, useRef } from "react";
import "../Styles/Filtering.css";

function Filtering({ onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    pricemin: "",
    pricemax: "",
    popmin: "",
    popmax: "",
  });
  const [hasChanged, setHasChanged] = useState(false);
  const filterRef = useRef(null);

  const toggleFilters = () => {
    if (hasChanged) {
      onApply({
        minPrice: inputs.pricemin,
        maxPrice: inputs.pricemax,
        minScore: inputs.popmin,
        maxScore: inputs.popmax,
      });
      setHasChanged(false);
      setIsOpen(false);
    } else {
      setIsOpen(prev => {
        const newState = !prev;
        if (!prev) {
          setTimeout(() => {
            window.scrollBy({ top: 99999, behavior: "smooth" });
          }, 400);
        }
        return newState;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedInputs = {
      ...inputs,
      [name]: value,
    };

    setInputs(updatedInputs);

    const isAnyNonZero = Object.values(updatedInputs).some(val => parseFloat(val) > 0);
    setHasChanged(isAnyNonZero);
  };

  return (
    <div className="filter-wrapper">
      <button className="filter-toggle-button" onClick={toggleFilters}>
        {hasChanged ? "Apply Changes" : isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div
        ref={filterRef}
        className={`filter-bar-container ${isOpen ? "expanded" : ""}`}
      >
        <div className="filter-bar">
          <div className="filter-section">
            <h2>Price</h2>
            <div className="field-pair">
              <label htmlFor="pricemin">Min</label>
              <input
                type="number"
                id="pricemin"
                name="pricemin"
                min="0"
                placeholder="0.00$"
                value={inputs.pricemin}
                onChange={handleInputChange}
              />
            </div>
            <div className="field-pair">
              <label htmlFor="pricemax">Max</label>
              <input
                type="number"
                id="pricemax"
                name="pricemax"
                min="0"
                placeholder="0.00$"
                value={inputs.pricemax}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <h2>Popularity</h2>
            <div className="field-pair">
              <label htmlFor="popmin">Min</label>
              <input
                type="number"
                id="popmin"
                name="popmin"
                min="0"
                placeholder="0"
                value={inputs.popmin}
                onChange={handleInputChange}
              />
            </div>
            <div className="field-pair">
              <label htmlFor="popmax">Max</label>
              <input
                type="number"
                id="popmax"
                name="popmax"
                min="0"
                placeholder="0"
                value={inputs.popmax}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="reset-container">
            <button
                className="reset-button"
                onClick={() => {
                    setInputs({
                    pricemin: "",
                    pricemax: "",
                    popmin: "",
                    popmax: "",
                    });
                    setHasChanged(false);
                    onApply({
                    minPrice: "",
                    maxPrice: "",
                    minScore: "",
                    maxScore: "",
                    });
                }}
                >
                Reset
            </button>
         </div>
        </div>
      </div>
    </div>
  );
}

export default Filtering;
