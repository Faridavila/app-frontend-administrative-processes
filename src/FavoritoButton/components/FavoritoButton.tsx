import React, { useContext, useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { FavoritosContext } from "./FavoritosContext";

interface FavoritoButtonProps {
  path: string;
  label: string;
}

const FavoritoButton: React.FC<FavoritoButtonProps> = ({ path, label }) => {
  const { favoritos, agregarFavorito, eliminarFavorito } = useContext(
    FavoritosContext
  ) || {
    favoritos: [],
    agregarFavorito: () => {},
    eliminarFavorito: () => {},
  };
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const isFav = favoritos.some((fav) => fav.path === path);
    setIsFavorite(isFav);
  }, [favoritos, path]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      eliminarFavorito(path);
    } else {
      agregarFavorito({ path, label });
    }
    setIsFavorite((prev) => !prev); // Actualiza el estado local
  };

  return (
    <FiStar
      className="ms-2"
      style={{
        cursor: "pointer",
        color: isFavorite ? "gold" : "gray",
        fontSize: "24px",
      }}
      onClick={handleFavoriteToggle}
    />
  );
};

export default FavoritoButton;
