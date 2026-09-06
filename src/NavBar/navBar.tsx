import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCircle,
  FiStar,
  FiFileText,
  FiShield,
  FiDatabase,
  FiX,
  FiDollarSign,
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { FavoritosContext } from "../FavoritoButton/components/FavoritosContext";
import { usePermissions } from "../Hooks/usePermissions";
import "../../app-assets/css/bootstrap.css";
import "../../app-assets/css/bootstrap-extended.min.css";
import "../../app-assets/css/components.css";
import "../../app-assets/css/components.min.css";
import "../../app-assets/css/colors.css";
import "../../app-assets/css/colors.min.css";
import "../../app-assets/css/bootstrap-extended.css";

interface MainMenuProps {
  isMenuCollapsed: boolean;
  toggleMenu: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (value: boolean) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  isMenuCollapsed,
  toggleMenu,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
}) => {
  const { favoritos } = useContext(FavoritosContext) || { favoritos: [] };
  const { hasPermission } = usePermissions();
  const [openSubMenu, setOpenSubMenu] = useState<string | string[] | null>(
    null,
  );
  const [lastOpenSubMenu, setLastOpenSubMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [imgCompany, setImgCompany] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const toggleSubMenu = (menu: string) => {
    const newOpenSubMenu = openSubMenu === menu ? null : menu;
    setOpenSubMenu(newOpenSubMenu);
    setLastOpenSubMenu(newOpenSubMenu);
  };

  useEffect(() => {
    const storedCompany = localStorage.getItem("imageCompany");
    if (storedCompany) {
      setImgCompany(storedCompany);
    }
  }, []);

  useEffect(() => {
    if (isMenuCollapsed && !isHovered) {
      setOpenSubMenu(null);
    }
  }, [isMenuCollapsed, isHovered]);

  useEffect(() => {
    if (isHovered && isMenuCollapsed) {
      setOpenSubMenu(lastOpenSubMenu);
    }
  }, [isHovered, isMenuCollapsed, lastOpenSubMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1199 && isMobileMenuOpen && setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menu = document.querySelector(".main-menu");

      if (
        menu &&
        !menu.contains(target) &&
        window.innerWidth <= 1199 &&
        setIsMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const menuItems = [
    {
      id: 1,
      title: "Favoritos",
      icon: <FiStar />,
      subItems: favoritos.map((favorito) => ({
        id: favorito.path,
        title: favorito.label,
        route: favorito.path,
      })),
    },
    {
      id: 3,
      title: "Seguridad",
      icon: <FiShield />,
      subItems: [
        { id: 3.3, title: "Area ", route: "/area", requiredPath: "/area" },
        {
          id: 3.4,
          title: "Cargo ",
          route: "/position",
          requiredPath: "/position",
        },
        { id: 3.1, title: "Roles", route: "/rol", requiredPath: "/rol" },
        {
          id: 3.2,
          title: "Compañias",
          route: "/company",
          requiredPath: "/company",
        },
        { id: 3.3, title: "Usuarios", route: "/user", requiredPath: "/user" },
      ],
    },
    {
      id: 4,
      title: "Inventario",
      icon: <FiDatabase />,
      requiredPath: "/inventory",
      subItems: [
        {
          id: 4.1,
          title: "Categorias ",
          route: "/category",
          requiredPath: "/category",
        },
        {
          id: 4.2,
          title: "Productos ",
          route: "/product",
          requiredPath: "/product",
        },
        {
          id: 4.3,
          title: "Inventario ",
          route: "/inventory",
          requiredPath: "/inventory",
        },
        {
          id: 4.4,
          title: "Historial de Inventario ",
          route: "/inventory-history",
          requiredPath: "/inventory-history",
        },
      ],
    },
    {
      id: 5,
      title: "Proveedores",
      icon: <FiUser />,
      subItems: [
        {
          id: 5.1,
          title: "Bodegas ",
          route: "/warehouse",
          requiredPath: "/warehouse",
        },
        {
          id: 5.2,
          title: "Proveedor ",
          route: "/supplier",
          requiredPath: "/supplier",
        },
        {
          id: 5.3,
          title: "Compra a proveedores",
          route: "/purchase-supplier",
          requiredPath: "/purchase-supplier",
        },
        {
          id: 5.4,
          title: "Productos pendiente",
          route: "/pending-product",
          requiredPath: "/pending-product",
        },
      ],
    },
    {
      id: 6,
      title: "Nomina",
      icon: <FiDollarSign />,
      subItems: [
        {
          id: 6.1,
          title: "Empleados ",
          route: "/employee",
          requiredPath: "/employee",
        },
        {
          id: 6.2,
          title: "Nomina",
          route: "/employee-payment",
          requiredPath: "/employee-payment",
        },
        {
          id: 6.3,
          title: "Consulta de pagos",
          route: "/employee-history",
          requiredPath: "/employee-history",
        },
      ],
    },
    {
      id: 7,
      title: "Facturacion",
      icon: <FiFileText />,
      subItems: [
        {
          id: 8.1,
          title: "Ventas rapidas",
          route: "/quick-sale",
          requiredPath: "/quick-sale",
        },
        {
          id: 8.2,
          title: "Facturas",
          route: "/invoice",
          requiredPath: "/invoice",
        },
        {
          id: 8.3,
          title: "Medio de pago",
          route: "/payment-method",
          requiredPath: "/payment-method",
        },
        {
          id: 8.4,
          title: "Rango de numerracion",
          route: "/numeration",
          requiredPath: "/numeration",
        },
        {
          id: 8.5,
          title: "Terminal",
          route: "/terminal",
          requiredPath: "/terminal",
        },
      ],
    },
    {
      id: 8,
      title: "Transportes",
      icon: <FiTruck />,
      subItems: [
        {
          id: 7.1,
          title: "Tarifa por bodega",
          route: "/supplier-rate",
          requiredPath: "/supplier-rate",
        },
        {
          id: 7.2,
          title: "Tarifa por barrio",
          route: "/neighborhood-rate",
          requiredPath: "/neighborhood-rate",
        },
        {
          id: 7.4,
          title: "Pedidos pendiente",
          route: "/pending-order",
          requiredPath: "/pending-order",
        },
        {
          id: 7.5,
          title: "Asignar pedidos",
          route: "/assign-order",
          requiredPath: "/assign-order",
        },
        {
          id: 7.6,
          title: "Pedidos completos",
          route: "/complete-order",
          requiredPath: "/complete-order",
        },
      ],
    },
    {
      id: 9,
      title: "Presentación",
      icon: <FiGrid />,
      route: "/config",
      requiredPath: "/config",
    },
    {
      id: 10,
      title: "Dashboard ",
      icon: <FiBarChart2 />,
      route: "/dashboard",
      requiredPath: "/dashboard",
    },
    {
      id: 11,
      title: "Cliente",
      icon: <FiUsers />,
      route: "/client",
      requiredPath: "/cliente",
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => {
      // Favoritos siempre visible
      if (item.id === 1) return true;

      // Verificar permiso del menú principal
      if (item.requiredPath && !hasPermission(item.requiredPath)) {
        return false;
      }

      // Sin búsqueda: mostrar todo (con permisos)
      if (!searchTerm) {
        return true;
      }

      // Con búsqueda: filtrar por título del menú o subitems
      if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }

      if (
        item.subItems &&
        item.subItems.some((subItem: any) =>
          subItem.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      ) {
        return true;
      }

      return false;
    })
    .map((item) => {
      // Filtrar subitems por permisos
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem: any) => {
          // Verificar permiso del subitem
          if (subItem.requiredPath && !hasPermission(subItem.requiredPath)) {
            return false;
          }
          return true;
        });

        return {
          ...item,
          subItems: filteredSubItems,
        };
      }
      return item;
    })
    // Eliminar menús sin subitems visibles
    .filter((item) => {
      if (item.subItems) {
        return item.subItems.length > 0;
      }
      return true;
    });

  useEffect(() => {
    if (searchTerm) {
      // Buscar TODOS los menús que contienen subitems con coincidencias
      const menusWithMatches = filteredMenuItems
        .filter((item) => {
          if (!item.subItems) return false;
          return item.subItems.some((subItem: any) =>
            subItem.title.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        })
        .map((item) => item.title);

      // Abrir TODOS los menús con coincidencias
      if (menusWithMatches.length > 0) {
        setOpenSubMenu(menusWithMatches);
      } else {
        setOpenSubMenu(null);
      }
    } else {
      // Sin búsqueda, restaurar el último menú abierto (solo uno)
      setOpenSubMenu(lastOpenSubMenu);
    }
  }, [searchTerm, filteredMenuItems, lastOpenSubMenu]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handler para el botón toggle
  const handleToggleClick = () => {
    if (window.innerWidth <= 1199) {
      // En móvil: toggle del menú móvil
      if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      }
    } else {
      // En desktop: comportamiento normal
      toggleMenu();
    }
  };

  // Cerrar menú móvil al navegar
  const handleLinkClick = () => {
    if (window.innerWidth <= 1199 && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div
      className={`main-menu ${
        isMenuCollapsed && !isHovered ? "menu-collapsed" : "menu-expanded"
      } ${isMobileMenuOpen ? "menu-mobile-open" : ""} menu-fixed menu-light menu-accordion menu-shadow`}
      data-scroll-to-active="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isMenuCollapsed) setOpenSubMenu(null);
      }}
    >
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item me-auto">
            <Link
              className="navbar-brand"
              to="/dashboard"
              onClick={handleLinkClick}
            >
              <span
                style={{
                  position: "relative",
                  width: "35px",
                  height: "35px",
                  display: "inline-block",
                }}
              >
                {!imageLoaded && imgCompany && (
                  <div
                    style={{
                      width: "35px",
                      height: "35px",
                      background:
                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "loading 1.5s infinite",
                      borderRadius: "4px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                )}

                {imgCompany && (
                  <img
                    src={imgCompany}
                    alt="Logo"
                    height="35"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      setImageLoaded(true);
                    }}
                    style={{
                      opacity: imageLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      display: "block",
                    }}
                  />
                )}

                {!imgCompany && (
                  <div
                    style={{
                      width: "35px",
                      height: "35px",
                      background: "#cc322d",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    L
                  </div>
                )}
              </span>
              <h3 className="brand-text" style={{ color: "#cc322d" }}>
                Ladrillera
              </h3>
            </Link>
          </li>
          <li className="nav-item nav-toggle">
            <a
              className="nav-link modern-nav-toggle pe-0"
              onClick={handleToggleClick}
            >
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
              >
                {isMenuCollapsed ? (
                  <circle cx="12" cy="12" r="10"></circle>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                )}
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div className="shadow-bottom"></div>

      <div className="p-2 d-flex justify-content-center align-items-center">
        {isMenuCollapsed && !isHovered ? (
          <FiSearch size={24} />
        ) : (
          <div className="input-group position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "35px", paddingRight: "35px" }}
            />
            <button
              className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2"
              onClick={clearSearch}
              style={{ zIndex: 10 }}
            >
              <FiX size={16} color="red" />
            </button>
          </div>
        )}
      </div>

      <div className="main-menu-content menu-scroll-container">
        <ul
          className="navigation navigation-main"
          id="main-menu-navigation"
          data-menu="menu-navigation"
        >
          {filteredMenuItems
            .filter((item) => item.id === 9 || item.id === 10)
            .map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  className="d-flex align-items-center"
                  to={item.route || "#"}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  <span
                    className="menu-title"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}

          {filteredMenuItems
            .filter((item) => item.id === 1)
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  Array.isArray(openSubMenu)
                    ? openSubMenu.includes(item.title)
                      ? "open"
                      : ""
                    : openSubMenu === item.title
                      ? "open"
                      : ""
                }`}
              >
                <a
                  className="d-flex align-items-center"
                  onClick={() => toggleSubMenu(item.title)}
                  style={{ cursor: "pointer" }}
                >
                  {item.icon}
                  <span
                    className="menu-title"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </span>
                </a>
                {item.subItems && (
                  <ul
                    className={`menu-content ${
                      Array.isArray(openSubMenu)
                        ? openSubMenu.includes(item.title)
                          ? "menu-open"
                          : "menu-close"
                        : openSubMenu === item.title
                          ? "menu-open"
                          : "menu-close"
                    }`}
                  >
                    {item.subItems
                      .filter((subItem) =>
                        subItem.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            className="d-flex align-items-center"
                            to={subItem.route}
                            onClick={handleLinkClick}
                          >
                            <FiCircle />
                            <span
                              className="menu-item"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                lineHeight: "1.2",
                              }}
                            >
                              {subItem.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}

          {filteredMenuItems
            .filter(
              (item) =>
                item.id === 3 ||
                item.id === 4 ||
                item.id === 5 ||
                item.id === 6 ||
                item.id === 7 ||
                item.id === 8,
            )
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  Array.isArray(openSubMenu)
                    ? openSubMenu.includes(item.title)
                      ? "open"
                      : ""
                    : openSubMenu === item.title
                      ? "open"
                      : ""
                }`}
              >
                <a
                  className="d-flex align-items-center"
                  onClick={() => toggleSubMenu(item.title)}
                  style={{ cursor: "pointer" }}
                >
                  {item.icon}
                  <span
                    className="menu-title"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </span>
                </a>
                {item.subItems && (
                  <ul
                    className={`menu-content ${
                      Array.isArray(openSubMenu)
                        ? openSubMenu.includes(item.title)
                          ? "menu-open"
                          : "menu-close"
                        : openSubMenu === item.title
                          ? "menu-open"
                          : "menu-close"
                    }`}
                  >
                    {item.subItems
                      .filter((subItem: any) =>
                        subItem.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((subItem: any) => (
                        <li key={subItem.id}>
                          <Link
                            className="d-flex align-items-center"
                            to={subItem.route}
                            onClick={handleLinkClick}
                          >
                            <FiCircle />
                            <span
                              className="menu-item"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                lineHeight: "1.2",
                              }}
                            >
                              {subItem.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}

          {filteredMenuItems
            .filter((item) => item.id >= 11)
            .map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  className="d-flex align-items-center"
                  to={item.route || "#"}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  <span
                    className="menu-title"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MainMenu;
