import { useEffect, useState, useRef } from "react";
import "../Styles/Carousel.css";
import Card from "./Card";

function Carousel({ filters }) {
  useEffect(() => {
    const fetchRings = async () => {
      const params = new URLSearchParams();
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.minScore) params.append("minScore", filters.minScore);
      if (filters.maxScore) params.append("maxScore", filters.maxScore);

      const response = await fetch(`/api/rings?${params}`);
      const data = await response.json();
      setRings(data);
    };

    fetchRings();
  }, [filters]);
  const [rings, setRings] = useState([]);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await fetch("/api/rings"); 
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
