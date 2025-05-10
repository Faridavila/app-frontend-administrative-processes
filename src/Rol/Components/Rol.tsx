import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RolTypes } from "../Types/RolTypes";
import { RolSortFieldMap } from "../Types/MapeoRol";
import {
  GetRol,
  CreateRol,
  UpdateRol,
  DeleteRol,
  GetSearchRol,
} from "../API/RolAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const RolCRUD = () => {
  const itemTemplate = (): RolTypes => ({
    id: 0,
    name: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof RolTypes;
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
      key: "name",
      label: "Nombre",
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
              Gestión de roles
            </h3>
            <FavoritoButton path="/rol" label="Roles" />
          </div>
          <p>
            Administre los roles mediante la creación, edición o eliminación de
            registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<RolTypes>
                fetchItems={GetRol}
                searchItem={GetSearchRol}
                createItem={CreateRol}
                updateItem={UpdateRol}
                deleteItem={DeleteRol}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={RolSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolCRUD;
