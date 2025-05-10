import React, { createContext, useState, useEffect } from "react";

interface Favorito {
  path: string;
  label: string;
}

interface FavoritosContextProps {
  favoritos: Favorito[];
  agregarFavorito: (favorito: Favorito) => void;
  eliminarFavorito: (path: string) => void;
}

export const FavoritosContext = createContext<
  FavoritosContextProps | undefined
>(undefined);

export const FavoritosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoritos, setFavoritos] = useState<Favorito[]>(() => {
    const storedFavoritos = localStorage.getItem("favoritos");
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (nuevoFavorito: Favorito) => {
    setFavoritos((prev) => [...prev, nuevoFavorito]);
  };

  const eliminarFavorito = (path: string) => {
    setFavoritos((prev) => prev.filter((fav) => fav.path !== path));
  };

  return (
    <FavoritosContext.Provider
      value={{ favoritos, agregarFavorito, eliminarFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
