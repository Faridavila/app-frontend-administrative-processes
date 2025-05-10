import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import { CompanyType } from "../../Company/Types/Company";
import { GetCompanyById, UpdateCompany } from "../../Company/API/CompanyAPI";
import { GetAllEconomicActivityNoPage } from "../../EconomicActivity/API/EconomicActivity";
import { EconomicActivityTypes } from "../../EconomicActivity/Types/EconomicActivityTypes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import FavoritoButton from "./../../FavoritoButton/components/FavoritoButton"; 

const MySwal = withReactContent(Swal);

const CompanyPresentation: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState<CompanyType>({
    id: 0,
    companyName: "",
    nit: "",
    address: "",
    email: "",
    phone: "",
    economicActivityId: 0,
    ciiuCode: "",
    description: "",
    status: "ACTIVE",
  });

  const [originalCompany, setOriginalCompany] = useState<CompanyType | null>(
    null
  );
  const [economicActivities, setEconomicActivities] = useState<
    EconomicActivityTypes[]
  >([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CompanyType, string>>
  >({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const data = await GetCompanyById(1);
      if (data) {
        setCompany(data);
        setOriginalCompany(data);
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    const fetchEconomicActivities = async () => {
      const activities = await GetAllEconomicActivityNoPage();
      if (activities) {
        setEconomicActivities(activities);
      }
    };
    fetchEconomicActivities();
  }, []);

  useEffect(() => {
    if (company) {
      validateAllFields();
    }
  }, [company]);

  const handleShow = () => {
    setOriginalCompany(company);
    setShowModal(true);
  };

  const handleClose = () => {
    if (originalCompany) {
      setCompany(originalCompany);
    }
    setShowModal(false);
  };

  const handleChange = (e: ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
    validateField(name as keyof CompanyType, value);
  };

  const handleSelectChange = (selectedOption: any) => {
    setCompany((prevCompany) => ({
      ...prevCompany,
      economicActivityId: selectedOption.value,
      ciiuCode: selectedOption.label.split(" - ")[0],
      description: selectedOption.label.split(" - ")[1],
    }));
  };

  const validateField = (key: keyof CompanyType, value: any): void => {
    let error = "";

    if (key === "companyName" && !value) {
      error = "Razón Social es obligatorio.";
    } else if (key === "nit" && (!value || !/^\d+$/.test(value))) {
      error = "NIT es obligatorio y debe ser numérico.";
    } else if (key === "address" && !value) {
      error = "Dirección es obligatorio.";
    } else if (
      key === "email" &&
      (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
    ) {
      error =
        "Correo Electrónico es obligatorio y debe tener un formato válido.";
    } else if (key === "phone" && (!value || !/^\d+$/.test(value))) {
      error = "Celular es obligatorio y debe ser numérico.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
    validateAllFields();
  };

  const validateAllFields = () => {
    const fieldsToValidate: Array<keyof CompanyType> = [
      "companyName",
      "nit",
      "address",
      "email",
      "phone",
    ];

    let allValid = true;

    for (const field of fieldsToValidate) {
      if (errors[field]) {
        allValid = false;
        break;
      }
    }

    setIsSaveDisabled(!allValid);
  };

  const handleSave = async () => {
    if (isSaveDisabled) return;

    if (!company.id) {
      MySwal.fire("Error", "El ID de la empresa es requerido.", "error");
      return;
    }

    const updatedCompany = {
      id: company.id,
      companyName: company.companyName,
      nit: company.nit,
      address: company.address,
      email: company.email,
      phone: company.phone,
      economicActivityId: company.economicActivityId,
      status: company.status,
    };

    try {
      const success = await UpdateCompany(updatedCompany);

      if (success) {
        const updatedData = await GetCompanyById(company.id);
        if (updatedData) {
          setCompany(updatedData);
          setOriginalCompany(updatedData);
        }
        MySwal.fire(
          "Actualizado!",
          "La empresa se ha actualizado con éxito.",
          "success"
        );
        setShowModal(false);
      } else {
        MySwal.fire("Error", "Error al actualizar la empresa", "error");
      }
    } catch (error) {
      console.error("Error en la solicitud: ", error);
      MySwal.fire("Error", "Error al procesar la solicitud.", "error");
    }
  };

  const options = economicActivities.map((activity) => ({
    value: activity.id,
    label: `${activity.ciiuCode} - ${activity.description}`,
  }));

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: state.isFocused
        ? "#ced4da"
        : errors.economicActivityId
        ? "#dc3545"
        : "#ced4da",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#495057",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#6c757d",
    }),
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">
                  Presentación de la Empresa
                  <FavoritoButton path="/company" label="Presentación" />{" "}
                  {/* Uso del nuevo componente */}
                </h2>
                <div className="breadcrumb-wrapper">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#">Empresas</a>
                    </li>
                    <li className="breadcrumb-item active">Presentación</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-body">
          <Card className="shadow-lg animate__animated animate__fadeInUp mb-4">
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <img
                    src={"/additional-assets/images/ico/R2.png"}
                    alt="Company Logo"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "200px" }}
                  />
                </Col>
                <Col md={8}>
                  <h4 className="card-title mb-3">Información de la Empresa</h4>
                  <div className="company-detail mb-3">
                    <strong>Razón Social:</strong> {company.companyName}
                  </div>
                  <div className="company-detail mb-3">
                    <strong>NIT:</strong> {company.nit}
                  </div>
                  <div className="company-detail mb-3">
                    <strong>Dirección:</strong> {company.address}
                  </div>
                  <div className="company-detail mb-3">
                    <strong>Correo Electrónico:</strong> {company.email}
                  </div>
                  <div className="company-detail mb-3">
                    <strong>Celular:</strong> {company.phone}
                  </div>
                  <div className="company-detail mb-3">
                    <strong>Actividad Económica:</strong>
                    {company.ciiuCode
                      ? `${company.ciiuCode} - ${company.description}`
                      : "No disponible"}
                  </div>
                  <Button
                    className="edit-button"
                    variant="primary"
                    onClick={handleShow}
                  >
                    Editar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Modal
            show={showModal}
            onHide={handleClose}
            className="animate__animated animate__fadeInDown"
          >
            <Modal.Header closeButton>
              <Modal.Title>Editar Información de la Empresa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formCompanyName" className="mb-3">
                      <Form.Label>Razón Social</Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleChange}
                        isInvalid={!!errors.companyName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.companyName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formNIT" className="mb-3">
                      <Form.Label>NIT</Form.Label>
                      <Form.Control
                        type="text"
                        name="nit"
                        value={company.nit}
                        onChange={handleChange}
                        isInvalid={!!errors.nit}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nit}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formAddress" className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={company.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={company.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPhone" className="mb-3">
                      <Form.Label>Celular</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={company.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="formEconomicActivity"
                      className="mb-3"
                    >
                      <Form.Label>Actividad Económica</Form.Label>
                      <Select
                        options={options}
                        value={
                          company.economicActivityId
                            ? options.find(
                                (option) =>
                                  option.value === company.economicActivityId
                              )
                            : null
                        }
                        onChange={handleSelectChange}
                        placeholder="Seleccione el CIIU"
                        styles={customStyles}
                        className={
                          errors.economicActivityId ? "is-invalid" : ""
                        }
                      />
                      {errors.economicActivityId && (
                        <div className="invalid-feedback d-block">
                          {errors.economicActivityId}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className="me-1"
                  >
                    Guardar Cambios
                  </Button>
                  <Button variant="danger" onClick={handleClose}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CompanyPresentation;
