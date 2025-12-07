"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import "./DetailModal.css";

export default function DetailModal({
  pokemon,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const backdropRef = useRef(null);
  const cardRef = useRef(null);

  // Animation for card pop-out + floating + rotation
  useEffect(() => {
    if (!cardRef.current) return;

    // Reset any previous transform
    anime.set(cardRef.current, {
      opacity: 0,
      scale: 0.5,
      rotateX: 20,
      rotateY: 0,
    });

    const timeline = anime.timeline();

    // Pop-out animation
    timeline.add({
      targets: cardRef.current,
      opacity: [0, 1],
      scale: [0.5, 1],
      rotateX: [20, 0],
      duration: 600,
      easing: "easeOutElastic(1, .6)",
    });

    // Floating/breathing animation
    timeline.add(
      {
        targets: cardRef.current,
        translateY: [0, -10, 0],
        duration: 4000,
        loop: true,
        easing: "easeInOutSine",
      },
      200
    );
  }, [pokemon.id]);

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

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        ref={backdropRef}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="detail-modal glass glow-red"
          ref={cardRef}
          onClick={(e) => e.stopPropagation()}
          drag
          dragElastic={0.2}
          dragMomentum={false}
        >
          {/* Close Button */}
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>

          {/* Header */}
          <div className="modal-header">
            <div>
              <span className="modal-id">
                #{pokemon.id?.toString().padStart(3, "0")}
              </span>
              <h2 className="modal-name">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h2>
            </div>
            <button
              className={`favorite-btn-large ${isFavorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(pokemon.id);
              }}
            >
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            <div className="modal-image-section">
              <div className="modal-image-container">
                <img
                  src={
                    pokemon.image ||
                    "/placeholder.svg?height=250&width=250&query=pokemon"
                  }
                  alt={pokemon.name}
                  className="modal-image"
                />
              </div>
              {pokemon.isLegendary && (
                <div className="legendary-badge-large glow-yellow">
                  ⭐ LEGENDARY POKÉMON
                </div>
              )}
            </div>

            {/* Info */}
            <div className="modal-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Height</span>
                  <span className="info-value">{pokemon.height / 10}m</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Weight</span>
                  <span className="info-value">{pokemon.weight / 10}kg</span>
                </div>
              </div>

              {/* Types */}
              <div className="section">
                <h3 className="section-title">Type</h3>
                <div className="type-badges-large">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="type-badge-large"
                      style={{ backgroundColor: typeColors[type] || "#999" }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="section">
                <h3 className="section-title">Stats</h3>
                <div className="stats-bars">
                  {pokemon.stats?.map((stat, idx) => {
                    const statNames = [
                      "HP",
                      "ATK",
                      "DEF",
                      "SP.ATK",
                      "SP.DEF",
                      "SPD",
                    ];
                    const percentage = (stat.base_stat / 150) * 100;
                    return (
                      <div key={idx} className="stat-bar-item">
                        <span className="stat-name">{statNames[idx]}</span>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar-fill"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                percentage > 75
                                  ? "#ff0051"
                                  : percentage > 50
                                  ? "#ffed00"
                                  : "#6890F0",
                            }}
                          />
                        </div>
                        <span className="stat-bar-value">{stat.base_stat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Abilities */}
              <div className="section">
                <h3 className="section-title">Abilities</h3>
                <div className="abilities">
                  {pokemon.abilities?.map((ability, idx) => (
                    <div key={idx} className="ability-item">
                      <span>
                        {ability.ability.name.replace("-", " ").toUpperCase()}
                      </span>
                      {ability.is_hidden && (
                        <span className="hidden-badge">Hidden</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
