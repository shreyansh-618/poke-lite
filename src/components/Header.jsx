import "./Header.css";

export default function Header({
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesView,
}) {
  return (
    <header className="header glass">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">Pokédex Lite</h1>
          <p className="tagline">Catch em' All</p>
        </div>

        <div
          className={`favorites-badge ${
            showFavoritesOnly ? "favorites-badge--active" : ""
          }`}
          onClick={onToggleFavoritesView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onToggleFavoritesView();
            }
          }}
        >
          <span className="heart">♥</span>
          <span className="count">{favoritesCount}</span>
          <span className="favorites-label">
            {showFavoritesOnly ? "Showing favorites" : "View favorites"}
          </span>
        </div>
      </div>
    </header>
  );
}
