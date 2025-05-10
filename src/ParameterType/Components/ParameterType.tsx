import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ParameterTypeTypes } from "../Types/ParameterTypeTypes";
import { ParameterTypeSortFieldMap } from "../Types/MapeoParameterType";
import {
  GetParameterType,
  CreateParameterType,
  UpdateParameterType,
  DeleteParameterType,
  GetSearchParameterType,
} from "../API/ParameterTypeAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ParameterTypeCRUD = () => {
  const itemTemplate = (): ParameterTypeTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof ParameterTypeTypes;
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
      key: "description",
      label: "Descripcion",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
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
              Gestión de tipo de parametro
            </h3>
            <FavoritoButton path="/ParameterType" label="Tipo parametro" />
          </div>
          <p>
            Administre los tipo de parametro mediante la creación, edición o
            eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ParameterTypeTypes>
                fetchItems={GetParameterType}
                searchItem={GetSearchParameterType}
                createItem={CreateParameterType}
                updateItem={UpdateParameterType}
                deleteItem={DeleteParameterType}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ParameterTypeSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterTypeCRUD;
