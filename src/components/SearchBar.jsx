"use client";
import "./SearchBar.css";

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar glass">
      <input
        type="text"
        placeholder="Search Pokémon by their name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}
