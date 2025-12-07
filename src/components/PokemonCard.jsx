"use client";
import { motion } from "framer-motion";
import "./PokemonCard.css";

export default function PokemonCard({
  pokemon,
  index,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(255, 0, 81, 0.4)",
    },
  };

  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return (
    <motion.div
      className="pokemon-card glass"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onSelect(pokemon)}
    >
      <div className="card-header">
        <span className="pokemon-id">
          #{pokemon.id?.toString().padStart(3, "0")}
        </span>
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pokemon.id);
          }}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-image-container">
        <img
          src={
            pokemon.image ||
            "/placeholder.svg?height=150&width=150&query=pokemon"
          }
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>

      <div className="card-content">
        <h3 className="pokemon-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>

        <div className="type-badges">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="type-badge"
              style={{
                backgroundColor: typeColors[type] || "#999",
                opacity: 0.8,
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>

        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-label">HP</span>
            <span className="stat-value">
              {pokemon.stats?.[0]?.base_stat || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ATK</span>
            <span className="stat-value">
              {pokemon.stats?.[1]?.base_stat || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">DEF</span>
            <span className="stat-value">
              {pokemon.stats?.[2]?.base_stat || 0}
            </span>
          </div>
        </div>

        {pokemon.isLegendary && (
          <div className="legendary-badge glow-yellow">⭐ LEGENDARY</div>
        )}
      </div>
    </motion.div>
  );
}
