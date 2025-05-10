// FormFieldComponent.tsx
import React from "react";

// Definición de un campo de formulario (label, nombre, tipo, etc.)
interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

// Componente que renderiza un campo de formulario genérico (input)
const FormFieldComponent = ({
  field,
  value,
  handleChange,
}: {
  field: FormField;
  value: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => {
  return (
    <div className="col-md-6" style={{ marginBottom: "20px" }}>
      <label style={{ marginBottom: "5px" }}>{field.label}</label>
      <input
        type={field.type}
        name={field.name}
        className="form-control"
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormFieldComponent;
