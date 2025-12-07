import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import PokemonGrid from "./components/PokemonGrid";
import DetailModal from "./components/DetailModal";
import { fetchAllPokemon, fetchPokemonDetails } from "./services/pokeApi";
import { auth, googleProvider } from "./config/firebase";
import "./App.css";

export default function App() {
  // -----------------------------
  // Auth state
  // -----------------------------
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // -----------------------------
  // Pokédex state
  // -----------------------------
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // -----------------------------
  // Firebase auth listener
  // -----------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // -----------------------------
  // Load favorites from localStorage
  // -----------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pokemonFavorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read favorites from localStorage:", e);
    }
  }, []);

  // -----------------------------
  // Fetch initial Pokémon list + details (batched)
  // -----------------------------
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get the base list – keep limit sane
        const baseList = await fetchAllPokemon(500); // tweak if you want fewer/more

        const BATCH_SIZE = 40;
        let allDetails = [];

        // 2. Fetch details in batches to avoid nuking the browser/network
        for (let i = 0; i < baseList.length; i += BATCH_SIZE) {
          const batch = baseList.slice(i, i + BATCH_SIZE);

          const batchDetails = await Promise.all(
            batch.map(async (pokemon) => {
              const details = await fetchPokemonDetails(pokemon.name);
              if (!details) return null; // failed / unsupported -> skip

              const image =
                details.sprites?.other?.["official-artwork"]?.front_default ??
                details.sprites?.front_default ??
                "";

              return {
                ...pokemon,
                id: details.id,
                name: details.name,
                types: details.types.map((t) => t.type.name),
                image,
                stats: details.stats,
                abilities: details.abilities,
                height: details.height,
                weight: details.weight,
                isLegendary: details.stats[5]?.base_stat > 100,
              };
            })
          );

          const validDetails = batchDetails.filter(Boolean);
          allDetails = [...allDetails, ...validDetails];

          // Progressive update so UI doesn't feel frozen while batching
          setPokemonList(allDetails);
          setFilteredPokemon(allDetails);
        }

        // Final safety set
        setPokemonList(allDetails);
        setFilteredPokemon(allDetails);
      } catch (err) {
        console.error("Failed to load Pokémon data:", err);
        setError("Failed to load Pokémon data");
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  // -----------------------------
  // Handle search + type filter
  // -----------------------------
  useEffect(() => {
    let results = pokemonList;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(term));
    }

    if (selectedType !== "all") {
      results = results.filter((p) => p.types.includes(selectedType));
    }

    setFilteredPokemon(results);
    setCurrentPage(0);
  }, [searchTerm, selectedType, pokemonList]);

  // -----------------------------
  // Favorites handling
  // -----------------------------
  const toggleFavorite = (pokemonId) => {
    const updated = favorites.includes(pokemonId)
      ? favorites.filter((id) => id !== pokemonId)
      : [...favorites, pokemonId];

    setFavorites(updated);

    try {
      localStorage.setItem("pokemonFavorites", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save favorites to localStorage:", e);
    }
  };

  const handleToggleFavoritesView = () => {
    setShowFavoritesOnly((prev) => !prev);
    setCurrentPage(0);
  };

  // -----------------------------
  // Auth actions
  // -----------------------------
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will update `user`
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Check console for details.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Apply favorites filter (for "View favorites" mode)
  const visiblePokemon = showFavoritesOnly
    ? filteredPokemon.filter((p) => favorites.includes(p.id))
    : filteredPokemon;

  // Pagination
  const paginatedPokemon = visiblePokemon.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(visiblePokemon.length / ITEMS_PER_PAGE) || 1;

  // -----------------------------
  // Auth gates
  // -----------------------------
  if (authLoading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1 className="auth-title">Pokédex Lite</h1>
          <p className="auth-subtitle">
            Sign in with Google to access your Pokédex-Lite.
          </p>
          <button className="auth-button google" onClick={handleLogin}>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Render main app (when logged in)
  // -----------------------------
  return (
    <div className="app">
      <button className="logout-chip" onClick={handleLogout}>
        Logout
      </button>

      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesView={handleToggleFavoritesView}
      />

      <main className="main-content">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <FilterBar selectedType={selectedType} onTypeChange={setSelectedType} />

        {loading && <div className="loading">Loading Pokédex Lite...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            <PokemonGrid
              pokemon={paginatedPokemon}
              onSelectPokemon={setSelectedPokemon}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedPokemon && (
        <DetailModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
