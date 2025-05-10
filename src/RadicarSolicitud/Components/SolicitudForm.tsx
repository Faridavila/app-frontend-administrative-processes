import React, { useState } from "react";
import { FaFileAlt, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "./../forms/form-validation.css";
import "./../forms/form-wizard.css";
import "./../forms/form-number-input.css";
import "./../forms/pickers/form-flat-pickr.css";
import "./../forms/pickers/form-pickadate.css";
import "./../../../app-assets/vendors/css/forms/select/select2.min.css";
import "./../../../app-assets/vendors/css/forms/wizard/bs-stepper.min.css";
import FavoritoButton from "./../../FavoritoButton/components/FavoritoButton"; // Importa el componente FavoritoButton
import { CreateRequest } from "../API/RequestsAPI"; // API para Requests
import { RequestTypes } from "../Types/RequestTypes"; // Define el tipo de datos para Requests
import RequestsCRUD from "./Requests"; // Importar el componente RequestsCRUD
import RequestDetailCRUD from "./RequestDetail"; // Importa el CRUD para los detalles de solicitud
import { CreateRequestDetail } from "../API/RequesteDetailAPI";
import { RequestDetailTypes } from "../Types/RequestDetailTypes";

interface FormData {
  nombreSolicitante: string;
  departamento: string;
  fechaSolicitud: Date | null;
  numeroSolicitud: string;
  area: string;
  codigoArticulo: string;
  tipoBien: string;
  descripcion: string;
  cantidadSolicitada: string;
  destino: string;
  observaciones: string;
  requestId: string; // Añadimos este campo para que el usuario ingrese manualmente el ID de la solicitud
}

const customLabelStyle = {
  marginBottom: "5px",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const FormularioConWizard = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    nombreSolicitante: "",
    departamento: "",
    fechaSolicitud: null,
    numeroSolicitud: "",
    area: "",
    codigoArticulo: "",
    tipoBien: "",
    descripcion: "",
    cantidadSolicitada: "",
    destino: "",
    observaciones: "",
    requestId: "", // Campo agregado para que el usuario ingrese el ID de la solicitud
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      fechaSolicitud: date,
    }));
  };

  const handleCreate = async () => {
    const newRequest: RequestTypes = {
      id: 0,
      requesterName: formData.nombreSolicitante,
      requestDate: formData.fechaSolicitud
        ? formData.fechaSolicitud
        : new Date(),
      area: formData.area,
      department: formData.departamento,
      requestNumber: formData.numeroSolicitud,
      status: "ACTIVE",
    };
    try {
      await CreateRequest(newRequest);

      // SweetAlert de éxito
      Swal.fire({
        icon: "success",
        title: "Solicitud creada",
        text: "La solicitud ha sido creada exitosamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al crear la solicitud: ", error);

      // SweetAlert de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al crear la solicitud.",
        confirmButtonText: "Aceptar",
      });
    }
  };
  const handleAddDetail = async () => {
    if (!formData.requestId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese el ID de la solicitud antes de agregar detalles.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const newDetail: RequestDetailTypes = {
      id: 0, // Al crear, id es 0 o lo maneja el backend
      itemCode: formData.codigoArticulo,
      description: formData.descripcion,
      destination: formData.destino,
      itemType: formData.tipoBien,
      requestedQuantity: Number(formData.cantidadSolicitada),
      observations: formData.observaciones,
      requestId: Number(formData.requestId), // Asegurarse que el ID sea numérico
      status: "ACTIVE",
    };

    try {
      await CreateRequestDetail(newDetail);

      // SweetAlert de éxito
      Swal.fire({
        icon: "success",
        title: "Detalle agregado",
        text: "El detalle se ha agregado exitosamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al crear el detalle de solicitud: ", error);

      // SweetAlert de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al crear el detalle de la solicitud.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Formulario de Solicitud y Entrega
            </h3>
            <FavoritoButton path="/solicitud" label="Solicitud" />
          </div>
          <section className="modern-horizontal-wizard">
            <div className="bs-stepper wizard-modern modern-wizard-example">
              <div className="bs-stepper-header">
                <div
                  className={`step ${currentStep === 1 ? "active" : ""}`}
                  onClick={() => goToStep(1)}
                >
                  <button type="button" className="step-trigger">
                    <span className="bs-stepper-box">
                      <FaFileAlt className="font-medium-3" />
                    </span>
                    <span className="bs-stepper-label">
                      <span className="bs-stepper-title">
                        Solicitud/Entrega
                      </span>
                      <span className="bs-stepper-subtitle">
                        Datos de la Solicitud
                      </span>
                    </span>
                  </button>
                </div>
                <div className="line">
                  <i className="font-medium-2"></i>
                </div>
                <div
                  className={`step ${currentStep === 2 ? "active" : ""}`}
                  onClick={() => goToStep(2)}
                >
                  <button type="button" className="step-trigger">
                    <span className="bs-stepper-box">
                      <FaClipboardList className="font-medium-3" />
                    </span>
                    <span className="bs-stepper-label">
                      <span className="bs-stepper-title">
                        Detalles de la solicitud
                      </span>
                      <span className="bs-stepper-subtitle">
                        Detalles de la Solicitud
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="bs-stepper-content">
                {currentStep === 1 && (
                  <div className="content dstepper-block">
                    <h5>Datos de la Solicitud</h5>
                    <p>Ingrese los detalles de la solicitud.</p>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          Nombre del solicitante
                        </label>
                        <input
                          type="text"
                          name="nombreSolicitante"
                          className="form-control"
                          placeholder="Nombre"
                          value={formData.nombreSolicitante}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Departamento</label>
                        <input
                          type="text"
                          name="departamento"
                          className="form-control"
                          placeholder="Departamento"
                          value={formData.departamento}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          Fecha de solicitud
                        </label>
                        <input
                          type="date"
                          name="fechaSolicitud"
                          className="form-control"
                          value={
                            formData.fechaSolicitud
                              ? formData.fechaSolicitud
                                  .toISOString()
                                  .substr(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            handleDateChange(
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          Número de solicitud
                        </label>
                        <input
                          type="text"
                          name="numeroSolicitud"
                          className="form-control"
                          placeholder="0001"
                          value={formData.numeroSolicitud}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Área</label>
                        <input
                          type="text"
                          name="area"
                          className="form-control"
                          placeholder="Área"
                          value={formData.area}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        className="btn btn-success"
                        onClick={handleCreate}
                      >
                        Crear
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="content dstepper-block">
                    <h5>Detalles de la Solicitud</h5>
                    <p>
                      Ingrese los detalles específicos del artículo solicitado.
                    </p>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          Código del artículo
                        </label>
                        <input
                          type="text"
                          name="codigoArticulo"
                          className="form-control"
                          placeholder="Código"
                          value={formData.codigoArticulo}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Tipo de bien</label>
                        <input
                          type="text"
                          name="tipoBien"
                          className="form-control"
                          placeholder="Tipo de bien"
                          value={formData.tipoBien}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Descripción</label>
                        <input
                          type="text"
                          name="descripcion"
                          className="form-control"
                          placeholder="Descripción del bien"
                          value={formData.descripcion}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          Cantidad solicitada
                        </label>
                        <input
                          type="number"
                          name="cantidadSolicitada"
                          className="form-control"
                          placeholder="Cantidad"
                          value={formData.cantidadSolicitada}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Destino</label>
                        <input
                          type="text"
                          name="destino"
                          className="form-control"
                          placeholder="Ubicación responsable"
                          value={formData.destino}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>Observaciones</label>
                        <input
                          type="text"
                          name="observaciones"
                          className="form-control"
                          placeholder="Observaciones adicionales"
                          value={formData.observaciones}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row" style={formGroupStyle}>
                      <div className="col-md-6">
                        <label style={customLabelStyle}>
                          ID de la Solicitud
                        </label>
                        <input
                          type="text"
                          name="requestId"
                          className="form-control"
                          placeholder="Ingrese el ID de la solicitud"
                          value={formData.requestId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-2">
                      <button
                        className="btn btn-success"
                        onClick={handleAddDetail} // Botón para agregar detalle
                      >
                        Agregar Detalle
                      </button>
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => goToStep(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => goToStep(currentStep + 1)}
                    disabled={currentStep === 2}
                  >
                    Next
                  </button>
                </div>
              </div>

              <h3 style={{ marginLeft: "10px", marginTop: "25px" }}>
                Datos de solicitudes{" "}
              </h3>
            </div>
            <RequestsCRUD />

            <h3 style={{ marginLeft: "10px", marginTop: "25px" }}>
              Detalles de solicitudes{" "}
            </h3>
            <RequestDetailCRUD />
          </section>
        </div>
      </div>
    </div>
  );
};

export default FormularioConWizard;
