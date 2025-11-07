import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ClientTypes } from "../Types/ClientTypes";
import { ClientSortFieldMap } from "../Types/MapeoClientTypes";
import {
  GetClient,
  CreateClient,
  UpdateClient,
  DeleteClient,
  GetSearchClient,
} from "../API/ClientAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import IdentificationTypeSelect from "./IdentificationTypeSelect";

const ClientCRUD = () => {
  const itemTemplate = (): ClientTypes => ({
    id: 0,
    name: "",
    typeIdentificationId: "",
    identification: "",
    address: "",
    cityName: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof ClientTypes;
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
    {key: "name",label: "Nombre",},
    {key: "typeIdentificationId",label: "Tipo de identificacion",},
    {key: "identification",label: "Identificacion",},
    {key: "address",label: "Direccion",},
    {key: "cityName",label: "Ciudad",},
    {key: "email",label: "Correo",},
    {key: "phone",label: "Celular",},
  ];

    const renderCustomFormField = (
    colKey: keyof ClientTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "typeIdentificationId") {
      return (
        <IdentificationTypeSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCategoryId: number) => onChange(newCategoryId.toString())}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de clientes
          </h3>
          <FavoritoButton path="/Client" label="Tipo de documento contable" />
        </div>
        <p>
          Administre los clientes mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<ClientTypes>
              fetchItems={GetClient}
              searchItem={GetSearchClient}
              createItem={CreateClient}
              updateItem={UpdateClient}
              deleteItem={DeleteClient}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={ClientSortFieldMap}
              pageTitle="Clientes"
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCRUD;
