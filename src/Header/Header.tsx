import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BsCalculator, BsPower,BsGear } from "react-icons/bs";
import { FiBell, FiCalendar } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import ThemeToggle from "./ChangeTheme";

interface HeaderProps {
  isMenuCollapsed: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isMenuCollapsed,
  toggleMobileMenu,
}) => {
  const [username, setUsername] = useState<string>("Usuario");
  const [rol, setRol] = useState<string>("Admin");
  const [positionName, setPositionName] = useState<string>("Admin");

  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return "US";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorFromName = () => "#cc322d";

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRol = localStorage.getItem("rol");
    const storedPositionName = localStorage.getItem("positionName");
    setUsername(storedUsername || "Usuario");
    setRol(storedRol || "Admin");
    setPositionName(storedPositionName || "Admin");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("positionName");
    navigate("/login");
  };

  const menuOptions = [
    { label: "Calendario", icon: <FiCalendar size={20} />, link: "/calendar" },
    {
      label: "Calculadora",
      icon: <BsCalculator size={20} />,
      link: "/calculator",
    },
  ];

  return (
    <nav
      className={`header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-light navbar-shadow ${
        isMenuCollapsed ? "menu-collapsed" : "menu-expanded"
      }`}
      data-menu-state={isMenuCollapsed ? "collapsed" : "expanded"}
    >
      <div className="navbar-container d-flex justify-content-between align-items-center w-100">
        <div className="bookmark-wrapper d-flex align-items-center">
          <ul className="nav navbar-nav d-xl-none">
            <li className="nav-item">
              <button
                className="btn p-0 me-3 d-lg-none"
                onClick={toggleMobileMenu}
                aria-label="Abrir menú"
              >
                <MdMenu size={30} />
              </button>
            </li>
          </ul>

          <ul className="nav navbar-nav bookmark-icons">
            {menuOptions.map((option) => (
              <li className="nav-item" key={option.label}>
                <NavLink
                  className="nav-link"
                  to={option.link}
                  title={option.label}
                >
                  {option.icon}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <ul className="nav navbar-nav align-items-center ms-auto">
          <li className="nav-item">
            <ThemeToggle />
          </li>

          <li className="nav-item dropdown dropdown-notification me-25">
            <a className="nav-link" href="#" data-bs-toggle="dropdown">
              <FiBell size={20} />
              <span className="badge rounded-pill bg-danger badge-up">5</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-media dropdown-menu-end">
              <li className="dropdown-menu-header">
                <div className="dropdown-header d-flex">
                  <h4 className="notification-title mb-0 me-auto">
                    Notificaciones
                  </h4>
                  <div className="badge rounded-pill badge-light-primary">
                    6 Nuevas
                  </div>
                </div>
              </li>
              <li className="scrollable-container media-list"></li>
              <li className="dropdown-menu-footer">
                <NavLink className="btn btn-primary w-100" to="/notificaciones">
                  Ver todas las notificaciones
                </NavLink>
              </li>
            </ul>
          </li>

          <li className="nav-item dropdown dropdown-user">
            <a
              className="nav-link dropdown-toggle dropdown-user-link d-flex align-items-center"
              href="#"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="user-nav d-sm-flex d-none text-start">
                <span className="user-name fw-bolder">{username}</span>
                <span className="user-status">{positionName}</span>
              </div>

              <span
                className="avatar"
                style={{
                  backgroundColor: getColorFromName(),
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {getInitials(username)}
                <span className="avatar-status-online"></span>
              </span>
            </a>

            <div className="dropdown-menu dropdown-menu-end">
              <NavLink className="dropdown-item" to="/company">
                <BsGear className="me-50" /> Configuración
              </NavLink>
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item text-danger"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <BsPower className="me-50" /> Cerrar sesión
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
