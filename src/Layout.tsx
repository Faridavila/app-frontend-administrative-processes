import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FavoritosProvider } from "./FavoritoButton/components/FavoritosContext";
import MainMenu from "./NavBar/navBar";
import Header from "./Header/Header";
import Footer from "./Footer/components/Footer";
import "./vertical-menu.css";

const Layout: React.FC = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 992 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuCollapsed((prev) => !prev);
  };

  // Sincronizar clases en body para compatibilidad
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
      bodyClassList.remove("menu-expanded", "menu-collapsed");
    };
  }, [isMenuCollapsed]);

  return (
    <FavoritosProvider>
      <div

      className={`layout-wrapper ${
        isMenuCollapsed ? "menu-collapsed" : "menu-expanded"
     } ${!isMenuCollapsed ? "sidebar-visible" : ""}`}
      >
        <Header isMenuCollapsed={isMenuCollapsed} toggleMobileMenu={toggleMenu} />
        <div className="layout-body">
          <MainMenu isMenuCollapsed={isMenuCollapsed} toggleMenu={toggleMenu} />
          <main className="app-content">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </FavoritosProvider>
  );
};

export default Layout;