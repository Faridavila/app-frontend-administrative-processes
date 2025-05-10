import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { AccountingDocumentTypesTypes } from "../Types/AccountingDocumentTypesTypes";
import { AccountingDocumentTypesSortFieldMap } from "../Types/MapeoAccountingDocumentTypes";
import {
  GetAccountingDocumentTypes,
  CreateAccountingDocumentTypes,
  UpdateAccountingDocumentTypes,
  DeleteAccountingDocumentTypes,
  GetSearchAccountingDocumentTypes,
} from "../API/AccountingDocumentTypesAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const AccountingDocumentTypesCRUD = () => {
  const itemTemplate = (): AccountingDocumentTypesTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof AccountingDocumentTypesTypes;
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
    {key: "description",label: "Tipo de documento contable",},
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
            Gestión de tipo de documento contable
          </h3>
          <FavoritoButton path="/AccountingDocumentTypes" label="Tipo de documento contable" />
        </div>
        <p>
          Administre los tipos de documento contable mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<AccountingDocumentTypesTypes>
              fetchItems={GetAccountingDocumentTypes}
              searchItem={GetSearchAccountingDocumentTypes}
              createItem={CreateAccountingDocumentTypes}
              updateItem={UpdateAccountingDocumentTypes}
              deleteItem={DeleteAccountingDocumentTypes}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={AccountingDocumentTypesSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDocumentTypesCRUD;
