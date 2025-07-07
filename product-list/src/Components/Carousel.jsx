// src/components/Carousel.jsx
import { useEffect, useState, useRef } from "react";
import "../Styles/Carousel.css";
import Card from "./Card";

function Carousel() {
  const [rings, setRings] = useState([]);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await fetch("http://localhost:4000/rings"); // Your API URL
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setRings(data);
      } catch (error) {
        console.error("Error fetching rings:", error);
      }
    };

    fetchRings();
  }, []);

  return (
    <div className="carouselWrapper">
      <div className="arrow arrow_left" onClick={scrollLeft}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      <div className="carouselContainer" ref={scrollRef}>
        {rings.map((ring) => (
          <Card key={ring.id} ring={ring} />
        ))}
      </div>

      <div className="arrow arrow_right" onClick={scrollRight}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
}

export default Carousel;
