import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { TaxConfigurationTypes } from "../Types/TaxConfigurationTypes";
import { TaxConfigurationSortFieldMap } from "../Types/MapeoTaxConfiguration";
import {
  GetTaxConfiguration,
  CreateTaxConfiguration,
  UpdateTaxConfiguration,
  DeleteTaxConfiguration,
  GetSearchTaxConfiguration,
} from "../API/TaxConfigurationAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const TaxConfigurationCRUD = () => {
  const itemTemplate = (): TaxConfigurationTypes => ({
    id: 0,
    tax: "", 
    taxCode: 0,
    type: 0,
    concept: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof TaxConfigurationTypes;
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
    {key: "tax",label: "Impuesto",hiddenInCreate: true,minLength: 2,maxLength: 100,},
    {key: "taxCode", label: "Codigo de impuesto",required: true, minLength: 2,maxLength: 100,regex: /^[A-Za-z\s]+$/, },
    {key: "type",label: "Tipo de impuesto",required: true,},
    {key: "concept",label: "concepto",required: true,minLength: 2,maxLength: 100,regex: /^[A-Za-z\s]+$/,},  
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
            Gestión de impuesto y retenciones
          </h3>
          <FavoritoButton path="/TaxConfiguration" label="TaxConfiguration" />
        </div>
        <p>
          Administre los impuestos y retenciones mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<TaxConfigurationTypes>
              fetchItems={GetTaxConfiguration}
              searchItem={GetSearchTaxConfiguration}
              createItem={CreateTaxConfiguration}
              updateItem={UpdateTaxConfiguration}
              deleteItem={DeleteTaxConfiguration}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={TaxConfigurationSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxConfigurationCRUD;
