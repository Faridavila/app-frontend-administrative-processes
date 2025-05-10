import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EconomicActivityTypes } from "../Types/EconomicActivityTypes";
import { EconomicActivitySortFieldMap } from "../Types/MapeoEconomicActivity";

import {
  GetEconomicActivity,
  CreateEconomicActivity,
  UpdateEconomicActivity,
  DeleteEconomicActivity,
  GetSearchEconomicActivity,
} from "../API/EconomicActivity";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const EconomicActivityCRUD = () => {
  const itemTemplate = (): EconomicActivityTypes => ({
    id: 0,
    ciiuCode: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof EconomicActivityTypes;
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
      key: "ciiuCode",
      label: "Codigo CIIU",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^\d+$/,
    },
    {
      key: "description",
      label: "Descripcion",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
  ];

  const renderCustomFormField = (
    _colKey: keyof EconomicActivityTypes,
    _value: string,
    _onChange: (newValue: string) => void
  ) => {
    return null;
  };

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
              Gestión de actividades económicas
            </h3>
            <FavoritoButton
              path="/economicActivity"
              label="Actividad Económica"
            />
          </div>
          <p>
            Administre las actividades economicas mediante la creación, edición
            o eliminación de registros.
          </p>

          {/* CRUD Form Section */}
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<EconomicActivityTypes>
                fetchItems={GetEconomicActivity}
                searchItem={GetSearchEconomicActivity}
                createItem={CreateEconomicActivity}
                updateItem={UpdateEconomicActivity}
                deleteItem={DeleteEconomicActivity}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={EconomicActivitySortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicActivityCRUD;
