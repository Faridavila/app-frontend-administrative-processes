import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { InventoryAdjustmentTypes } from "../Types/InventoryAdjustmentTypes";
import { InventoryAdjustmentSortFieldMap } from "../Types/MapeoInventoryAdjustment";
import {
  GetInventoryAdjustments,
  CreateInventoryAdjustment,
  UpdateInventoryAdjustment,
  DeleteInventoryAdjustment,
  GetSearchInventoryAdjustment,
} from "../API/InventoryAdjustmentAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const InventoryAdjustmentCRUD = () => {
  const itemTemplate = (): InventoryAdjustmentTypes => ({
    id: 0,
    warehouseId: 0,
    totalAjustado: 0.0,
    observaciones: "",
    // No se inicializa status aquí
  });

  const columns: {
    key: keyof InventoryAdjustmentTypes;
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
      key: "warehouseId",
      label: "ID del Almacén",
      required: true,
      regex: /^\d+$/,
    },
    {
      key: "totalAjustado",
      label: "Total Ajustado",
      required: true,
      regex: /^\d+(\.\d{1,2})?$/,
    },
    { key: "observaciones", label: "Observaciones", maxLength: 255 },
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
              Gestión de Ajustes de Inventario
            </h3>
            <FavoritoButton
              path="/inventory-adjustment"
              label="Ajustes de Inventario"
            />
          </div>
          <p>
            Administre los ajustes de inventario mediante la creación, edición o
            eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<InventoryAdjustmentTypes>
                fetchItems={GetInventoryAdjustments}
                searchItem={GetSearchInventoryAdjustment}
                createItem={CreateInventoryAdjustment}
                updateItem={UpdateInventoryAdjustment}
                deleteItem={DeleteInventoryAdjustment}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={InventoryAdjustmentSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustmentCRUD;
