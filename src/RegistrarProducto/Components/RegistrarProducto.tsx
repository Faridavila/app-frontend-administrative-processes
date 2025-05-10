import React, { useState } from "react";
import { FaBox, FaWarehouse } from "react-icons/fa";
import FormStep from "./../../FormsGenerico/Components/FormStep";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

// Definición del tipo FormData
interface FormData {
  nombreProducto: string;
  categoria: string;
  precio: string;
  cantidadDisponible: string;
  codigoBarras: string;
  ubicacionAlmacen: string;
  [key: string]: string; // Signatura de índice para permitir cualquier clave
}

// Componente principal del wizard
const RegistroProductoWizard = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    nombreProducto: "",
    categoria: "",
    precio: "",
    cantidadDisponible: "",
    codigoBarras: "",
    ubicacionAlmacen: "",
  });

  // Maneja los cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Cambiar entre los pasos
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Definir los pasos del formulario
  const steps = [
    {
      title: "Información del Producto",
      subtitle: "Ingrese los detalles básicos del producto",
      icon: <FaBox className="font-medium-3" />,
      fields: [
        {
          label: "Nombre del Producto",
          name: "nombreProducto",
          type: "text",
          placeholder: "Nombre del producto",
        },
        {
          label: "Categoría",
          name: "categoria",
          type: "text",
          placeholder: "Categoría del producto",
        },
        {
          label: "Precio",
          name: "precio",
          type: "text",
          placeholder: "Precio en USD",
        },
      ],
    },
    {
      title: "Detalles del Inventario",
      subtitle: "Información del inventario del producto",
      icon: <FaWarehouse className="font-medium-3" />,
      fields: [
        {
          label: "Cantidad Disponible",
          name: "cantidadDisponible",
          type: "text",
          placeholder: "Cantidad disponible",
        },
        {
          label: "Código de Barras",
          name: "codigoBarras",
          type: "text",
          placeholder: "Código de barras",
        },
        {
          label: "Ubicación en Almacén",
          name: "ubicacionAlmacen",
          type: "text",
          placeholder: "Ubicación en almacén",
        },
      ],
    },
  ];

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Registro de Producto en Inventario
            </h3>
            <FavoritoButton
              path="/Registrarproducto"
              label="Registrar Producto"
            />
          </div>

          <section className="modern-horizontal-wizard">
            <div className="bs-stepper wizard-modern modern-wizard-example">
              {/* Menú de navegación de pasos */}
              <div className="bs-stepper-header">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`step ${
                      currentStep === index + 1 ? "active" : ""
                    }`}
                    onClick={() => goToStep(index + 1)}
                  >
                    <button type="button" className="step-trigger">
                      <span className="bs-stepper-box">{step.icon}</span>
                      <span className="bs-stepper-label">
                        <span className="bs-stepper-title">{step.title}</span>
                        <span className="bs-stepper-subtitle">
                          {step.subtitle}
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Contenido de cada paso */}
              <div className="bs-stepper-content">
                {steps.map(
                  (step, index) =>
                    currentStep === index + 1 && (
                      <FormStep
                        key={index}
                        step={step}
                        formData={formData}
                        handleChange={handleChange}
                      />
                    )
                )}
              </div>

              {/* Botones para navegar */}
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
                  disabled={currentStep === steps.length}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegistroProductoWizard;
