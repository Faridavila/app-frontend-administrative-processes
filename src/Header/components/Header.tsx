import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiBell,
  FiMail,
  FiMessageCircle,
  FiCalendar,
  FiCheckSquare,
} from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import ThemeToggle from "./ChangeTheme";
import "./../../vertical-menu.css";

interface HeaderProps {
  isMenuCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMenuCollapsed }) => {
  const [username, setUsername] = useState<string | null>("");
  const [rol, setRol] = useState<string | null>("");
  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const images = [
      "/additional-assets/images/portrait/small/avatar-s-11.jpg",
      "/additional-assets/images/portrait/small/avatar-s-13.jpg",
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  }, []);

  const navigate = useNavigate();

  const menuOptions = [
    {
      label: "Calendar",
      icon: <FiCalendar style={{ fontSize: "20px" }} />,
      link: "/CalendarComponent",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("rol"); 
    navigate("/login");
  };

    useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRol = localStorage.getItem("rol"); 
    setUsername(storedUsername);
    setRol(storedRol);
  }, []);

  return (
    <nav
      className={`header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-light navbar-shadow container-xxl ${
        isMenuCollapsed ? "menu-collapsed" : "menu-expanded"
      } vertical-layout vertical-menu-modern`}
    >
      <div className="navbar-container d-flex justify-content-between align-items-center">
        <div className="bookmark-wrapper d-flex align-items-center">
          <ul className="nav navbar-nav d-xl-none">
            <li className="nav-item">
              <NavLink className="nav-link menu-toggle" to="#">
                <MdMenu />
              </NavLink>
            </li>
          </ul>

          <ul className="nav navbar-nav bookmark-icons">
            {menuOptions.map((option) => (
              <li className="nav-item d-none d-lg-block" key={option.label}>
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
          <ThemeToggle />

          {/* 

          <li className="nav-item dropdown dropdown-cart me-25">
            <a className="nav-link" href="#" data-bs-toggle="dropdown">
              <FiShoppingCart style={{ fontSize: "20px" }} />{" "}
              <span className="badge rounded-pill bg-primary badge-up cart-item-count">
                6
              </span>
            </a>
            <ul className="dropdown-menu dropdown-menu-media dropdown-menu-end">
              <li className="dropdown-menu-header">
                <div className="dropdown-header d-flex">
                  <h4 className="notification-title mb-0 me-auto">My Cart</h4>
                  <div className="badge rounded-pill badge-light-primary">
                    4 Items
                  </div>
                </div>
              </li>
              <li className="dropdown-menu-footer">
                <div className="d-flex justify-content-between mb-1">
                  <h6 className="fw-bolder mb-0">Total:</h6>
                  <h6 className="text-primary fw-bolder mb-0">$10,999.00</h6>
                </div>
                <NavLink
                  className="btn btn-primary w-100"
                  to="/FacturaPoputComponent"
                >
                  Generar factura
                </NavLink>
              </li>
            </ul>
          </li>

          */ }

          <li className="nav-item dropdown dropdown-notification me-25">
            <a className="nav-link" href="#" data-bs-toggle="dropdown">
              <FiBell style={{ fontSize: "20px" }} />{" "}
              <span className="badge rounded-pill bg-danger badge-up">5</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-media dropdown-menu-end">
              <li className="dropdown-menu-header">
                <div className="dropdown-header d-flex">
                  <h4 className="notification-title mb-0 me-auto">
                    Notifications
                  </h4>
                  <div className="badge rounded-pill badge-light-primary">
                    6 New
                  </div>
                </div>
              </li>
              <li className="dropdown-menu-footer">
                <NavLink className="btn btn-primary w-100" to="#">
                  Read all notifications
                </NavLink>
              </li>
            </ul>
          </li>

          {/* User Profile Dropdown */}
          <li className="nav-item dropdown dropdown-user">
            <a
              className="nav-link dropdown-toggle dropdown-user-link"
              id="dropdown-user"
              href="#"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="user-nav d-sm-flex d-none">
                <span className="user-name fw-bolder">
                  {username || "Usuario"}
                </span>
                 <span className="user-status">{rol || "Admin"}</span> 
              </div>
              <span className="avatar">
                <img
                  className="round"
                  src={randomImage} 
                  alt="avatar"
                  height="40"
                  width="40"
                />
                <span className="avatar-status-online"></span>
              </span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdown-user"
              >
                {/* 
              <NavLink className="dropdown-item" to="/page-profile">
                <i
                  className="me-50"
                  data-feather="user"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Profile
              </NavLink>
              <NavLink className="dropdown-item" to="/app-email">
                <i
                  className="me-50"
                  data-feather="mail"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Inbox
              </NavLink>
              <NavLink className="dropdown-item" to="/app-todo">
                <i
                  className="me-50"
                  data-feather="check-square"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Task
              </NavLink>
              <NavLink className="dropdown-item" to="/app-chat">
                <i
                  className="me-50"
                  data-feather="message-square"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Chats
              </NavLink>
               */}
              <div className="dropdown-divider"></div>
              <NavLink
                className="dropdown-item"
                to="/user"
              >
                
                <i
                  className="me-50"
                  data-feather="settings"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Settings
              </NavLink>
             

              <a className="dropdown-item" onClick={handleLogout}>
                <i
                  className="me-50"
                  data-feather="power"
                  style={{ fontSize: "20px", width: "20px", height: "20px" }}
                ></i>{" "}
                Logout
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
