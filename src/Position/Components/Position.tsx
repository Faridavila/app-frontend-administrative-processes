import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { PositionTypes } from "../Types/PositionTypes";
import { PositionSortFieldMap } from "../Types/MapeoPosition";
import {
  GetPosition,
  CreatePosition,
  UpdatePosition,
  DeletePosition,
  GetSearchPosition,
} from "../API/PositionAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const PositionCRUD = () => {
  const itemTemplate = (): PositionTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof PositionTypes;
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
      regex: /^[A-Za-záéíóúÁÉÍÓÚ0-9\s\.,;¡!¿?(){}[\]@#%&*+_\\/-]+$/,
    },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de cargos
            </h3>
            <FavoritoButton path="/position" label="Cargo" />
          </div>
          <p>
            Administre los cargos mediante la creación, edición o eliminación de
            registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<PositionTypes>
                fetchItems={GetPosition}
                searchItem={GetSearchPosition}
                createItem={CreatePosition}
                updateItem={UpdatePosition}
                deleteItem={DeletePosition}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                sortFieldMap={PositionSortFieldMap}
                pageTitle="Cargos" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCRUD;
