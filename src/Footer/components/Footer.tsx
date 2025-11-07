import React from "react";
import "./../../dark-layout.css";
import "./../../vertical-menu.css";
const Footer: React.FC = () => {
  return (
    <>
      <footer className="footer footer-static footer-light vertical-layout vertical-menu-modern">
        <p className="clearfix mb-0">
          <span className="float-end d-block d-md-inline-block mt-25">
            COPYRIGHT &copy; {new Date().getFullYear()}
            <a
              className="ms-25"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ladrillera la transversal
            </a>
            <span className="d-none d-sm-inline-block">
              , All rights Reserved
            </span>
          </span>
        </p>
      </footer>

      <button className="btn btn-primary btn-icon scroll-top" type="button">
        <i data-feather="arrow-up"></i>
      </button>
    </>
  );
};

export default Footer;
