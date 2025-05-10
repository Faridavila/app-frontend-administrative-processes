import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CompanyType } from "../Types/Company";
import { CitySortFieldMap } from "../Types/MapeoCompany";
import {
  GetCompanyCRUD,
  CreateCompanyCRUD,
  UpdateCompanyCRUD,
  DeleteCompanyCRUD,
  GetSearchCompanyCRUD,
} from "../API/CompanyAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const CompanyCRUD = () => {
  const itemTemplate = (): CompanyType => ({
    id: 0,
    companyName: "",
    nit: "",
    address: "",
    email: "",
    phone: "",
    economicActivityId: 0,
    ciiuCode: "",
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof CompanyType;
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
    { key: "companyName", label: "Nombre" },
    { key: "economicActivityId", label: "Actividad economica", hidden: true },
    {
      key: "nit",
      label: "NIT",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^\d+$/,
    },
    {
      key: "email",
      label: "Correo",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "address",
      label: "Direccion",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
    {
      key: "phone",
      label: "Celular",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^\d+$/,
    },
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
              Gestión de empresas
            </h3>
            <FavoritoButton path="/configCompany" label="Empresa" />
          </div>
          <p>
            Administre las empresas mediante la creación, edición o eliminación
            de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<CompanyType>
                fetchItems={GetCompanyCRUD}
                searchItem={GetSearchCompanyCRUD}
                createItem={CreateCompanyCRUD}
                updateItem={UpdateCompanyCRUD}
                deleteItem={DeleteCompanyCRUD}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={CitySortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCRUD;
