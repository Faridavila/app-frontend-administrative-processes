import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RequestTypes } from "../Types/RequestTypes"; // Define el tipo de datos para Requests
import { RequestSortFieldMap } from "../Types/MapeoRequests"; // Mapeo de campos para Requests
import {
  GetRequests,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  GetSearchRequests,
} from "../API/RequestsAPI"; // API para Requests

// Definición del tipo de columna
interface ColumnDefinition<T> {
  key: keyof T; // Debe ser una clave del tipo T
  label: string;
  hiddenInCreate?: boolean;
  hiddenInEdit?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
}

const RequestsCRUD = () => {
  const itemTemplate = (): RequestTypes => ({
    id: 0,
    requesterName: "",
    requestDate: new Date(), // Inicializado como objeto de fecha
    area: "",
    department: "",
    requestNumber: "",
    status: "ACTIVE",
  });

  const columns: ColumnDefinition<RequestTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "requesterName",
      label: "Nombre del Solicitante",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "requestDate",
      label: "Fecha de Solicitud",
      required: true,
      hiddenInCreate: false,
      hiddenInEdit: false,
    },
    {
      key: "area",
      label: "Área",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "department",
      label: "Departamento",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "requestNumber",
      label: "Número de Solicitud",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "status",
      label: "Estado",
      required: true,
    },
  ];

  return (
    <div
      className="app-content content"
      style={{ marginLeft: "-20px", marginTop: "-80px" }}
    >
      <div className="header-navbar-shadow"></div>
      <div className="card">
        <div className="card-datatable table-responsive">
          <CRUDForm<RequestTypes>
            fetchItems={GetRequests}
            searchItem={GetSearchRequests}
            createItem={CreateRequest}
            updateItem={UpdateRequest}
            deleteItem={DeleteRequest}
            itemTemplate={itemTemplate}
            columns={columns}
            sortFieldMap={RequestSortFieldMap}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestsCRUD;
