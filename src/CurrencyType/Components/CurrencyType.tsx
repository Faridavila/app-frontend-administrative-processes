import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CurrencyTypeTypes } from "../Types/CurrencyTypeTypes";
import { CurrencyTypeSortFieldMap } from "../Types/MapeoCurrencyType";
import {
  GetCurrencyType,
  CreateCCurrencyType,
  UpdateCurrencyType,
  DeleteCurrencyType,
  GetSearchCurrencyType,
} from "../API/CurrencyTypeAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const CurrencyTipeCRUD = () => {
  const itemTemplate = (): CurrencyTypeTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof CurrencyTypeTypes;
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
      regex: /^[A-Za-z\s]+$/,
    },
  ];

  const renderCustomFormField = (
    _colKey: keyof CurrencyTypeTypes,
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
            Gestión de tipo de moneda
          </h3>
          <FavoritoButton path="/currencyType" label="Tipo de moneda" />
        </div>
        <p>
          Administre los tipo de moneda mediante la creación, edición o
          eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<CurrencyTypeTypes>
              fetchItems={GetCurrencyType}
              searchItem={GetSearchCurrencyType}
              createItem={CreateCCurrencyType}
              updateItem={UpdateCurrencyType}
              deleteItem={DeleteCurrencyType}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={CurrencyTypeSortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyTipeCRUD;
