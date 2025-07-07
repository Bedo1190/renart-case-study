import { useRef } from "react";
import "../Styles/Carousel.css";
import Card from "./Card";

function Carousel() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="carouselWrapper">
      <div className="arrow arrow_left" onClick={scrollLeft}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      <div className="carouselContainer" ref={scrollRef}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <div className="arrow arrow_right" onClick={scrollRight}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
}

export default Carousel;
