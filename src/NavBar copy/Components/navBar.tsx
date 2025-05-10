import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCircle,
  FiStar,
  FiTrello,
  FiCheck,
  FiDollarSign,
  FiHome,
  FiSlack,
  FiMaximize2,
  FiSettings,
  FiPlus,
  FiShoppingBag,
  FiTrendingUp,
  FiLifeBuoy,
  FiTriangle,
  FiShield,
  FiDatabase,
} from "react-icons/fi";
import { FavoritosContext } from "./../../FavoritoButton/components/FavoritosContext";
import "./../../../app-assets/css/bootstrap.css";
import "./../../../app-assets/css/bootstrap-extended.min.css";
import "./../../../app-assets/css/components.css";
import "./../../../app-assets/css/components.min.css";
import "./../../../app-assets/css/colors.css";
import "./../../../app-assets/css/colors.min.css";
import "./../../../app-assets/css/bootstrap-extended.css";
import "./../../vertical-menu.css";

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
    setLastOpenSubMenu(newOpenSubMenu); // Guarda el último submenú abierto
  };

  // Efecto para cerrar submenús cuando se colapsa el menú o se pierde el hover
  useEffect(() => {
    if (isMenuCollapsed && !isHovered) {
      setOpenSubMenu(null);
    }
  }, [isMenuCollapsed, isHovered]);

  // Efecto para reabrir el último submenú cuando el usuario hace hover en el menú colapsado
  useEffect(() => {
    if (isHovered && isMenuCollapsed) {
      setOpenSubMenu(lastOpenSubMenu);
    }
  }, [isHovered, isMenuCollapsed, lastOpenSubMenu]);

  const menuItems = [
    {
      id: 1,
      title: "Favoritos (Favs)",
      icon: <FiStar />,
      subItems: favoritos.map((favorito) => ({
        id: favorito.path,
        title: favorito.label,
        route: favorito.path,
      })),
    },
    {
      id: 2,
      title: "Flujo de trabajo",
      icon: <FiMaximize2 />,
      subItems: [
        { id: 2.1, title: "Acciones (Acs)", route: "/action" },
        { id: 2.2, title: "Proceso (Pcs)", route: "/process" },
        { id: 2.3, title: "Procesos empresa (Pce)", route: "/processCompany" },
        { id: 2.4, title: "Parametro (Prm)", route: "/Parameter" },
        { id: 2.5, title: "Accion parametro (Acp)", route: "/actionParameter" },
        { id: 2.6, title: "Tipo parametro (Tp)", route: "/ParameterType" },
      ],
    },
    {
      id: 3,
      title: "Seguridad",
      icon: <FiShield />,
      subItems: [
        { id: 3.1, title: "Roles (Rls)", route: "/rol" },
        { id: 3.2, title: "Usuarios (Usr)", route: "/user" },
        { id: 3.3, title: "Area (Ar)", route: "/area" },
        { id: 3.4, title: "Cargo (Cr)", route: "/position" },
      ],
    },
    {
      id: 4,
      title: "Inventario",
      icon: <FiDatabase />,
      subItems: [
        { id: 4.1, title: "Bodegas (Bdg)", route: "/bodega" },
        { id: 4.2, title: "Tipo de Bodegas (Tbg)", route: "/tipos-bodega" },
        { id: 4.3, title: "Categorias (Ctg)", route: "/category" },

        {
          id: 4.4,
          title: "Ajustes de inventario (Aji)",
          route: "ajustes-inventario",
        },
        { id: 4.5, title: "File-manager (FM)", route: "file-manager" },
      ],
    },
    {
      id: 5,
      title: "Presentación (Pst)",
      icon: <FiSettings />,
      route: "/company",
    },
    {
      id: 6,
      title: "Sucursal (Scs)",
      icon: <FiLifeBuoy />,
      route: "/branch",
    },
    {
      id: 7,
      title: "Empresa (Emp)",
      icon: <FiHome />,
      route: "/configCompany",
    },
    {
      id: 8,
      title: "Departamentos (Dept)",
      icon: <FiTrello />,
      route: "/department",
    },
    {
      id: 9,
      title: "Localidad (Lcd)",
      icon: <FiTriangle />,
      route: "/city",
    },
    {
      id: 10,
      title: "Comprobante (Cbt)",
      icon: <FiCheck />,
      route: "/comprobante",
    },
    {
      id: 11,
      title: "Arbol (Arb)",
      icon: <FiSlack />,
      route: "/arbol",
    },
    {
      id: 12,
      title: "Tipo Moneda (Tm)",
      icon: <FiDollarSign />,
      route: "/currencyType",
    },
    {
      id: 13,
      title: "Actividad economica (Aec)",
      icon: <FiTrendingUp />,
      route: "/economicActivity",
    },
   
    {
      id: 14,
      title: "Solicitud (Slt)",
      icon: <FiShoppingBag />,
      route: "/Solicitud",
    },
    {
      id: 15,
      title: "Registrar Producto (Rpr)",
      icon: <FiPlus />,
      route: "/Registrarproducto",
    },
    {
      id: 16,
      title: "Numeration",
      icon: <FiShoppingBag />,
      route: "/numeration",
    },
    {
      id: 17,
      title: "Impuesto  y retenciones",
      icon: <FiShoppingBag />,
      route: "/TaxConfiguration",
    },
    {
      id: 18,
      title: "Tipo de documento contable",
      icon: <FiShoppingBag />,
      route: "/AccountingDocumentTypes",
    },
    {
      id: 19,
      title: "Metodo de pago",
      icon: <FiShoppingBag />,
      route: "/paymentMethod",
    },
    {
      id: 20,
      title: "Vendedor",
      icon: <FiShoppingBag />,
      route: "/seller",
    },
    {
      id: 21,
      title: "Cliente",
      icon: <FiShoppingBag />,
      route: "/client",
    },
    {
      id: 22,
      title: "Caja registradora",
      icon: <FiShoppingBag />,
      route: "/cashRegister",
    },
    {
      id: 23,
      title: "Producto",
      icon: <FiShoppingBag />,
      route: "/product",
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

  return (
    <div
      className={`main-menu ${
        isMenuCollapsed && !isHovered ? "menu-collapsed" : "menu-expanded"
      } menu-fixed menu-light menu-accordion menu-shadow`}
      data-scroll-to-active="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isMenuCollapsed) setOpenSubMenu(null); // Cierra submenús al salir
      }}
    >
      <div className="navbar-header">
        <ul className="nav navbar-nav flex-row">
          <li className="nav-item me-auto">
            <Link className="navbar-brand" to="/home">
              <span className="brand-logo">
                <img
                  src="/additional-assets/images/ico/R2.png"
                  alt="Logo"
                  height="40"
                />
              </span>
              <h3 className="brand-text" style={{ color: "#ff0000" }}>
                Univalle
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
        {isMenuCollapsed ? (
          <FiSearch size={24} />
        ) : (
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      <div className="main-menu-content menu-scroll-container">
        <ul
          className="navigation navigation-main"
          id="main-menu-navigation"
          data-menu="menu-navigation"
        >
          <li className="navigation-header">
            <span
              data-i18n="Favoritos"
              className={isMenuCollapsed ? "collapsed-header" : ""}
            >
              Favoritos
            </span>
            <i data-feather="more-horizontal"></i>
          </li>

          {filteredMenuItems
            .filter((item) => item.id === 1)
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  openSubMenu === item.title ? "open" : ""
                }`}
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
                    className={`menu-content ${
                      openSubMenu === item.title ? "menu-open" : "menu-close"
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

          <li className="navigation-header">
            <span
              data-i18n="Configuración"
              className={isMenuCollapsed ? "collapsed-header" : ""}
            >
              Configuración
            </span>
            <i data-feather="more-horizontal"></i>
          </li>

          {filteredMenuItems
            .filter((item) => item.id === 2 || item.id === 3 || item.id === 4)
            .map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  openSubMenu === item.title ? "open" : ""
                }`}
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
                    className={`menu-content ${
                      openSubMenu === item.title ? "menu-open" : "menu-close"
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

          <li className="navigation-header">
            <span
              data-i18n="Otras opciones"
              className={isMenuCollapsed ? "collapsed-header" : ""}
            >
              Otras opciones
            </span>
            <i data-feather="more-horizontal"></i>
          </li>

          {filteredMenuItems
            .filter((item) => item.id >= 5)
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
