import axios from "axios";

const API_BASE = "https://pokeapi.co/api/v2";

/**
 * Fetch a list of Pokémon (name + url only).
 * Keep the limit sane – 300–600 is more than enough for a Pokedex UI.
 */
export const fetchAllPokemon = async (limit = 500) => {
  try {
    const response = await axios.get(`${API_BASE}/pokemon?limit=${limit}`);
    return response.data.results; // [{ name, url }, ...]
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
    throw error; // if this fails, we truly have nothing to show
  }
};

/**
 * Fetch full details for a Pokémon.
 * On failure we DO NOT throw – we return null so the app can skip bad entries
 * instead of crashing the whole load.
 */
export const fetchPokemonDetails = async (nameOrId) => {
  try {
    const response = await axios.get(`${API_BASE}/pokemon/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.warn(
      `Skipping Pokémon "${nameOrId}", failed to fetch details:`,
      error
    );
    return null; // critical change: do NOT break the whole app
  }
};

/**
 * Get all Pokémon belonging to a specific type.
 * You can use this if you ever move filtering to the API instead of client side.
 */
export const getPokemonsByType = async (type) => {
  try {
    const response = await axios.get(`${API_BASE}/type/${type}`);
    // API returns { pokemon: [{ pokemon: { name, url }, slot }, ...] }
    return response.data.pokemon.map((p) => p.pokemon);
  } catch (error) {
    console.error(`Error fetching ${type} type Pokemon:`, error);
    throw error;
  }
};
