import { useState, useEffect, useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp, FiTruck, FiFileText,
  FiPackage, FiUserCheck, FiMapPin,
  FiShoppingBag, FiUsers, FiChevronRight
} from "react-icons/fi";
import "./Dashboard.css";
import { getDashboardMetrics } from "../API/DashboardAPI";
import { DashboardResponseDTO } from "../Types/DashboardTypes";
import { useLoading } from "../../GeneralComponents/GeneralCrud/LoadingContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const [dashboardData, setDashboardData] = useState<DashboardResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardMetrics();
        setDashboardData(data);
      } catch (err) {
        console.error('Error al cargar métricas del dashboard:', err);
        setError('No se pudieron cargar las métricas del dashboard');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [setIsLoading]);

  const metrics = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: "Ventas Hoy",
        value: `$${dashboardData.metrics.salesToday.value.toLocaleString('es-CO')}`,
        accent: "var(--home-green-100)",
        icon: FiTrendingUp,
      },
      {
        title: "Entregas Pendientes",
        value: dashboardData.metrics.pendingDeliveries.total.toString(),
        caption: `${dashboardData.metrics.pendingDeliveries.urgent} urgentes`,
        accent: "var(--home-amber-100)",
        icon: FiTruck,
        route: "/pending-order"
      },
      {
        title: "Facturas Pendientes",
        value: dashboardData.metrics.pendingInvoices.total.toString(),
        caption: `${dashboardData.metrics.pendingInvoices.urgent} urgentes`,
        accent: "var(--home-amber-100)",
        icon: FiFileText,
        route: "/invoice"
      },
    ];
  }, [dashboardData]);

  const modules = useMemo(() => {
    if (!dashboardData) return [];

    return [
      {
        title: "Gestión de Inventarios",
        subtitle: "Administra productos, stock y movimientos de inventario",
        kpi: dashboardData.modules.inventory.total.toString(),
        kpiCaption: `${dashboardData.modules.inventory.lowStock} productos con stock bajo`,
        accent: "var(--home-indigo-500)",
        icon: FiPackage,
        route: "/inventory"
      },
      {
        title: "Administración de Nómina",
        subtitle: "Empleados, salarios y reportes de nómina",
        kpi: dashboardData.modules.payroll.employees.toString(),
        kpiCaption: dashboardData.modules.payroll.pendingPayroll 
          ? "Nómina mensual pendiente" 
          : "Nómina al día",
        accent: "var(--home-green-500)",
        icon: FiUserCheck,
        route: "/employee-history"
      },
      {
        title: "Coordinación de Entregas",
        subtitle: "Rutas, asignación y confirmaciones",
        kpi: dashboardData.modules.deliveries.total.toString(),
        kpiCaption: `${dashboardData.modules.deliveries.pendingToday} entregas pendientes hoy`,
        accent: "var(--home-orange-500)",
        icon: FiMapPin,
        route: "/assign-order"
      },
      {
        title: "Gestión de Proveedores",
        subtitle: "Proveedores, compras y órdenes",
        kpi: dashboardData.modules.suppliers.total.toString(),
        kpiCaption: `${dashboardData.modules.suppliers.overdueOrders} con productos pendientes`,
        accent: "var(--home-violet-500)",
        icon: FiShoppingBag,
        route: "/supplier"
      },
      {
        title: "Información de Clientes",
        subtitle: "Clientes, historial y facturación",
        kpi: dashboardData.modules.clients.total.toString(),
        kpiCaption: `${dashboardData.modules.clients.pendingInvoices} con facturas pendientes`,
        accent: "var(--home-pink-500)",
        icon: FiUsers,
        route: "/client"
      },
    ];
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="app-content content">
        <div className="content-wrapper container-fluid p-0">
          <div className="content-body">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-content content">
        <div className="content-wrapper container-fluid p-0">
          <div className="content-body">
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid p-0">
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
                    onClick={() => m.route && navigate(m.route)}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between">
                        <h4 className="home-metric__title mb-0">{m.title}</h4>
                        <span className="home-chip" style={{ backgroundColor: m.accent }}>
                          <m.icon size={18} />
                        </span>
                      </div>
                      <div className="home-metric__value">{m.value}</div>
                      {m.caption && (
                        <div className="home-metric__caption">
                          {m.caption}
                        </div>
                      )}
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