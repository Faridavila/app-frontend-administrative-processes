import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { CompanyType } from "../../Company/Types/Company";
import { GetCompanyById, UpdateCompany } from "../../Company/API/CompanyAPI";
import EconomicActivitySelect from "./EconomicActivitySelect";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import HandLoadingSpinner from "../../Spinner/SpinnerAnimation";
import { useLoading } from "../../GeneralComponents/GeneralCrud/LoadingContext"; // 🔥 IMPORTAR

const MySwal = withReactContent(Swal);

const CompanyPresentation: React.FC = () => {
  const { setIsLoading: setGlobalLoading } = useLoading(); // 🔥 USAR HOOK
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    image: null,
    status: "ACTIVE",
  });

  const [originalCompany, setOriginalCompany] = useState<CompanyType | null>(
    null
  );

  const [errors, setErrors] = useState<Partial<Record<keyof CompanyType, string>>>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      setImagePreview("");

      try {
        const data = await GetCompanyById(1);
        if (data) {
          setCompany(data);
          setOriginalCompany(data);
          setImagePreview(
            data.image ||
              "http://res.cloudinary.com/dfotyo6jc/image/upload/v1766077849/t9cqloco0esjldqgmuop.png"
          );
        }
      } finally {
        setIsLoading(false);
        setGlobalLoading(false); // 🔥 DESACTIVAR LOADING GLOBAL
      }
    };
    fetchCompanyData();
  }, [setGlobalLoading]); // 🔥 AGREGAR DEPENDENCIA

  useEffect(() => {
    if (company && company.id !== 0) {
      validateAllFields();
    }
  }, [company, errors]);

  const handleShow = () => {
    setOriginalCompany(company);
    setImagePreview(
      company.image ||
        "http://res.cloudinary.com/dfotyo6jc/image/upload/v1766077849/t9cqloco0esjldqgmuop.png"
    );
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleClose = () => {
    if (originalCompany) {
      setCompany(originalCompany);
      setImagePreview(
        originalCompany.image ||
          "http://res.cloudinary.com/dfotyo6jc/image/upload/v1766077849/t9cqloco0esjldqgmuop.png"
      );
      setErrors({});
    }
    setSelectedFile(null);
    setShowModal(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        MySwal.fire(
          "Error",
          "Por favor selecciona un archivo de imagen válido",
          "error"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        MySwal.fire("Error", "La imagen no debe superar los 5MB", "error");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSelectChange = (newValue: number) => {
    if (!newValue || newValue === 0) {
      setCompany((prevCompany) => ({
        ...prevCompany,
        economicActivityId: 0,
        ciiuCode: "",
        description: "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        economicActivityId: "Debe seleccionar una actividad económica.",
      }));
      return;
    }

    setCompany((prevCompany) => ({
      ...prevCompany,
      economicActivityId: newValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      economicActivityId: "",
    }));
  };

  const validateField = (key: keyof CompanyType, value: any): void => {
    let error = "";

    if (key === "companyName" && !value) {
      error = "Nombre es obligatorio.";
    } else if (key === "nit" && !value) {
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
    } else if (key === "economicActivityId" && (!value || value === 0)) {
      error = "Debe seleccionar una actividad económica.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
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
      const value = company[field];

      if (field === "companyName" && !value) {
        allValid = false;
        break;
      } else if (field === "nit" && !value) {
        allValid = false;
        break;
      } else if (field === "address" && !value) {
        allValid = false;
        break;
      } else if (
        field === "email" &&
        (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value as string))
      ) {
        allValid = false;
        break;
      } else if (
        field === "phone" &&
        (!value || !/^\d+$/.test(value as string))
      ) {
        allValid = false;
        break;
      }
    }

    if (!company.economicActivityId || company.economicActivityId === 0) {
      allValid = false;
    }
    if (Object.values(errors).some((error) => error !== "")) {
      allValid = false;
    }

    setIsSaveDisabled(!allValid);
  };

  const handleSave = async () => {
    if (isSaveDisabled) return;

    if (!company.id) {
      MySwal.fire("Error", "El ID de la empresa es requerido.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("companyName", company.companyName);
    formData.append("nit", company.nit);
    formData.append("address", company.address);
    formData.append("email", company.email);
    formData.append("phone", company.phone);

    if (company.economicActivityId && company.economicActivityId > 0) {
      formData.append(
        "economicActivityId",
        company.economicActivityId.toString()
      );
    }

    if (company.status) {
      formData.append("status", company.status);
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    setIsLoading(true);
    try {
      const success = await UpdateCompany(1, formData);

      if (success) {
        const updatedData = await GetCompanyById(company.id);
        if (updatedData) {
          setCompany(updatedData);
          setOriginalCompany(updatedData);
          setImagePreview(
            updatedData.image ||
              "http://res.cloudinary.com/dfotyo6jc/image/upload/v1766077849/t9cqloco0esjldqgmuop.png"
          );
        }
        MySwal.fire(
          "Actualizado!",
          "La empresa se ha actualizado con éxito.",
          "success"
        );
        setShowModal(false);
        setSelectedFile(null);
        setErrors({});
      } else {
        MySwal.fire("Error", "Error al actualizar la empresa", "error");
      }
    } catch (error) {
      console.error("Error en la solicitud: ", error);
      MySwal.fire("Error", "Error al procesar la solicitud.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">
                  Presentación de la empresa
                </h2>
                <div className="breadcrumb-wrapper">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="dashboard">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#">Empresa</a>
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
                <Col
                  md={4}
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "400px" }}
                >
                  {isLoading ? (
                    <div className="text-center">
                      <HandLoadingSpinner />
                      <p className="mt-3 text-muted">Cargando logo...</p>
                    </div>
                  ) : (
                    <img
                      src={
                        imagePreview ||
                        "http://res.cloudinary.com/dfotyo6jc/image/upload/v1766077849/t9cqloco0esjldqgmuop.png"
                      }
                      alt="Company Logo"
                      className="img-fluid"
                      style={{
                        maxHeight: "330px",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </Col>
                <Col md={8}>
                  <h4 className="card-title mb-3">Información de la Empresa</h4>
                  <h5 className="company-detail mb-3">
                    <strong>Nombre:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.companyName}
                    </span>
                  </h5>
                  <h5 className="company-detail mb-3">
                    <strong>NIT:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.nit}
                    </span>
                  </h5>
                  <h5 className="company-detail mb-3">
                    <strong>Dirección:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.address}
                    </span>
                  </h5>
                  <h5 className="company-detail mb-3">
                    <strong>Correo Electrónico:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.email}
                    </span>
                  </h5>
                  <h5 className="company-detail mb-3">
                    <strong>Celular:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.phone}
                    </span>
                  </h5>
                  <h5 className="company-detail mb-3">
                    <strong>Actividad Económica:</strong>{" "}
                    <span style={{ fontWeight: 400, color: "#6d6e6f" }}>
                      {company.ciiuCode
                        ? `${company.ciiuCode} - ${company.description}`
                        : ""}
                    </span>
                  </h5>
                  <Button
                    className="btn edit-button"
                    variant="primary"
                    onClick={handleShow}
                    disabled={isLoading}
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
            centered
            size="lg"
            scrollable
            className="animate__animated animate__fadeInDown"
          >
            <Modal.Header closeButton>
              <Modal.Title>Editar Información de la Empresa</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ maxHeight: "calc(200vh - 200px)", overflowY: "auto" }}
            >
              <Form>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="logoInput" className="mb-2">
                      <Form.Label>Logo de la Empresa</Form.Label>
                      <div className="d-flex flex-column align-items-center">
                        <div className="mb-2">
                            <img
                              src={imagePreview}
                              alt="Company Logo"
                              className="img-fluid"
                              style={{
                                maxHeight: "200px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                        </div>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              document.getElementById("logoInput")?.click()
                            }
                            disabled={isLoading}
                          >
                            Seleccionar Imagen
                          </Button>
                        </div>
                        <Form.Control
                          id="logoInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          disabled={isLoading}
                        />
                        <small className="text-muted mt-2">
                          Formatos: JPG, PNG. Máximo: 5MB
                        </small>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formCompanyName" className="mb-2">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        size="ls"
                        type="text"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleChange}
                        isInvalid={!!errors.companyName}
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.companyName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formNIT" className="mb-2">
                      <Form.Label>NIT</Form.Label>
                      <Form.Control
                        size="ls"
                        type="text"
                        name="nit"
                        value={company.nit}
                        onChange={handleChange}
                        isInvalid={!!errors.nit}
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nit}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formAddress" className="mb-2">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        size="ls"
                        type="text"
                        name="address"
                        value={company.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail" className="mb-2">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        size="ls"
                        type="email"
                        name="email"
                        value={company.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPhone" className="mb-2">
                      <Form.Label>Celular</Form.Label>
                      <Form.Control
                        size="ls"
                        type="text"
                        name="phone"
                        value={company.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        disabled={isLoading}
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
                      <EconomicActivitySelect
                        selectedValue={company.economicActivityId}
                        onChange={handleSelectChange}
                      />
                      {errors.economicActivityId && (
                        <div className="invalid-feedback d-block">
                          {errors.economicActivityId}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="sm"
                variant="success"
                onClick={handleSave}
                disabled={isSaveDisabled || isLoading}
              >
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      {isLoading && (
        <div
          className="loading-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <HandLoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CompanyPresentation;