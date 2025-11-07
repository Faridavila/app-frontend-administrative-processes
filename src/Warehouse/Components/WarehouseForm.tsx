import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { Warehouse } from "../../Warehouse/Types/WarehouseTypes";
import { WarehouseSortFieldMap } from "../Types/MapeoWarehouse";
import {
  GetWarehouses,
  CreateWarehouse,
  UpdateWarehouse,
  DeleteWarehouse,
  GetSearchWarehouses,
} from "../API/WarehousesAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";


const WarehouseCRUD = () => {
  const itemTemplate = (): Warehouse => ({
    id: 0,
    warehouseName: "",
    status: "",
    description: "",
    address: "",
  });

  const columns: {
    key: keyof Warehouse;
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
      key: "warehouseName",
      label: "Nombre de bodega",
    },
    {
      key: "description",
      label: "Descripcion",
    },
    {
      key: "address",
      label: "Direccion",
    },
  ];


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
            Gestión de bodegas
          </h3>
          <FavoritoButton path="/warehouse" label="Bodega" />
        </div>
        <p>
          Administre las bodegas mediante la creación, edición o eliminación de
          registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<Warehouse>
              fetchItems={GetWarehouses}
              searchItem={GetSearchWarehouses}
              createItem={CreateWarehouse}
              updateItem={UpdateWarehouse}
              deleteItem={DeleteWarehouse}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={WarehouseSortFieldMap}
              pageTitle="Bodegas"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCRUD;
