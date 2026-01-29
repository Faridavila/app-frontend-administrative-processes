import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { SaveIcon } from "../Icons/Icons"; 

interface RecibirEfectivoModalProps {
  show: boolean;
  onHide: () => void;
  totalFactura: number;
  onRegistrar: (efectivoRecibido: number, cambio: number) => void; 
}

const InvoiceModalEfective: React.FC<RecibirEfectivoModalProps> = ({
  show,
  onHide,
  totalFactura,
  onRegistrar,
}) => {
  const [efectivoRecibido, setEfectivoRecibido] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>(""); // ✅ Iniciado vacío
  const [cambio, setCambio] = useState<number>(0);

  const handleEfectivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "");
    
    // ✅ Si está vacío, resetear todo
    if (rawValue === "" || rawValue === "0") {
      setEfectivoRecibido(0);
      setDisplayValue("");
      setCambio(0);
      return;
    }
    
    const valor = Number(rawValue) || 0;
    setEfectivoRecibido(valor);
    setDisplayValue(valor.toLocaleString("es-CO"));
    setCambio(valor - totalFactura);
  };

  const handleCancelar = () => {
    setEfectivoRecibido(0);
    setDisplayValue(""); // ✅ Vacío en lugar de "0"
    setCambio(0);
    onHide();
  };

  const handleRegistrar = () => {
    if (efectivoRecibido < totalFactura) {
      alert("El efectivo recibido debe ser igual o mayor al total de la factura.");
      return;
    }
    onRegistrar(efectivoRecibido, cambio);
    setEfectivoRecibido(0);
    setDisplayValue(""); // ✅ Vacío en lugar de "0"
    setCambio(0);
    onHide();
  };

  // ✅ ELIMINADO el useEffect que forzaba el formato al montar
  // React.useEffect(() => {
  //   setDisplayValue(efectivoRecibido.toLocaleString("es-CO"));
  // }, [efectivoRecibido]);

  return (
    <Modal show={show} onHide={handleCancelar} centered size="sm">
      <Modal.Header
        closeButton
        style={{
          borderBottom: "2px solid #cc322d",
          padding: "12px 20px",
        }}
      >
        <Modal.Title style={{ fontSize: "18px", fontWeight: "600" }}>
          RECIBIR EFECTIVO
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "24px" }}>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                PRECIO TOTAL
              </Form.Label>
              <div
                style={{
                  border: "1px solid #fb373e",
                  borderRadius: "0.375rem",
                  padding: "12px",
                  textAlign: "right",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#050505",
                }}
              >
                ${totalFactura.toLocaleString("es-CO")}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                EFECTIVO RECIBIDO
              </Form.Label>
              <Form.Control
                type="text" 
                placeholder="Ingresa el efectivo recibido" 
                value={displayValue}
                onChange={handleEfectivoChange}
                style={{ fontSize: "16px", fontWeight: "400", textAlign: "right" }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                CAMBIO
              </Form.Label>
              <div
                style={{
                  border: "1px solid #fb373e",
                  borderRadius: "0.375rem",
                  padding: "12px",
                  textAlign: "right",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: cambio >= 0 ? "#27ae60" : "#e74c3c",
                }}
              >
                {/* ✅ Mostrar $0 cuando no hay valor */}
                {cambio === 0 ? "$0" : (
                  <>
                    {cambio < 0 ? "-" : "+"}${Math.abs(cambio).toLocaleString("es-CO")}
                  </>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer
        style={{
          borderTop: "1px solid #7c7c7cff",
          padding: "12px 20px",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="success"
          onClick={handleRegistrar}
          disabled={efectivoRecibido < totalFactura}
          style={{
            backgroundColor: "#3498db",
            border: "none",
            padding: "9px 20px",
            fontSize: "14px",
            fontWeight: "300",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <SaveIcon />
          Registrar
        </Button>
        
        <Button
          variant="primary"
          onClick={handleCancelar}
          style={{
            backgroundColor: "#6c757d",
            border: "none",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "600",
            gap: "6px",
          }}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModalEfective;