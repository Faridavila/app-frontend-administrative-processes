import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Header/components/Header";
import { FiCircle, FiSearch } from "react-icons/fi";
import { menuConfig } from "./menuConfig"; // Asegúrate de que esta ruta sea correcta
import "./NavBar.css";

interface MainMenuProps {
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: Dispatch<SetStateAction<boolean>>;
  isDarkMode?: boolean; // Para manejar el modo oscuro
}

const MainMenu: React.FC<MainMenuProps> = ({
  isMenuCollapsed,
  setIsMenuCollapsed,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openSection, setOpenSection] = useState<string | null>(null); // Ahora solo una sección estará abierta
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>(""); // Agregamos el estado del ítem seleccionado

  // Filtrar menús según el término de búsqueda
  const filteredMenuConfig = menuConfig()
    .map((menu) => {
      const filteredSubMenus = menu.subMenus.filter(
        (subMenu: { path: string; label: string }) =>
          subMenu.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return { ...menu, subMenus: filteredSubMenus };
    })
    .filter((menu) => menu.subMenus.length > 0);

  const handleToggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const handleMouseEnter = () => {
    if (isMenuCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isMenuCollapsed) {
      setIsHovered(false);
    }
  };

  const toggleSection = (section: string) => {
    // Si la sección ya está abierta, la cerramos. Si no, cerramos todas las demás y abrimos solo esta.
    setOpenSection(openSection === section ? null : section);
  };

  const handleMenuClick = (path: string) => {
    setSelectedMenu(path); // Actualizar el ítem seleccionado
  };

  useEffect(() => {
    setSearching(searchTerm !== "");
    if (!searchTerm) {
      setOpenSection(null); // Si no hay término de búsqueda, cerramos todos los menús
    }
  }, [searchTerm]);

  return (
    <>
      <Header isMenuCollapsed={isMenuCollapsed} />

      <div
        className={`vertical-layout vertical-menu-modern ${
          isMenuCollapsed
            ? isHovered
              ? "menu-hovered"
              : "menu-collapsed"
            : "menu-expanded"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="main-menu menu-light menu-accordion menu-shadow">
          <div className="navbar-header">
            <ul className="nav navbar-nav flex-row">
              <li className="nav-item me-auto">
                <a className="navbar-brand" href="#">
                  <span className="brand-logo">
                    <img
                      src="/additional-assets/images/ico/R2.png"
                      alt="Logo"
                      height="40"
                    />
                  </span>
                  {(!isMenuCollapsed || isHovered) && (
                    <h2 className="brand-text" style={{ color: "red" }}>
                      UNIVALLE
                    </h2>
                  )}
                </a>
              </li>

              <li className="nav-item nav-toggle">
                <a
                  className="nav-link modern-nav-toggle pe-0"
                  onClick={handleToggleMenu}
                >
                  {isMenuCollapsed ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-circle d-block text-secondary toggle-icon font-medium-4"
                      style={{ color: "primary" }}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-circle d-block text-secondary toggle-icon font-medium-4"
                      style={{ color: "primary" }}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </a>
              </li>
            </ul>
          </div>

          <div className="menu-scroll-container">
            {/* Barra de búsqueda */}
            <div className="search-bar">
              <div
                className={`search-container ${
                  isMenuCollapsed ? "collapsed" : "expanded"
                }`}
              >
                {!isMenuCollapsed && (
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                )}
                {isMenuCollapsed && (
                  <FiSearch
                    className="search-icon"
                    style={{ marginLeft: "15px", fontSize: "22px" }}
                  />
                )}
              </div>
            </div>

            {/* Menús dinámicos y submenús filtrados */}
            <div className="main-menu-content">
              {searching
                ? filteredMenuConfig.map((menu, index) => (
                    <div key={index}>
                      <h5 className="menu-section-title">
                        {menu.sectionTitle}
                      </h5>{" "}
                      {/* Usar sectionTitle aquí */}
                      <ul className="navigation navigation-main">
                        <li
                          className={`nav-item d-flex align-items-center ${
                            selectedMenu === menu.title ? "menu-selected" : ""
                          }`} // Aplicar clase para ítem seleccionado
                          onClick={() => handleMenuClick(menu.title)}
                        >
                          <div
                            onClick={() => toggleSection(menu.title)}
                            className="d-flex align-items-center"
                            style={{
                              cursor: "pointer",
                              fontSize: "18px",
                              marginBottom: "10px",
                              width: "100%",
                              marginLeft: "60px",
                            }}
                          >
                            {menu.icon}
                            {(!isMenuCollapsed || isHovered) && (
                              <span
                                className="menu-item text-truncate"
                                style={{ marginLeft: "8px", fontSize: "15px" }}
                              >
                                {menu.title}
                              </span>
                            )}
                          </div>
                        </li>
                        {/* Mostrar submenús solo si la sección está abierta */}
                        {openSection === menu.title && (
                          <ul
                            className="sub-menu"
                            style={{
                              paddingLeft: "35px",
                              marginTop: "5px",
                            }}
                          >
                            {menu.subMenus.map((subMenu, subIndex) => (
                              <li
                                className={`nav-item d-flex align-items-center ${
                                  selectedMenu === subMenu.path
                                    ? "menu-selected"
                                    : ""
                                }`} // Aplicar clase para ítem seleccionado
                                key={subIndex}
                                onClick={() => handleMenuClick(subMenu.path)}
                              >
                                <Link
                                  to={subMenu.path}
                                  className="d-flex align-items-center"
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginLeft: "-15px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <FiCircle fontSize="20px" />{" "}
                                    {/* Icono del menú */}
                                  </span>
                                  {(!isMenuCollapsed || isHovered) && (
                                    <span
                                      className="menu-item text-truncate"
                                      style={{ marginLeft: "-20px" }}
                                    >
                                      {subMenu.label}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </ul>
                    </div>
                  ))
                : menuConfig().map((menu, index) => (
                    <div key={index}>
                      <h5 className="menu-section-title">
                        {menu.sectionTitle}
                      </h5>{" "}
                      {/* Usar sectionTitle aquí */}
                      <ul className="navigation navigation-main">
                        <li
                          className={`nav-item d-flex align-items-center ${
                            selectedMenu === menu.title ? "menu-selected" : ""
                          }`} // Aplicar clase para ítem seleccionado
                          onClick={() => handleMenuClick(menu.title)}
                        >
                          <div
                            onClick={() => toggleSection(menu.title)}
                            className="d-flex align-items-center"
                            style={{
                              cursor: "pointer",
                              fontSize: "18px",
                              marginBottom: "10px",
                              width: "100%",
                              marginLeft: "15px",
                            }}
                          >
                            {menu.icon}
                            {(!isMenuCollapsed || isHovered) && (
                              <span
                                className="menu-item text-truncate"
                                style={{ marginLeft: "4px", fontSize: "16px" }}
                              >
                                {menu.title}
                              </span>
                            )}
                          </div>
                        </li>

                        {/* Mostrar submenús solo si la sección está abierta */}
                        {openSection === menu.title && (
                          <ul
                            className="sub-menu"
                            style={{
                              paddingLeft: "20px",
                              marginTop: "0px",
                            }}
                          >
                            {menu.subMenus.map((subMenu, subIndex) => (
                              <li
                                className={`nav-item d-flex align-items-center ${
                                  selectedMenu === subMenu.path
                                    ? "menu-selected"
                                    : ""
                                }`} // Aplicar clase para ítem seleccionado
                                key={subIndex}
                                onClick={() => handleMenuClick(subMenu.path)}
                              >
                                <Link
                                  to={subMenu.path}
                                  className="d-flex align-items-center"
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginLeft: "-15px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <FiCircle fontSize="20px" />{" "}
                                    {/* Icono del menú */}
                                  </span>
                                  {(!isMenuCollapsed || isHovered) && (
                                    <span
                                      className="menu-item text-truncate"
                                      style={{ marginLeft: "-20px" }}
                                    >
                                      {subMenu.label}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </ul>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainMenu;
