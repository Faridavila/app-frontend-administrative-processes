import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ParameterTypes } from "../Types/ParameterTypes";
import { ParameterSortFieldMap } from "../Types/MapeoParameter";
import {
  GetParameter,
  CreateParameter,
  UpdateParameter,
  DeleteParameter,
  GetSearchParameter,
} from "../API/ParameterAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ParameterCRUD = () => {
  const itemTemplate = (): ParameterTypes => ({
    id: 0,
    parameterTypeId: 0,
    description: "",
    parameterName: "",
    parameterTypeName: "",
    label: "",
    regularExpression: "",
    order: 0,
    required: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof ParameterTypes;
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
    {
      key: "parameterName",
      label: "Nombre",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "description",
      label: "Descripcion",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "label",
      label: "Etiqueta",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    { key: "parameterTypeId", label: "Tipo de parametro", hidden: true },
    {
      key: "regularExpression",
      label: "Expresion regular",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    { key: "parameterTypeName", label: "Tipo de parametro" },
    {
      key: "required",
      label: "Requerido",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    { key: "order", label: "orden" },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de parametro
            </h3>
            <FavoritoButton path="/Parameter" label="Parametro" />
          </div>
          <p>
            Administre los parametro mediante la creación, edición o eliminación
            de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ParameterTypes>
                fetchItems={GetParameter}
                searchItem={GetSearchParameter}
                createItem={CreateParameter}
                updateItem={UpdateParameter}
                deleteItem={DeleteParameter}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ParameterSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterCRUD;
