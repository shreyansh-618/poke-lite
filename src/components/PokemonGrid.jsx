"use client";
import { motion } from "framer-motion";
import PokemonCard from "./PokemonCard";
import "./PokemonGrid.css";

export default function PokemonGrid({
  pokemon,
  onSelectPokemon,
  favorites,
  onToggleFavorite,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="pokemon-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {pokemon.map((poke, index) => (
        <PokemonCard
          key={poke.id}
          pokemon={poke}
          index={index}
          onSelect={onSelectPokemon}
          isFavorite={favorites.includes(poke.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </motion.div>
  );
}
