import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app-calendar.css"; 

const CalendarComponent = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);  
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const openModal = (date: string, event: any = null) => {
    setSelectedDate(date);
    setEventTitle(event ? event.title : "");
    setSelectedEvent(event);
    setShowModal(true);
  };

  const saveEvent = () => {
    if (eventTitle.trim() === "") return;
    if (selectedEvent) {
      setEvents(events.map((event) =>
        event === selectedEvent ? { ...event, title: eventTitle, date: selectedDate } : event
      ));
    } else {
      setEvents([...events, { title: eventTitle, date: selectedDate }]);
    }
    setEventTitle("");
    setShowModal(false);
  };

  const deleteEvent = () => {
    setEvents(events.filter((event) => event !== selectedEvent));
    setShowModal(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(e.target.value);
  };


  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [isMenuCollapsed]); 


  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-body">
          <section>
            <div className="app-calendar overflow-hidden border">
              <div className="row g-0">
                <div className="col app-calendar-container position-relative">
                  <div className="card shadow-none border-0 mb-0 rounded-0">
                    <div className="card-body pb-0">
                      <div id="calendar">
                        <FullCalendar
                          key={isMenuCollapsed ? "collapsed" : "expanded"} 
                          ref={calendarRef}
                          plugins={[dayGridPlugin, interactionPlugin]}
                          initialView="dayGridMonth"
                          height="700px"
                          locale="es"
                          events={events}
                          headerToolbar={{
                            left: "prev,next,title",
                            center: "hoy", 
                            right: "",
                          }}
                          customButtons={{
                            hoy: {
                              text: "HOY",
                              click: () => {
                                const today = new Date();
                                const todayStr = today.toISOString().split("T")[0];
                                if (calendarRef.current) {
                                  calendarRef.current.getApi().gotoDate(todayStr); 
                                }
                              },
                            },
                          }}
                          dateClick={(info) => openModal(info.dateStr)}
                          eventClick={(info) => openModal(info.event.startStr, info.event)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {showModal && (
            <div className="modal show" style={{ display: "block" }} onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {selectedEvent ? "Editar Recordatorio" : "Agregar Recordatorio"}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div>
                      <label htmlFor="eventTitle">Título del Evento</label>
                      <input
                        type="text"
                        id="eventTitle"
                        className="form-control"
                        value={eventTitle}
                        onChange={handleTitleChange}
                        placeholder="Escribe el título del evento"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    {selectedEvent && (
                      <button type="button" className="btn btn-danger" onClick={deleteEvent}>
                        Eliminar Evento
                      </button>
                    )}
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={saveEvent}>
                      {selectedEvent ? "Actualizar Evento" : "Guardar Evento"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
