import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { AreaTypes } from "../Types/AreaTypes";
import { AreaSortFieldMap } from "../Types/MapeoArea";
import {
  GetArea,
  CreateArea,
  UpdateArea,
  DeleteArea,
  GetSearchArea,
} from "../API/AreaAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const AreaCRUD = () => {
  const itemTemplate = (): AreaTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof AreaTypes;
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
      regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/
,
    },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de Area
            </h3>
            <FavoritoButton path="/area" label="Area" />
          </div>
          <p>
            Administre las areas mediante la creación, edición o eliminación de
            registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<AreaTypes>
                fetchItems={GetArea}
                searchItem={GetSearchArea}
                createItem={CreateArea}
                updateItem={UpdateArea}
                deleteItem={DeleteArea}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                sortFieldMap={AreaSortFieldMap}
                pageTitle="Area" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCRUD;
