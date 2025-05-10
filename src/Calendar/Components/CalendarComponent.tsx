import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app-calendar.css"; // CSS personalizado para la aplicación
import "./fullcalendar.min.css"; // CSS de FullCalendar
import "./../../dark-layout.css"; // Si tienes un tema oscuro
const CalendarComponent = () => {
  const [isMenuCollapsed] = useState(false); // Estado para controlar el colapso del menú

  return (
    <div
      className={`app-content content ${
        isMenuCollapsed ? "menu-collapsed" : "menu-expanded"
      }`}
    >
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          {/* Inicio del calendario */}
          <section>
            <div className="app-calendar overflow-hidden border">
              <div className="row g-0">
                {/* Calendar */}
                <div className="col app-calendar-container position-relative">
                  <div className="card shadow-none border-0 mb-0 rounded-0">
                    <div className="card-body pb-0">
                      <div id="calendar">
                        <FullCalendar
                          plugins={[dayGridPlugin]}
                          initialView="dayGridMonth"
                          height="auto" // Ajusta la altura automáticamente
                          contentHeight="auto" // Ajusta el contenido automáticamente
                          locale="es" // Configura la localización en español
                          headerToolbar={{
                            left: 'prev,next, title ',
                            center: 'today',
                            right: ''
                          }} // Personaliza la barra de herramientas
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Calendar */}
                <div className="body-content-overlay"></div>
              </div>
            </div>
          </section>
          {/* Fin del calendario */}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
