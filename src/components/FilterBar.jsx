"use client";

import { useState } from "react";
import "./FilterBar.css";

const TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function FilterBar({ selectedType, onTypeChange }) {
  const [showAll, setShowAll] = useState(false);

  const displayedTypes = showAll ? TYPES : TYPES.slice(0, 6);

  return (
    <div className="filter-bar">
      <div className="filter-label">Filter by Type:</div>
      <div className="filter-buttons">
        {displayedTypes.map((type) => (
          <button
            key={type}
            className={`filter-btn ${selectedType === type ? "active" : ""}`}
            onClick={() => onTypeChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        {!showAll && TYPES.length > 6 && (
          <button
            className="filter-btn more-btn"
            onClick={() => setShowAll(true)}
          >
            +{TYPES.length - 6} More
          </button>
        )}
        {showAll && (
          <button
            className="filter-btn more-btn"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
