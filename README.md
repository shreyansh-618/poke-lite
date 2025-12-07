Pokédex-Lite

Pokédex Lite is a modern, animated Pokédex web application built with React and Vite. It uses Framer Motion and Anime.js for rich UI interactions, and integrates with PokéAPI for live Pokémon data. Users can search, filter, mark favorites, and view detailed stats for each Pokémon. A minimal Google OAuth flow (via Firebase) protects the app behind a login screen.

Features
Core Functionality

Search Pokémon by name in real time

Filter Pokémon by type (e.g. Fire, Water, Electric, Grass, etc.)

Pagination with a fixed number of Pokémon per page

Detail modal showing stats, abilities, height, weight, and types

Legendary Pokémon highlighted with a distinct badge and glow

Favorites System

Mark and unmark Pokémon as favorites

Favorites persisted in localStorage

Favorites counter in the header

“View favorites” toggle to show only liked Pokémon

UI and Animations

Glassmorphism-inspired UI with gradients and soft shadows

Framer Motion used for:

Card entrance animations

Card hover effects

Grid staggering

Modal transitions and drag interactions

Anime.js used in the detail modal for:

Elastic pop-out animations

Subtle floating/breathing effects

Authentication (OAuth Proof of Concept)

Firebase Authentication with Google sign-in

Login screen gating access to the Pokédex

Logout button to clear the session

Auth state handled via Firebase onAuthStateChanged and React state

Tech Stack
Frontend

React – UI library for building the component-based interface

Vite – Build tool and dev server for fast development

Framer Motion – Declarative animations for cards, grids, and modals

Anime.js – Fine-grained animation control for advanced modal effects

CSS – Custom styling for glassmorphism look, responsive layout, and theming

Data and Networking

Axios – HTTP client for calling PokéAPI

PokéAPI – Public API used to fetch Pokémon data (list + details)

Authentication

Firebase Authentication – Google OAuth login flow

Firebase JS SDK – Used to configure app and manage auth state

State and Persistence

React Hooks – useState, useEffect for state and side-effects

localStorage – Persisting favorites across sessions

Setup and Installation
Prerequisites

Node.js 16 or higher

npm

1. Clone and install

# Install dependencies

npm install

2. Configure Firebase (Google OAuth)

Create a Firebase project in the Firebase console.

Enable Google as a sign-in provider under Authentication.

Create a Web App in Firebase and copy the config.

In the project root, create a .env.local file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Ensure .env.local is ignored by Git (Vite does this if .gitignore is present).

3. Run in development
   npm run dev

Vite will print the local development URL in the terminal (commonly http://localhost:5173).

4. Build for production
   npm run build

This creates an optimized production build in the dist folder.

How the App Works
Data Flow

Initial fetch

fetchAllPokemon(limit) fetches a base list of Pokémon (names and URLs).

The app then batches calls to fetchPokemonDetails(name) to avoid overwhelming the API or the browser.

For each Pokémon, details are normalized into a single object:

id, name, types, image, stats, abilities, height, weight, isLegendary.

Search and filter

searchTerm and selectedType are tracked in state.

A useEffect recomputes filteredPokemon whenever the search term, type, or base list changes.

Favorites

Favorites are stored as an array of Pokémon IDs in state.

On each change, the array is serialized to localStorage.

On app load, favorites are read from localStorage and used to mark cards and the detail modal.

Favorites view toggle

A boolean showFavoritesOnly controls whether filteredPokemon is further filtered to only favorites.

The header’s favorites badge toggles this value, and the grid uses the resulting list for pagination.

Authentication

onAuthStateChanged from Firebase listens for changes to the signed-in user.

While auth status is resolving, the app shows a simple “Checking session…” screen.

If no user is logged in, a Google sign-in screen is shown.

Once authenticated, the full Pokédex UI is rendered.

Logout clears the Firebase session and returns the user to the login screen.

Why These Technologies

React + Vite: Fast dev server, simple configuration, and component-driven UI.

Framer Motion: Clean API for entrance, hover, drag, and modal animations without manually managing class toggles.

Anime.js: More control over timeline-based and 3D transform animations for the detail modal.

Axios: Simple promise-based HTTP API and cleaner error handling than the raw fetch in this context.

Firebase Auth (Google): Quick OAuth implementation without building custom backend auth for this project.

PokéAPI: Public, well-documented Pokémon data source suitable for demos and portfolio projects.

Challenges and How They Were Solved

1. Performance when fetching many Pokémon

Problem: Fetching details for a large number of Pokémon at once caused long initial loads and could overwhelm the network.

Solution:

Introduced batching in the main fetch logic:

Fetch a base list (fetchAllPokemon(limit)).

Split it into smaller batches (e.g., 40 at a time).

Use Promise.all per batch and progressively update state so the UI feels responsive even while more Pokémon are loading.

2. Keeping the UI responsive with heavy animations

Problem: Combining Framer Motion and Anime.js can easily lead to janky UI if overused.

Solution:

Limited heavy Anime.js animations to the detail modal only.

Used Framer Motion for more lightweight, layout-friendly animations (grid, cards, hover).

Kept animation durations and easing reasonable to avoid performance spikes.

3. Favorites persistence without a backend

Problem: Favorites needed to persist between page refreshes without building an entire backend.

Solution:

Used localStorage to store an array of favorite Pokémon IDs.

Wrapped reads/writes in try/catch to avoid crashes if storage is unavailable.

Synced state with storage on load and every update.

4. Integrating OAuth without breaking the app

Problem: Requirement to add OAuth, but the app was already fully functional and should not be drastically refactored.

Solution:

Introduced Firebase and Google provider in a separate firebase.js module.

Wrapped the entire app render in an auth gate:

If auth is loading, show a small “checking session” screen.

If not logged in, show a Google login screen.

Only render the existing Pokédex UI when a user is present.

This kept all existing components and state logic intact and satisfied the “OAuth proof-of-concept” requirement.

Future Improvements

Store favorites per user in Firestore instead of localStorage.

Add advanced filters (multi-type, stat ranges, etc.).

Show evolution chains and move sets in the detail modal.

Add a “team builder” mode to assemble six-Pokémon teams and compare stats.
