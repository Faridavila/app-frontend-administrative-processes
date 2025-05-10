import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CashRegisterTypes } from "../Types/CashRegisterTypes";
import { CashRegisterSortFieldMap } from "../Types/MapeoCashRegisterTypes";
import {
  GetCashRegister,
  CreateCashRegister,
  UpdateCashRegister,
  DeleteCashRegister,
  GetSearchCashRegister,
} from "../API/CashRegisterAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const CashRegisterCRUD = () => {
  const itemTemplate = (): CashRegisterTypes => ({
    id: 0,
    cashRegisterCode: "",
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof CashRegisterTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
    {key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {key: "cashRegisterCode",label: "Codigo de caja",},
    {key: "description",label: "Nombre",},
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
            Gestión de caja registradora
          </h3>
          <FavoritoButton path="/CashRegister" label="Tipo de documento contable" />
        </div>
        <p>
          Administre las caja registradora mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<CashRegisterTypes>
              fetchItems={GetCashRegister}
              searchItem={GetSearchCashRegister}
              createItem={CreateCashRegister}
              updateItem={UpdateCashRegister}
              deleteItem={DeleteCashRegister}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={CashRegisterSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashRegisterCRUD;
