import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ComprobanteTypes } from "../Types/VoucherTypes";
import { comprobanteSortFieldMap } from "../Types/MapeoVoucher";
import {
  GetComprobante,
  CreateComprobante,
  UpdateComprobante,
  DeleteComprobante,
  GetSearchComprobante,
} from "../API/VoucherAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

interface FormularioComprobanteTypes {
  id: number;
  cuentaContable: string;
  tercero: string;
  detalleContable: string;
  descripcion: string;
  centroCosto: string;
  debito: number;
  credito: number;
  fechaElaboracion: Date | null;
  moneda: string;
}

const initialData: FormularioComprobanteTypes[] = [];

const FormularioComprobanteCRUD = () => {
  const [formData, setFormData] = useState<FormularioComprobanteTypes>({
    id: 0,
    cuentaContable: "",
    tercero: "",
    detalleContable: "",
    descripcion: "",
    centroCosto: "",
    debito: 0,
    credito: 0,
    fechaElaboracion: null,
    moneda: "",
  });

  const [data, setData] = useState<FormularioComprobanteTypes[]>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleDateChange = (date: Date | null, field: "fechaElaboracion") => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData([...data, { ...formData, id: data.length + 1 }]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      cuentaContable: "",
      tercero: "",
      detalleContable: "",
      descripcion: "",
      centroCosto: "",
      debito: 0,
      credito: 0,
      fechaElaboracion: null,
      moneda: "",
    });
  };

  const itemTemplate = (): ComprobanteTypes => ({
    id: 0,
    cuentaContable: "",
    tercero: "",
    detalleContable: "",
    descripcion: "",
    centroCosto: "",
    consecutivo: "",
    debito: 0,
    credito: 0,
    fechaElaboracion: new Date(),
    moneda: "",
  });

  const columns: {
    key: keyof ComprobanteTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
  }[] = [
    { key: "id", label: "ID" },
    { key: "cuentaContable", label: "Cuenta Contable", required: true },
    { key: "tercero", label: "Tercero", required: true },
    { key: "detalleContable", label: "Detalle Contable", required: true },
    { key: "descripcion", label: "Descripción", required: true },
    { key: "centroCosto", label: "Centro de Costo", required: true },
    { key: "debito", label: "Débito", required: true },
    { key: "credito", label: "Crédito", required: true },
    { key: "fechaElaboracion", label: "Fecha de Elaboración", required: true },
    { key: "moneda", label: "Moneda", required: true },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de comprobantes
          </h3>
          <FavoritoButton path="/comprobante" label="Comprobante" />
        </div>
        <p>Administre los comprobantes mediante la creación de registros.</p>

        {/* Formulario personalizado */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Formulario de Comprobante</h4>
          </div>
          <div className="card-body">
            <form className="form" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="cuentaContable">
                      Cuenta Contable
                    </label>
                    <input
                      type="text"
                      id="cuentaContable"
                      className="form-control"
                      placeholder="Cuenta Contable"
                      value={formData.cuentaContable}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="tercero">
                      Tercero
                    </label>
                    <input
                      type="text"
                      id="tercero"
                      className="form-control"
                      placeholder="Tercero"
                      value={formData.tercero}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="detalleContable">
                      Detalle Contable
                    </label>
                    <input
                      type="text"
                      id="detalleContable"
                      className="form-control"
                      placeholder="Detalle Contable"
                      value={formData.detalleContable}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="descripcion">
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="descripcion"
                      className="form-control"
                      placeholder="Descripción"
                      value={formData.descripcion}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="centroCosto">
                      Centro de Costo
                    </label>
                    <input
                      type="text"
                      id="centroCosto"
                      className="form-control"
                      placeholder="Centro de Costo"
                      value={formData.centroCosto}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="debito">
                      Débito
                    </label>
                    <input
                      type="number"
                      id="debito"
                      className="form-control"
                      placeholder="Débito"
                      value={formData.debito}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="credito">
                      Crédito
                    </label>
                    <input
                      type="number"
                      id="credito"
                      className="form-control"
                      placeholder="Crédito"
                      value={formData.credito}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="fechaElaboracion">
                      Fecha de elaboración
                    </label>
                    <DatePicker
                      selected={formData.fechaElaboracion}
                      onChange={(date) =>
                        handleDateChange(date, "fechaElaboracion")
                      }
                      className="form-control"
                      placeholderText="Seleccionar fecha"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="moneda">
                      Moneda
                    </label>
                    <input
                      type="text"
                      id="moneda"
                      className="form-control"
                      placeholder="Moneda"
                      value={formData.moneda}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-1">
                    Crear Comprobante
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tabla para gestionar los comprobantes (CRUD completo) */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Listado de Comprobantes</h4>
          </div>
          <div className="card-datatable table-responsive">
            <CRUDForm<ComprobanteTypes>
              fetchItems={GetComprobante}
              searchItem={GetSearchComprobante}
              createItem={CreateComprobante}
              updateItem={UpdateComprobante}
              deleteItem={DeleteComprobante}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={comprobanteSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioComprobanteCRUD;
