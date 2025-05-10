import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RequestDetailTypes } from "../Types/RequestDetailTypes"; // Define el tipo de datos para RequestDetails
import { RequestDetailSortFieldMap } from "../Types/MapeoRequestDetail"; // Mapeo de campos para RequestDetails
import {
  GetRequestDetails,
  CreateRequestDetail,
  UpdateRequestDetail,
  DeleteRequestDetail,
  GetSearchRequestDetails, // Importamos la función para búsqueda
} from "../API/RequesteDetailAPI"; // Asegúrate de que el nombre del archivo esté correcto

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

const RequestDetailCRUD = () => {
  const itemTemplate = (): RequestDetailTypes => ({
    id: 0,
    itemCode: "",
    description: "",
    destination: "",
    itemType: "",
    requestedQuantity: 1,
    observations: "",
    requestId: 0, // Clave foránea
    status: "ACTIVE",
    
  });

  const columns: ColumnDefinition<RequestDetailTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "itemCode",
      label: "Código del Artículo",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "description",
      label: "Descripción",
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    {
      key: "destination",
      label: "Destino",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "itemType",
      label: "Tipo de bien",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "requestedQuantity",
      label: "Cantidad Solicitada",
      required: true,
    },
    {
      key: "observations",
      label: "Observaciones",
      minLength: 0,
      maxLength: 200,
    },
    {
      key: "requestId",
      label: "ID de la Solicitud",
      required: true,
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
          <CRUDForm<RequestDetailTypes>
            fetchItems={GetRequestDetails}
            searchItem={GetSearchRequestDetails} // Agregamos la función para búsqueda
            createItem={CreateRequestDetail}
            updateItem={UpdateRequestDetail}
            deleteItem={DeleteRequestDetail}
            itemTemplate={itemTemplate}
            columns={columns}
            sortFieldMap={RequestDetailSortFieldMap}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDetailCRUD;
