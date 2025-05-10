/* eslint-disable @typescript-eslint/no-unused-vars */
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { WarehouseTypes } from "../Types/WarehouseTTypes";
import { WarehouseSortFieldMap } from "../Types/MapeoWarehouseTypes";
import {
  GetWarehouseTypes,
  CreateWarehouseType,
  UpdateWarehouseType,
  DeleteWarehouseType,
  GetSearchWarehouseTypes,
} from "../API/WarehousesTypesAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const FormularioWarehouseTypesCRUD = () => {
  const itemTemplate = (): WarehouseTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof WarehouseTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
    {
      key: "id",
      label: "ID",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "description",
      label: "Descripción",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "status",
      label: "Estado",
      hidden: true, // Esta línea oculta la columna en la tabla
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
  ];

  const renderCustomFormField = (
    _colKey: keyof WarehouseTypes,
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de los Tipos de Bodega
          </h3>
          <FavoritoButton path="/warehouseType" label="Tipos de Bodega" />
        </div>
        <p>
          Administre los tipos de bodega mediante la creación, edición o
          eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<WarehouseTypes>
              fetchItems={GetWarehouseTypes}
              searchItem={GetSearchWarehouseTypes}
              createItem={CreateWarehouseType}
              updateItem={UpdateWarehouseType}
              deleteItem={DeleteWarehouseType}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={WarehouseSortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioWarehouseTypesCRUD;
