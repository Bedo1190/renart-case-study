import "../Styles/Filtering.css"
import { useState } from "react";

function Filtering() {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="filter-wrapper" style={{ color: "white" }}>
            <button 
                onClick={togglePanel} 
                className="filter-toggle" 
            >
                Filter{" "}
                <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </button>

            {isOpen && (
                <div 
                    className="panel" 
                    style={{ 
                        marginTop: "1rem", 
                        backgroundColor: "#D9D9D9", 
                        padding: "1rem", 
                        borderRadius: "8px"
                    }}
                >
                    <div className="panel-item" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="pricerange" style={{ marginRight: "0.5rem" }}>
                            <i className="fa-solid fa-tags"></i>
                        </label>
                        <input type="range" name="pricerange" id="pricerange" />
                    </div>
                    <div className="panel-item">
                        <button type="button" style={{ marginRight: "0.5rem" }}>Popularity increasing</button>
                        <button type="button">Popularity decreasing</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Filtering;
