import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCircle,
  FiStar,
  FiSettings,
  FiPlus,
  FiShoppingBag,
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
import "../../app-assets/css/bootstrap.css";
import "../../app-assets/css/bootstrap-extended.min.css";
import "../../app-assets/css/components.css";
import "../../app-assets/css/components.min.css";
import "../../app-assets/css/colors.css";
import "../../app-assets/css/colors.min.css";
import "../../app-assets/css/bootstrap-extended.css";
import "../../app-assets/css/core/menu/menu-types/vertical-menu.css";

interface MainMenuProps {
  isMenuCollapsed: boolean;
  toggleMenu: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ isMenuCollapsed, toggleMenu }) => {
  const { favoritos } = useContext(FavoritosContext) || { favoritos: [] };
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const [lastOpenSubMenu, setLastOpenSubMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleSubMenu = (menu: string) => {
    const newOpenSubMenu = openSubMenu === menu ? null : menu;
    setOpenSubMenu(newOpenSubMenu);
    setLastOpenSubMenu(newOpenSubMenu);
  };

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
        { id: 3.3, title: "Area ", route: "/area" },
        { id: 3.4, title: "Cargo ", route: "/position" },
        { id: 3.1, title: "Roles", route: "/rol" },
        { id: 3.2, title: "Usuarios", route: "/user" },
        
      ],
    },
    {
      id: 4,
      title: "Inventario",
      icon: <FiDatabase />,
      subItems: [
        { id: 4.1, title: "Categorias ", route: "/category" },
        { id: 4.2, title: "Productos ", route: "/product" },
        { id: 4.3, title: "Inventario ", route: "/inventory" },
        { id: 4.4, title: "Historial de Inventario ", route: "/inventoryHistory" },
      ],
    },
    {
      id: 5,
      title: "Proveedores",
      icon: <FiUser />,
      subItems: [
        { id: 5.1, title: "Bodegas ", route: "/bodega" },
        { id: 5.2, title: "Proveedor ", route: "/supplier" },
        { id: 5.3, title: "Compra a proveedores", route: "/purchaseSupplier" },
        { id: 5.4, title: "Productos pendiente", route: "/supplierPendingProduct" },
      ],
    },
    {
      id: 6,
      title: "Nomina",
      icon: <FiDollarSign     />,
      subItems: [
        { id: 6.1, title: "Empleados ", route: "/employee" },
        { id: 6.2, title: "Nomina", route: "/employeePayment" },
        { id: 6.3, title: "Consulta de pagos", route: "/employeeHistory" },
      ],
    },
    {
      id: 7,
      title: "Transportes",
      icon: <FiTruck     />,
      subItems: [
        { id: 7.1, title: "Tarifa por proveedor", route: "/supplierRate" },
        { id: 7.2, title: "Tarifa por barrio", route: "/neighborhoodRate" },
        { id: 7.3, title: "Pedidos pendientes", route: "/branch" },
      ],
    },
    {
      id: 8,
      title: "Presentación",
      icon: < FiGrid/>,
      route: "/company",
    },
    {
      id: 9,
      title: "Dashboard ",
      icon: <FiBarChart2 />,
      route: "/dashboard",
    },

    {
      id: 21,
      title: "Cliente",
      icon: <FiUsers />,
      route: "/client",
    },

    {
      id: 24,
      title: "Tipo descuentos",
      icon: <FiShoppingBag />,
      route: "/discountType",
    },
    {
      id: 25,
      title: "Descuento",
      icon: <FiShoppingBag />,
      route: "/discount",
    },
  ];


  const filteredMenuItems = menuItems.filter((item) => {
    if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    if (
      item.subItems &&
      item.subItems.some((subItem) =>
        subItem.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return true;
    }
    return false;
  });


  useEffect(() => {
    if (searchTerm) {
      const visibleSubMenus = filteredMenuItems.map((item) => item.title);
      if (visibleSubMenus.length > 0) {
        setOpenSubMenu(visibleSubMenus[0]);
      }
    } else {
      setOpenSubMenu(lastOpenSubMenu);
    }
  }, [searchTerm, filteredMenuItems]);


  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div
      className={`main-menu ${isMenuCollapsed && !isHovered ? "menu-collapsed" : "menu-expanded"} menu-fixed menu-light menu-accordion menu-shadow`}
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
            <Link className="navbar-brand" to="/dashboard">
              <span >
                <img
                  src="/additional-assets/images/logo/Logo nuevo.png"
                  alt="Logo"
                  height="35"
                />
              </span>
              <h3 className="brand-text" style={{ color: "#e33131ff" }}>
                Ladrillera
              </h3>
            </Link>
          </li>
          <li className="nav-item nav-toggle">
            <a className="nav-link modern-nav-toggle pe-0" onClick={toggleMenu}>
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
              style={{ paddingRight: "30px" }}
            />
            <button
              className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
              onClick={clearSearch}
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
            .filter((item) => item.id === 8 || item.id === 9)
            .map((item) => (
              <li key={item.id} className="nav-item">
                <Link className="d-flex align-items-center" to={item.route || "#"}>
                  {item.icon}
                  <span className="menu-title text-truncate">{item.title}</span>
                </Link>
              </li>
            ))}

          {filteredMenuItems
            .filter((item) => item.id === 1)
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${openSubMenu === item.title ? "open" : ""}`}
              >
                <a
                  className="d-flex align-items-center"
                  onClick={() => toggleSubMenu(item.title)}
                >
                  {item.icon}
                  <span className="menu-title text-truncate">{item.title}</span>
                </a>
                {item.subItems && (
                  <ul
                    className={`menu-content ${openSubMenu === item.title ? "menu-open" : "menu-close"
                      }`}
                  >
                    {item.subItems
                      .filter((subItem) =>
                        subItem.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            className="d-flex align-items-center"
                            to={subItem.route}
                          >
                            <FiCircle />
                            <span className="menu-item text-truncate">
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
            .filter((item) => item.id === 3 || item.id === 4 || item.id === 5 || item.id === 6 || item.id === 7)
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${openSubMenu === item.title ? "open" : ""}`}
              >
                <a
                  className="d-flex align-items-center"
                  onClick={() => toggleSubMenu(item.title)}
                >
                  {item.icon}
                  <span className="menu-title text-truncate">{item.title}</span>
                </a>
                {item.subItems && (
                  <ul
                    className={`menu-content ${openSubMenu === item.title ? "menu-open" : "menu-close"
                      }`}
                  >
                    {item.subItems
                      .filter((subItem) =>
                        subItem.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            className="d-flex align-items-center"
                            to={subItem.route}
                          >
                            <FiCircle />
                            <span className="menu-item text-truncate">
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
            .filter((item) => item.id >= 10)
            .map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  className="d-flex align-items-center"
                  to={item.route || "#"}
                >
                  {item.icon}
                  <span className="menu-title text-truncate">{item.title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MainMenu;
