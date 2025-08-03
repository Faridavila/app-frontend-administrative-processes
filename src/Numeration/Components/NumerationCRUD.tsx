import React from "react";
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { NumerationTypes } from "../Types/NumerationTypes";
import { NumerationSortFieldMap } from "../Types/MapeoNumeration";
import {
  GetNumeration,
  CreateNumeration,
  UpdateNumeration,
  DeleteNumeration,
  GetSearchNumeration,
} from "../API/NumerationAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NumerationCRUD = () => {
  const itemTemplate = (): NumerationTypes => ({
    id: 0,
    authNumer: "0",
    prefix: "",
    startDate: "",
    finishDate: "",
    initialNumber: 0,
    finalNumber: 0,
    currentNumber: 0,
    technicalKey: "",
    descriptionAccountingDocumentType: "",
    accountingDocumentTypeId: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof NumerationTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "authNumer", label: "Número de autorización",  hiddenInCreate: true, hiddenInEdit: true  },
    { key: "prefix", label: "Prefijo", required: true },
    { key: "startDate", label: "Fecha de inicio", required: true },
    { key: "finishDate", label: "Fecha de final", required: true },
    { key: "initialNumber", label: "Número inicial", required: true,minLength: 2, maxLength: 100, },
    { key: "finalNumber", label: "Número final", required: true, minLength: 2, maxLength: 100,},
    { key: "currentNumber", label: "Número actual", required: true, minLength: 2, maxLength: 100,},
    { key: "technicalKey", label: "Clave técnica", required: true, minLength: 2, maxLength: 100, },
    { key: "descriptionAccountingDocumentType", label: "Tipo de documento contable", hiddenInCreate: true, hiddenInEdit: true },
    { key: "accountingDocumentTypeId", label: "Tipo de documento contable", hidden: true },
  ];

  const renderCustomFormField = (
    colKey: keyof NumerationTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
  
    if (colKey === "startDate" || colKey === "finishDate") {
      return (
        <DatePicker
          selected={value ? new Date(value) : null} 
          onChange={(date: Date | null) => onChange(date ? date.toISOString().split('T')[0] : "")} 
          dateFormat="yyyy-MM-dd"
          className="form-control"
          placeholderText="Seleccionar fecha"
        />
      );
    }
  
    return null;
  };
  
  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de numeración de facturación
          </h3>
          <FavoritoButton path="/numeration" label="Numeration" />
        </div>
        <p>
          Administre las numeraciones de facturación mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<NumerationTypes>
              fetchItems={GetNumeration}
              searchItem={GetSearchNumeration}
              createItem={CreateNumeration}
              updateItem={UpdateNumeration}
              deleteItem={DeleteNumeration}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={NumerationSortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerationCRUD;
