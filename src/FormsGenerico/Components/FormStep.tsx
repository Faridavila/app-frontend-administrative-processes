// src/components/FormStep.tsx
import React from "react";
import FormFieldComponent from "./FormFieldComponent";

// Definición de un campo de formulario y un paso
interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

interface Step {
  title: string;
  subtitle: string;
  fields: FormField[];
}

// Componente que renderiza un paso completo del wizard
const FormStep = ({
  step,
  formData,
  handleChange,
}: {
  step: Step;
  formData: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => {
  return (
    <div className="content dstepper-block">
      <h5>{step.title}</h5>
      <p>{step.subtitle}</p>
      <div className="row">
        {step.fields.map((field) => (
          <FormFieldComponent
            key={field.name}
            field={field}
            value={formData[field.name] || ""}
            handleChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FormStep;
