import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ActionParameterTypes } from "../Types/ActionParameterTypes";
import { ActionParameterSortFieldMap } from "../Types/MapeoActionParameter";
import {
  GetActionParameter,
  CreateActionParameter,
  UpdateActionParameter,
  DeleteActionParameter,
  GetSearchActionParameter,
} from "../API/ActionParameterAPI";

import ParameterSelect from "./ActionParameterSelectStep";
import ActionSelect from "./ActionParameterSelectAccion";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ActionParameterCRUD = () => {
  const itemTemplate = (): ActionParameterTypes => ({
    id: 0,
    confWorkflowParameterId: 0,
    parameterName: "",
    actionName: "",
    idAction: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof ActionParameterTypes;
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
    { key: "confWorkflowParameterId", label: "Nombre parámetro", hidden: true },
    { key: "idAction", label: "ID Acción", hidden: true },
    {
      key: "parameterName",
      label: "Nombre parámetro",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "actionName",
      label: "Nombre acción",
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
  ];

  const renderCustomFormField = (
    colKey: keyof ActionParameterTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    const selectedValue = value ? parseInt(value, 10) : 0;

    if (colKey === "confWorkflowParameterId") {
      return (
        <ParameterSelect
          selectedValue={selectedValue}
          onChange={(newParameterId: number) =>
            onChange(newParameterId.toString())
          }
        />
      );
    } else if (colKey === "idAction") {
      return (
        <ActionSelect
          selectedValue={selectedValue}
          onChange={(newActionId: number) => onChange(newActionId.toString())}
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
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de Acciones
            </h3>
            <FavoritoButton path="/actionParameter" label="Accion parametro" />
          </div>
          <p>
            Administre los Acciones mediante la creación, edición o eliminación
            de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ActionParameterTypes>
                fetchItems={GetActionParameter}
                searchItem={GetSearchActionParameter}
                createItem={CreateActionParameter}
                updateItem={UpdateActionParameter}
                deleteItem={DeleteActionParameter}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ActionParameterSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionParameterCRUD;
