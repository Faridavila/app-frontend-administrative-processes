import { useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp, FiTruck, FiFileText  ,
  FiPackage, FiUserCheck, FiMapPin,
  FiShoppingBag, FiUsers, FiChevronRight
} from "react-icons/fi";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const metrics = useMemo(() => ([
    { title: "Ventas Hoy", value: "$2,450,000", caption: "↑ +12% vs ayer", accent: "var(--home-green-100)", icon: FiTrendingUp, route: "/ventas" },
    { title: "Entregas Pendientes", value: "24", caption: "3 urgentes", accent: "var(--home-amber-100)", icon: FiTruck, route: "/entregas" },
     { title: "Facturas Pendientes", value: "100", caption: "10 urgentes", accent: "var(--home-amber-100)", icon: FiFileText , route: "/factutas" },
  ]), []);

  const modules = useMemo(() => ([
    { title: "Gestión de Inventarios", subtitle: "Administra productos, stock y movimientos de inventario", kpi: "1,245", kpiCaption: "15 productos con stock bajo", accent: "var(--home-indigo-500)", icon: FiPackage, route: "/inventarios" },
    { title: "Administración de Nómina", subtitle: "Empleados, salarios y reportes de nómina", kpi: "42", kpiCaption: "Nómina mensual pendiente", accent: "var(--home-green-500)", icon: FiUserCheck, route: "/nomina" },
    { title: "Coordinación de Entregas", subtitle: "Rutas, asignación y confirmaciones", kpi: "89", kpiCaption: "12 entregas pendientes hoy", accent: "var(--home-orange-500)", icon: FiMapPin, route: "/coordinacion" },
    { title: "Gestión de Proveedores", subtitle: "Proveedores, compras y órdenes", kpi: "28", kpiCaption: "3 órdenes vencidas", accent: "var(--home-violet-500)", icon: FiShoppingBag, route: "/proveedores" },
    { title: "Información de Clientes", subtitle: "Clientes, historial y facturación", kpi: "2,456", kpiCaption: "15 facturas pendientes", accent: "var(--home-pink-500)", icon: FiUsers, route: "/clientes" },
  ]), []);

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">
                  Panel Principal
                </h2>
                <div className="breadcrumb-wrapper">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-body">
          <div className="home-scope">
            {/* Métricas */}
            <Row className="g-1 g-md-2 mb-1 home-eq-row">
              {metrics.map((m, i) => (
                <Col key={m.title} xl={4} md={6} sm={12}>
                  <Card
                    className="home-card home-metric animate__animated animate__fadeInUp h-100 clickable-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => navigate(m.route)}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 className="home-metric__title mb-0">{m.title}</h4>
                        <span className="home-chip" style={{ backgroundColor: m.accent }}>
                          <m.icon size={18} />
                        </span>
                      </div>
                      <div className="home-metric__value">{m.value}</div>
                      <div className="home-metric__caption">
                        {m.caption}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Módulos */}
            <Row className="g-2 g-md-2 home-eq-row">
              {modules.map((m, i) => (
                <Col key={m.title} xl={4} md={6} sm={12}>
                  <Card
                    className="home-card home-module animate__animated animate__fadeInUp h-100 clickable-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => navigate(m.route)}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="d-grid" style={{ gridTemplateColumns: "auto 1fr", gap: 12 }}>
                        <span className="home-badge" style={{ backgroundColor: m.accent }}>
                          <m.icon size={20} />
                        </span>
                        <div>
                          <h5 className="home-module__title mb-0">{m.title}</h5>
                          <p className="home-module__subtitle mb-0">{m.subtitle}</p>
                        </div>
                      </div>

                      <div className="home-foot d-flex align-items-center justify-content-between mt-3">
                        <div>
                          <div className="home-module__kpi">{m.kpi}</div>
                          <div className="home-module__kpi-caption">{m.kpiCaption}</div>
                        </div>
                        <FiChevronRight className="home-chevron" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
