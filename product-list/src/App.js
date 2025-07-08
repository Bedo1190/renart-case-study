import { useState } from 'react';
import Carousel from './Components/Carousel';
import Filtering from './Components/Filtering'; 
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minScore: '',
    maxScore: ''
  });

  const handleApplyFilters = (newFilters) => {
    const convertedFilters = {
      ...newFilters,
      minScore: newFilters.minScore
        ? (parseFloat(newFilters.minScore) / 5).toFixed(2)
        : "",
      maxScore: newFilters.maxScore
        ? (parseFloat(newFilters.maxScore) / 5).toFixed(2)
        : "",
    };
    setFilters(convertedFilters);
  };

  return (
    <div className="App">
      <h1 className='Pagetitle'>Product List</h1>
      <Carousel filters={filters} />
      <Filtering onApply={handleApplyFilters} />
    </div>
  );
}

export default App;
