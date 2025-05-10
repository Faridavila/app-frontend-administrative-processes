import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ActionTypes } from "../Types/ActionTypes";
import { ActionSortFieldMap } from "../Types/MapeoAction";
import {
  GetAction,
  CreateAction,
  UpdateAction,
  DeleteAction,
  GetSearchAction,
} from "../API/ActionAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ActionCRUD = () => {
  const itemTemplate = (): ActionTypes => ({
    id: 0,
    nameAction: "",
    description: "",
    keyAction: "",
    status: "ACTIVE",
    method: "",
  });

  const columns: {
    key: keyof ActionTypes;
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
      key: "nameAction",
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
      key: "keyAction",
      label: "Metodo",
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
              Gestión de Acciones
            </h3>
            <FavoritoButton path="/action" label="Acciones" />
          </div>
          <p>
            Administre los Acciones mediante la creación, edición o eliminación
            de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ActionTypes>
                fetchItems={GetAction}
                searchItem={GetSearchAction}
                createItem={CreateAction}
                updateItem={UpdateAction}
                deleteItem={DeleteAction}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ActionSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCRUD;
