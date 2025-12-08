import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { FiUser, FiPackage, FiArrowLeft } from "react-icons/fi";
import { GetGenerateInvoiceById } from '../../InvoiceCrud/API/InvoiceCrudAPI';

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
          <p>ID: <strong>{id}</strong></p>
        </Alert>
      </div>
    );
  }

  // Mapeo de datos
  const mapped = {
    invoiceNumber: invoice.invoiceNumber || `FAC-${id}`,
    fecha: invoice.date || invoice.createdAt,
    cliente: invoice.customerName || "Cliente",
    identificacion: invoice.customerIdentification || invoice.customerNit || "-",
    celular: invoice.customerPhone || "-",
    direccion: invoice.customerAddress || "-",
    ciudad: invoice.customerCity || "-",
    cajero: invoice.cashierName || "Administrador",

    productos: (invoice.details || []).map((d: any) => ({
      nombre: d.productName || "Producto",
      quantity: d.quantity || 0,
      price: Number(d.unitPrice) || 0,
      totalDiscount: Number(d.totalDiscount) || 0,
      total: Number(d.total) || (Number(d.unitPrice) * Number(d.quantity)),
    })),

    valorBruto: Number(invoice.subtotal) || 0,
    descuentoTotal: Number(invoice.totalDiscount) || 0,
    costoTransporte: Number(invoice.deliveryCost) || 0,
    total: Number(invoice.total) || 0,

    entrega: (invoice.deliveryType || "").toLowerCase() === 'llevar' ? 'llevar' : 'recoger',
    metodoPago: invoice.paymentMethodName || "Efectivo",
    tipoPago: (invoice.paymentType || "contado").toLowerCase() as any,
    fechaVencimiento: invoice.dueDate,
    abono: Number(invoice.initialPayment) || 0,
    restante: Number(invoice.remainingBalance) || 0,
    observacion: invoice.observations || "",
  };

  const {
    invoiceNumber, cliente, identificacion, celular, direccion, ciudad,
    productos, valorBruto, descuentoTotal, costoTransporte, total,
    entrega, metodoPago, tipoPago, fechaVencimiento, abono, restante, observacion
  } = mapped;

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid p-0">
        <div className="content-body">

          {/* FLECHA DE VOLVER + TÍTULO */}
          <div className="d-flex align-items-center mb-2">
            <button
              onClick={() => navigate('/invoice')}
              className="btn btn-link text-decoration-none d-flex align-items-center p-0 me-3"
              style={{ color: '#cc322d', fontSize: '1.8rem' }}
              title="Volver al listado"
            >
              <FiArrowLeft />
            </button>
            <h3 className="mb-0">Detalle de Factura #{invoiceNumber}</h3>
          </div>

          {/* Información del Cliente */}
          <Card  style={{ borderRadius: '0.375rem', boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' }}>
            <Card.Header style={{ borderBottom: '2px solid #cc322d', padding: '12px 20px' }}>
              <h6 className="mb-0" style={{ fontWeight: '600' }}>
                <FiUser style={{ marginRight: '8px' }} /> Información del Cliente
              </h6>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Nombre</Form.Label>
                    <Form.Control type="text" value={cliente} readOnly />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>NIT/Cédula</Form.Label>
                        <Form.Control type="text" value={identificacion} readOnly />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Teléfono / Celular</Form.Label>
                        <Form.Control type="text" value={celular} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Dirección</Form.Label>
                    <Form.Control type="text" value={direccion} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Ciudad</Form.Label>
                    <Form.Control type="text" value={ciudad} readOnly />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Productos y resumen */}
          <Card style={{ borderRadius: '0.375rem', boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' }}>
            <Card.Header className="d-flex justify-content-between align-items-center" 
              style={{ borderBottom: '2px solid #cc322d', padding: '12px 20px' }}>
              <h6 className="mb-0">
                <FiPackage style={{ marginRight: '8px' }} /> Productos de la Factura
              </h6>
            </Card.Header>
            <Card.Body style={{ padding: '0' }}>
              <div style={{ overflowX: 'auto' }}>
                <Table hover style={{ marginBottom: '0', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px', fontWeight: '600' }}>#</th>
                      <th style={{ padding: '12px' }}>Producto</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>V. Unidad</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Desc.</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-5 text-muted">No hay productos</td></tr>
                    ) : (
                      productos.map((p: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px' }}>{i + 1}</td>
                          <td style={{ padding: '12px' }}>{p.nombre}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{p.quantity}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>${p.price.toLocaleString()}</td>
                          <td style={{ padding: '12px', textAlign: 'right', color: '#e74c3c' }}>
                            ${p.totalDiscount.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#27ae60' }}>
                            ${p.total.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Resumen inferior */}
              <div style={{ padding: '20px', borderTop: '1px solid #dee2e6' }}>
                <Row className="gx-3">
                  <Col md={2} style={{ marginLeft: '20px' }}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Domicilio</Form.Label>
                      <Form.Check type="radio" label="Recoger en depósito" checked={entrega === 'recoger'} readOnly />
                      <Form.Check type="radio" label="Llevar a domicilio" checked={entrega === 'llevar'} readOnly className="mt-2" />
                    </Form.Group>
                  </Col>
                  {entrega === 'llevar' && (
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Costo Transporte ($)</Form.Label>
                        <Form.Control type="text" value={costoTransporte.toLocaleString('es-CO')} readOnly />
                      </Form.Group>
                    </Col>
                  )}
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Medio de pago</Form.Label>
                      <Form.Control type="text" value={metodoPago} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Método de Pago</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={tipoPago === 'contado' ? 'Contado' : tipoPago === 'credito' ? 'Crédito' : 'Abono'} 
                        readOnly 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    {tipoPago === 'credito' && fechaVencimiento && (
                      <Form.Group>
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Fecha de Vencimiento</Form.Label>
                        <Form.Control type="text" value={new Date(fechaVencimiento).toLocaleDateString('es-CO')} readOnly />
                      </Form.Group>
                    )}
                    {tipoPago === 'abono' && (
                      <Form.Group>
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Abono ($)</Form.Label>
                        <Form.Control type="text" value={abono.toLocaleString('es-CO')} readOnly />
                      </Form.Group>
                    )}
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '800' }}>Observación</Form.Label>
                      <Form.Control as="textarea" rows={4} value={observacion} readOnly style={{ resize: 'none' }} />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Totales */}
              <div style={{ padding: '20px', borderTop: '1px solid #dee2e6' }}>
                <Row className="justify-content-end">
                  <Col md={4}>
                    <div style={{ fontSize: '14px' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>Valor Bruto:</span>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>${valorBruto.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>Descuento:</span>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#e74c3c' }}>-${descuentoTotal.toLocaleString()}</span>
                      </div>
                      {costoTransporte > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>Transporte:</span>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#27ae60' }}>+${costoTransporte.toLocaleString()}</span>
                        </div>
                      )}
                      {tipoPago === 'abono' && (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Abono:</span>
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>${abono.toLocaleString()}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Resta:</span>
                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#e74c3c' }}>${restante.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between pt-3" style={{ borderTop: '2px solid #cc322d' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700' }}>TOTAL:</span>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#27ae60' }}>${total.toLocaleString()}</span>
                      </div>
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