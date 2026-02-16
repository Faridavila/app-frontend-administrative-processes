import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Alert,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import { FiUser, FiPackage, FiArrowLeft, FiEdit } from "react-icons/fi";
import {
  GetGenerateInvoiceById,
  UpdateInvoiceStatus,
  UpdateInvoiceStatusWithPayment,
} from "../../InvoiceCrud/API/InvoiceCrudAPI";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || isNaN(Number(id))) {
        setLoading(false);
        return;
      }

      try {
        const data = await GetGenerateInvoiceById(Number(id));
        console.log("Datos recibidos:", data);
        setInvoice(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 gap-3">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted fs-5">Cargando factura #{id}...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container-xxl p-5 text-center">
        <Alert variant="danger">
          <h4>Factura no encontrada</h4>
          <p>
            ID: <strong>{id}</strong>
          </p>
        </Alert>
      </div>
    );
  }

  // Mapeo de datos
  const mapped = {
    invoiceNumber: invoice.invoiceNumber || `FAC-${id}`,
    fecha: invoice.invoiceDate || invoice.createdAt,
    cliente: invoice.customerName || "Cliente",
    identificacion: invoice.identification || "-",
    celular: invoice.phone || "-",
    direccion: invoice.address || "-",
    ciudad: invoice.neighborhood || "-",
    cajero: invoice.userName || "Administrador",
    statusBill: invoice.statusBill || "PENDIENTE",
    productos: (invoice.invoiceDetails || []).map((d: any) => ({
      nombre: d.productName || "Producto sin nombre",
      quantity: d.quantity || 0,
      price: Number(d.unitPrice) || 0,
      totalDiscount: Number(d.totalDiscount) || 0,
      total: Number(d.total) || 0,
    })),
    valorBruto: Number(invoice.subtotal) || 0,
    descuentoTotal: Number(invoice.totalDiscount) || 0,
    costoTransporte: Number(invoice.deliveryCost) || 0,
    total: Number(invoice.total) || 0,
    entrega:
      (invoice.deliveryType || "").toLowerCase() === "llevar"
        ? "llevar"
        : "recoger",
    metodoPago: invoice.paymentMethodName || "Efectivo",
    tipoPago:
      invoice.statusBill === "PAGADO"
        ? "contado"
        : invoice.statusBill === "ABONO"
          ? "abono"
          : invoice.statusBill === "PENDIENTE"
            ? "credito"
            : "contado",
    fechaVencimiento: invoice.dueDate,
    abono: Number(invoice.initialPayment) || 0,
    restante: Number(invoice.remainingBalance) || 0,
    observacion: invoice.observations || "",
    cashReceived: Number(invoice.cashReceived) || 0,
    changeGiven: Number(invoice.changeGiven) || 0,
  };

  const {
    invoiceNumber,
    cliente,
    identificacion,
    celular,
    direccion,
    ciudad,
    productos,
    valorBruto,
    descuentoTotal,
    costoTransporte,
    total,
    entrega,
    metodoPago,
    tipoPago,
    fechaVencimiento,
    abono,
    restante,
    observacion,
    statusBill,
  } = mapped;

  const getBadgeVariant = () => {
    switch (statusBill) {
      case "PAGADO":
        return "danger";
      case "ABONO":
        return "info";
      case "PENDIENTE":
        return "success";
      case "INACTIVO":
        return "warning";
      default:
        return "secondary";
    }
  };

  const canChangeStatus = statusBill === "ABONO" || statusBill === "PENDIENTE";

  // 🔥 FUNCIÓN PARA CAMBIAR ESTADO
  const handleChangeStatus = async () => {
    console.log("🔥 handleChangeStatus llamado"); // Debug
    console.log("Estado actual:", statusBill); // Debug
    console.log("Total:", total); // Debug
    console.log("Abono actual:", abono); // Debug
    console.log("Restante actual:", restante); // Debug

    const inputOptions =
      statusBill === "ABONO"
        ? { PAGADO: "PAGADO" }
        : statusBill === "PENDIENTE"
          ? { ABONO: "ABONO", PAGADO: "PAGADO" }
          : {};

    const result = await MySwal.fire({
      title: "Cambiar Estado de Factura",
      text: `Estado actual: ${statusBill} | Total: $${total.toLocaleString()}`,
      input: "select",
      inputOptions: inputOptions,
      inputPlaceholder: "Selecciona el nuevo estado",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) {
          return "Debes seleccionar un estado";
        }
      },
    });

    console.log("🔥 Resultado del primer modal:", result); // Debug

    if (result.isConfirmed && result.value) {
      const newStatus = result.value;
      console.log("🔥 Nuevo estado seleccionado:", newStatus); // Debug

      if (newStatus === "ABONO") {
        console.log("🔥 Entrando al flujo de ABONO"); // Debug

        const abonoResult = await MySwal.fire({
          title: "Registrar Abono",
          html: `
            <div style="text-align: left; margin: 20px 0;">
              <p style="margin-bottom: 10px;"><strong>Total de la Factura:</strong> $${total.toLocaleString()}</p>
              <p style="margin-bottom: 10px;"><strong>Abono Actual:</strong> $${abono.toLocaleString()}</p>
              <p style="margin-bottom: 20px;"><strong>Restante Actual:</strong> $${restante.toLocaleString()}</p>
            </div>
            <label for="abono-input" style="display: block; text-align: left; font-weight: 600; margin-bottom: 5px;">
              Monto del Nuevo Abono ($):
            </label>
            <input 
              id="abono-input" 
              type="number" 
              class="swal2-input" 
              placeholder="Ingresa el monto del abono"
              min="1"
              max="${restante}"
              style="width: 100%; margin: 0;"
            />
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Registrar Abono",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          preConfirm: () => {
            const inputElement = document.getElementById(
              "abono-input",
            ) as HTMLInputElement;
            const abonoValue = parseFloat(inputElement.value);

            console.log("🔥 Valor del abono ingresado:", abonoValue); // Debug

            if (!abonoValue || abonoValue <= 0) {
              Swal.showValidationMessage("Debes ingresar un monto válido");
              return false;
            }

            if (abonoValue > restante) {
              Swal.showValidationMessage(
                `El abono no puede ser mayor al restante ($${restante.toLocaleString()})`,
              );
              return false;
            }

            return abonoValue;
          },
        });

        console.log("🔥 Resultado del modal de abono:", abonoResult); // Debug

        if (!abonoResult.isConfirmed || !abonoResult.value) {
          console.log("🔥 Usuario canceló el abono"); // Debug
          return;
        }

        const nuevoAbono = abonoResult.value;
        const abonoTotal = abono + nuevoAbono;
        const restanteNuevo = total - abonoTotal;

        console.log("🔥 Calculando:", {
          nuevoAbono,
          abonoTotal,
          restanteNuevo,
        }); // Debug

        try {
          setLoading(true);

          const success = await UpdateInvoiceStatusWithPayment(
            Number(id),
            "ABONO",
            abonoTotal,
            restanteNuevo,
          );

          console.log("🔥 Resultado de la API:", success); // Debug

          if (success) {
            MySwal.fire({
              icon: "success",
              title: "Abono Registrado",
              html: `
                <p><strong>Abono registrado:</strong> $${nuevoAbono.toLocaleString()}</p>
                <p><strong>Abono total:</strong> $${abonoTotal.toLocaleString()}</p>
                <p><strong>Restante:</strong> $${restanteNuevo.toLocaleString()}</p>
              `,
              timer: 3000,
              showConfirmButton: false,
            });

            const updatedInvoice = await GetGenerateInvoiceById(Number(id));
            setInvoice(updatedInvoice);
          }
        } catch (error: any) {
          console.error("🔥 Error al registrar abono:", error); // Debug
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: error?.message || "No se pudo registrar el abono",
          });
        } finally {
          setLoading(false);
        }
      } else if (newStatus === "PAGADO") {
        console.log("🔥 Entrando al flujo de PAGADO"); // Debug

        try {
          setLoading(true);
          const success = await UpdateInvoiceStatus(Number(id), newStatus);

          if (success) {
            MySwal.fire({
              icon: "success",
              title: "Estado Actualizado",
              text: `La factura ahora está PAGADA`,
              timer: 2000,
              showConfirmButton: false,
            });

            const updatedInvoice = await GetGenerateInvoiceById(Number(id));
            setInvoice(updatedInvoice);
          }
        } catch (error: any) {
          console.error("🔥 Error al cambiar a PAGADO:", error); // Debug
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: error?.message || "No se pudo cambiar el estado",
          });
        } finally {
          setLoading(false);
        }
      }
    } else {
      console.log("🔥 Usuario canceló el primer modal"); // Debug
    }
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid p-0">
        <div className="content-body">
          <div className="d-flex align-items-center mb-2">
            <button
              onClick={() => navigate("/invoice")}
              className="btn btn-link text-decoration-none d-flex align-items-center p-0 me-3"
              style={{ color: "#cc322d", fontSize: "1.8rem" }}
              title="Volver al listado"
            >
              <FiArrowLeft />
            </button>
            <h3 className="mb-0 me-3">Detalle de Factura {invoiceNumber}</h3>
            <Badge
              bg={getBadgeVariant()}
              style={{ fontSize: "14px", padding: "8px 12px" }}
            >
              {statusBill}
            </Badge>
          </div>

          {/* Información del Cliente */}
          <Card
            style={{
              borderRadius: "0.375rem",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
            }}
          >
            <Card.Header
              style={{
                borderBottom: "2px solid #cc322d",
                padding: "12px 20px",
              }}
            >
              <h6 className="mb-0" style={{ fontWeight: "600" }}>
                <FiUser style={{ marginRight: "8px" }} /> Información del
                Cliente
              </h6>
            </Card.Header>
            <Card.Body style={{ padding: "20px" }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Nombre
                    </Form.Label>
                    <Form.Control type="text" value={cliente} readOnly />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          NIT/Cédula
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={identificacion}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Teléfono / Celular
                        </Form.Label>
                        <Form.Control type="text" value={celular} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Dirección
                    </Form.Label>
                    <Form.Control type="text" value={direccion} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Barrio
                    </Form.Label>
                    <Form.Control type="text" value={ciudad} readOnly />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Productos y resumen */}
          <Card
            style={{
              borderRadius: "0.375rem",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
            }}
          >
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{
                borderBottom: "2px solid #cc322d",
                padding: "12px 20px",
              }}
            >
              <h6 className="mb-0">
                <FiPackage style={{ marginRight: "8px" }} /> Productos de la
                Factura
              </h6>
              <Badge bg="info">{productos.length} productos</Badge>
            </Card.Header>
            <Card.Body style={{ padding: "0" }}>
              <div style={{ overflowX: "auto" }}>
                <Table hover style={{ marginBottom: "0", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
                      <th style={{ padding: "12px" }}>Producto</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>
                        Cantidad
                      </th>
                      <th style={{ padding: "12px", textAlign: "right" }}>
                        V. Unidad
                      </th>
                      <th style={{ padding: "12px", textAlign: "right" }}>
                        Desc.
                      </th>
                      <th style={{ padding: "12px", textAlign: "right" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
                          No hay productos
                        </td>
                      </tr>
                    ) : (
                      productos.map((p: any, i: number) => (
                        <tr
                          key={i}
                          style={{ borderBottom: "1px solid #f0f0f0" }}
                        >
                          <td style={{ padding: "12px" }}>{i + 1}</td>
                          <td style={{ padding: "12px" }}>{p.nombre}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            {p.quantity}
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            ${p.price.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              color: "#e74c3c",
                            }}
                          >
                            ${p.totalDiscount.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#27ae60",
                            }}
                          >
                            ${p.total.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              <div style={{ padding: "20px", borderTop: "1px solid #dee2e6" }}>
                  <Row className="gx-3 gy-3">
                  <Col md={2} style={{ marginLeft: "20px" }}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Domicilio
                      </Form.Label>
                      <Form.Check
                        type="radio"
                        label="Recoger en depósito"
                        checked={entrega === "recoger"}
                        readOnly
                      />
                      <Form.Check
                        type="radio"
                        label="Llevar a domicilio"
                        checked={entrega === "llevar"}
                        readOnly
                        className="mt-2"
                      />
                    </Form.Group>
                  </Col>

                  {entrega === "llevar" && (
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Costo Transporte ($)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={costoTransporte.toLocaleString("es-CO")}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Medio de pago
                      </Form.Label>
                      <Form.Control type="text" value={metodoPago} readOnly />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    {tipoPago === "credito" && fechaVencimiento && (
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Fecha de Vencimiento
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={new Date(fechaVencimiento).toLocaleDateString(
                            "es-CO",
                          )}
                          readOnly
                        />
                      </Form.Group>
                    )}
                    {tipoPago === "abono" && (
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Abono ($)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={`$${abono.toLocaleString("es-CO")}`}
                          readOnly
                        />
                      </Form.Group>
                    )}
                  </Col>

                  {canChangeStatus && (
                    <Col
                      md={2}
                      className="d-flex align-items-end"
                      style={{ paddingBottom: "25px" }}
                    >
                      <Button
                        variant="warning"
                        className="w-100 d-flex align-items-center justify-content-center"
                        onClick={handleChangeStatus}
                        disabled={loading}
                        style={{
                          height: "38px",
                          fontWeight: "600",
                          fontSize: "13px",
                          gap: "8px",
                        }}
                      >
                        <FiEdit size={16} />
                        Cambiar Estado
                      </Button>
                    </Col>
                  )}
                </Row>

                <Row className="mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "800" }}
                      >
                        Observación
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={observacion || "Sin observaciones"}
                        readOnly
                        style={{ resize: "none" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Totales */}
              <div style={{ padding: "20px", borderTop: "1px solid #dee2e6" }}>
                <Row className="justify-content-end">
                  <Col md={4}>
                    <div style={{ fontSize: "14px" }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          Valor Bruto:
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>
                          ${valorBruto.toLocaleString()}
                        </span>
                      </div>
                      {descuentoTotal > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Descuento:
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#e74c3c",
                            }}
                          >
                            -${descuentoTotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {costoTransporte > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Transporte:
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#27ae60",
                            }}
                          >
                            +${costoTransporte.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div
                        className="d-flex justify-content-between pt-3 mb-3"
                        style={{ borderTop: "2px solid #cc322d" }}
                      >
                        <span style={{ fontSize: "20px", fontWeight: "700" }}>
                          TOTAL:
                        </span>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#27ae60",
                          }}
                        >
                          ${total.toLocaleString()}
                        </span>
                      </div>

                      {/* Mostrar ABONO Y RESTANTE si statusBill es ABONO */}
                      {statusBill === "ABONO" && (
                        <>
                          <div
                            className="d-flex justify-content-between mb-2"
                            style={{
                              borderTop: "1px dashed #dee2e6",
                              paddingTop: "10px",
                            }}
                          >
                            <span
                              style={{ fontSize: "16px", fontWeight: "700" }}
                            >
                              Abono Pagado:
                            </span>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#3498db",
                              }}
                            >
                              ${abono.toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#e74c3c",
                              }}
                            >
                              Saldo Restante:
                            </span>
                            <span
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#e74c3c",
                              }}
                            >
                              ${restante.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Mostrar PENDIENTE si statusBill es PENDIENTE */}
                      {statusBill === "PENDIENTE" && (
                        <div
                          className="d-flex justify-content-between mb-2"
                          style={{
                            borderTop: "1px dashed #dee2e6",
                            paddingTop: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#e74c3c",
                            }}
                          >
                            Saldo Pendiente:
                          </span>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#e74c3c",
                            }}
                          >
                            ${total.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
