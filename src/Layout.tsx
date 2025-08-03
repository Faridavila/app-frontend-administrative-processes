import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FavoritosProvider } from "./FavoritoButton/components/FavoritosContext"; // Ajusta la ruta según sea necesario
import MainMenu from "./NavBar/navBar";
import Header from "./Header/components/Header";
import Footer from "./Footer/components/Footer";
import "./vertical-menu.css";

const Layout: React.FC = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const bodyClassList = document.body.classList;
    if (isMenuCollapsed) {
      bodyClassList.add("menu-collapsed");
      bodyClassList.remove("menu-expanded");
    } else {
      bodyClassList.add("menu-expanded");
      bodyClassList.remove("menu-collapsed");
    }
    return () => {
      bodyClassList.remove("menu-expanded");
      bodyClassList.remove("menu-collapsed");
    };
  }, [isMenuCollapsed]);

  return (
    <FavoritosProvider>
      <div
        className={`layout-wrapper ${
          isMenuCollapsed ? "menu-collapsed" : "menu-expanded"
        }`}
      >
        <Header isMenuCollapsed={isMenuCollapsed} />
        <MainMenu isMenuCollapsed={isMenuCollapsed} toggleMenu={toggleMenu} />
        <div
          className={`app-content ${
            isMenuCollapsed ? "collapsed" : "expanded"
          }`}
        >
          <Outlet />
        </div>
        <Footer />
      </div>
    </FavoritosProvider>
  );
};

export default Layout;
