// InvoiceViewOnly.tsx
import React from "react";
import { Card, Row, Col, Table, Form } from "react-bootstrap";
import { FiUser, FiPackage } from "react-icons/fi";

interface InvoiceViewOnlyProps {
  invoice: {
    invoiceNumber: string;
    fecha: string;
    cliente: string;
    identificacion: string;
    celular: string;
    direccion: string;
    ciudad: string;
    cajero: string;

    productos: Array<{
      nombre: string;
      quantity: number;
      price: number;
      totalDiscount: number;
      total: number;
    }>;

    valorBruto: number;
    descuentoTotal: number;
    costoTransporte: number;
    total: number;

    entrega: "recoger" | "llevar";
    metodoPago: string;
    tipoPago: "contado" | "credito" | "abono";
    fechaVencimiento?: string;
    abono?: number;
    restante?: number;
    observacion?: string;

    companyName?: string;
    nit?: string;
    companyAddress?: string;
    companyPhone?: string;
  };
}

const InvoiceView: React.FC<InvoiceViewOnlyProps> = ({ invoice }) => {
  const {
    invoiceNumber = "FAC-000",
    fecha = "",
    cliente = "",
    identificacion = "",
    celular = "",
    direccion = "",
    ciudad = "",
    cajero = "Administrador",

    productos = [],
    valorBruto = 0,
    descuentoTotal = 0,
    costoTransporte = 0,
    total = 0,

    entrega = "recoger",
    metodoPago = "",
    tipoPago = "contado",
    fechaVencimiento = "",
    abono = 0,
    restante = 0,
    observacion = "",

    companyName = "Tu Empresa S.A.S",
    nit = "900.123.456-7",
    companyAddress = "Calle Principal #123",
    companyPhone = "300 123 4567",
  } = invoice;

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-body">

          {/* Información del Cliente */}
          <Card className="mb-3" style={{ borderRadius: '0.375rem', boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' }}>
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

          {/* Productos */}
          <Card style={{ borderRadius: '0.375rem', boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' }}>
            <Card.Header className="d-flex justify-content-between align-items-center" 
              style={{ borderBottom: '2px solid #cc322d', padding: '12px 20px' }}>
              <h6 className="mb-0">
                <FiPackage style={{ marginRight: '8px' }} /> Productos de la Factura
              </h6>
              <span style={{ fontSize: '14px', color: '#555' }}>Factura #{invoiceNumber}</span>
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
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                          No hay productos agregados
                        </td>
                      </tr>
                    ) : (
                      productos.map((p, i) => (
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

              {/* Parte inferior: Domicilio, Transporte, Pago, Observación */}
              <div style={{ padding: '20px', borderTop: '1px solid #dee2e6' }}>
                <Row className="gx-3">
                  <Col md={2} style={{ marginLeft: '20px' }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Domicilio</Form.Label>
                      <Form.Check
                        type="radio"
                        label="Recoger en depósito"
                        checked={entrega === 'recoger'}
                        readOnly
                        style={{ fontSize: '14px', marginBottom: '10px' }}
                      />
                      <Form.Check
                        type="radio"
                        label="Llevar a domicilio"
                        checked={entrega === 'llevar'}
                        readOnly
                        style={{ fontSize: '14px' }}
                      />
                    </Form.Group>
                  </Col>

                  {entrega === 'llevar' && (
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Costo Transporte ($)</Form.Label>
                        <Form.Control
                          type="text"
                          value={costoTransporte.toLocaleString('es-CO')}
                          readOnly
                          style={{ fontSize: '14px', textAlign: 'right' }}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '600' }}>Medio de pago</Form.Label>
                      <Form.Control type="text" value={metodoPago} readOnly />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
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
                    {tipoPago === 'credito' && (
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

                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label style={{ fontSize: '13px', fontWeight: '800' }}>Observación</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={observacion}
                        readOnly
                        style={{ fontSize: '14px', resize: 'none',  }}
                      />
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
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#e74c3c' }}>
                          -${descuentoTotal.toLocaleString()}
                        </span>
                      </div>
                      {costoTransporte > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>Transporte:</span>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#27ae60' }}>
                            +${costoTransporte.toLocaleString()}
                          </span>
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
                      <div className="d-flex justify-content-between pt-2" 
                        style={{ borderTop: '2px solid #cc322d' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700' }}>TOTAL:</span>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#27ae60' }}>
                          ${total.toLocaleString()}
                        </span>
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

export default InvoiceView;