import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GetAllNumerationNoPage } from "../../Numeration/API/NumerationAPI"; 
import { GetAllCashRegisterNoPage } from "../../CashRegister/API/CashRegisterAPI"; 
import { CreateInvoiceCRUD } from "../../InvoicePOS/API/GenerateInvoiceAPI";  

interface Option {
  value: string;  
  label: string;
}

interface NumerationTypes {
  id: number;
  authNumer: string;
  prefix: string;
  startDate: string; 
  finishDate: string;
  initialNumber: number;
  finalNumber: number;
  currentNumber: number;
  technicalKey: string;
  descriptionAccountingDocumentType: string;
  accountingDocumentTypeId: number;    
  status: string;
}

const FacturacionPOSModal: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [formData, setFormData] = useState({
    numeroResolucion: "",  
    tipoFacturacion: "",
    fechaResolucion: "",
    nombreCaja: "", 
    prefijo: "",
    consecutivoDesde: "",
    consecutivoHasta: "",
    authNumer: "", 
    vendedor: "",  // Vendedor seleccionado
    cliente: "",   // Cliente seleccionado
    formaPago: "", // Forma de pago seleccionada
  });

  const [options, setOptions] = useState({
    numeroResolucion: [] as Option[], 
    nombreCaja: [] as Option[], 
  });
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [numerations, setNumerations] = useState<NumerationTypes[]>([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data: NumerationTypes[] = await GetAllNumerationNoPage();
        console.log("Datos de Numeration:", data);

        if (data) {
          setNumerations(data);
          setOptions((prevState) => ({
            ...prevState,
            numeroResolucion: data.map((item) => ({
              value: item.id.toString(),  
              label: item.authNumer,  
            })),
          }));
        }
      } catch (error) {
        console.error("Error al obtener las opciones de la API:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchCashRegisters = async () => {
      try {
        const data = await GetAllCashRegisterNoPage();
        console.log("Datos de Cajas:", data);
        if (data) {
          setOptions((prevState) => ({
            ...prevState,
            nombreCaja: data.map((item) => ({
              value: item.id.toString(),
              label: item.description,
            })),
          }));
        }
      } catch (error) {
        console.error("Error al obtener las cajas de la API:", error);
      }
    };
    fetchCashRegisters();
  }, []);

 
  const handleAuthNumerChange = (selectedId: string) => {
    console.log("Selected ID:", selectedId);

    const selectedItem = numerations.find((item) => item.id.toString() === selectedId);

    console.log("Matching Data:", selectedItem); 

    if (selectedItem) {
      setFormData((prevData) => ({
        ...prevData,
        numeroResolucion: selectedId, 
        tipoFacturacion: selectedItem.descriptionAccountingDocumentType || "",
        fechaResolucion: selectedItem.finishDate || "",
        prefijo: selectedItem.prefix || "",
        consecutivoDesde: selectedItem.initialNumber.toString() || "",
        consecutivoHasta: selectedItem.finalNumber.toString() || "",
        authNumer: selectedItem.authNumer || "",  // Almacena el authNumer solo para referencia
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => setShowModal(false);

  const handleSave = async () => {
    const invoiceData = {
      numerationPrefixId: Number(formData.numeroResolucion),
      cashRegisterId: Number(formData.nombreCaja),
    };
  
    console.log("Datos a enviar a la API:", invoiceData);
  
    try {
      const response = await CreateInvoiceCRUD(invoiceData); 
      console.log("Formulario Guardado:", formData); 
  
      const cashRegisterDescription = options.nombreCaja.find(option => option.value === formData.nombreCaja)?.label || "No disponible";
  
      setShowModal(false);
  
      // Navegar y pasar el invoiceId en el estado
      navigate("/FacturaComponent", {
        state: {
          invoiceNumber: response.invoiceNumber, 
          invoiceId: response.id,  // Aquí pasamos el invoiceId a la siguiente página
          cashRegisterDescription: cashRegisterDescription,
        }
      });
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };
  

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Numeración de Facturación P.O.S.</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <Form>
          <Row>
            <Form.Group controlId="numeroResolucion" className="mb-1">
              <Form.Label>Número de Resolución</Form.Label>
              <Form.Control
                as="select"
                name="numeroResolucion"
                value={formData.numeroResolucion}
                onChange={(e) => handleAuthNumerChange(e.target.value)} 
              >
                <option value="">Selecciona una opción</option>
                {options.numeroResolucion.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="tipoFacturacion" className="mb-1">
              <Form.Label>Tipo de Facturación</Form.Label>
              <Form.Control type="text" name="tipoFacturacion" value={formData.tipoFacturacion} readOnly />
            </Form.Group>

            <Form.Group controlId="fechaResolucion" className="mb-1 col-md-6">
              <Form.Label>Fecha de Resolución</Form.Label>
              <Form.Control type="text" name="fechaResolucion" value={formData.fechaResolucion} readOnly />
            </Form.Group>

            <Form.Group controlId="prefijo" className="mb-1 col-md-6">
              <Form.Label>Prefijo</Form.Label>
              <Form.Control type="text" name="prefijo" value={formData.prefijo} readOnly />
            </Form.Group>

            <Form.Group controlId="consecutivoDesde" className="mb-1 col-md-6">
              <Form.Label>Consecutivo Desde</Form.Label>
              <Form.Control type="text" name="consecutivoDesde" value={formData.consecutivoDesde} readOnly />
            </Form.Group>

            <Form.Group controlId="consecutivoHasta" className="mb-1 col-md-6">
              <Form.Label>Consecutivo Hasta</Form.Label>
              <Form.Control type="text" name="consecutivoHasta" value={formData.consecutivoHasta} readOnly />
            </Form.Group>

            <Form.Group controlId="nombreCaja" className="mb-1">
              <Form.Label>Nombre Caja</Form.Label>
              <Form.Control as="select" name="nombreCaja" value={formData.nombreCaja} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                {options.nombreCaja.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="success" onClick={handleSave} className="me-2">Guardar</Button>
            <Button variant="danger" onClick={handleClose}>Cancelar</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FacturacionPOSModal;
