import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProcessCompanyTypes } from "../Types/ProcessCompanyTypes";
import { ProcessCompanySortFieldMap } from "../Types/MapeoProcessCompany";
import {
  GetProcessCompany,
  CreateProcessCompany,
  UpdateProcessCompany,
  DeleteProcessCompany,
  GetSearchProcessCompany,
} from "../API/ProcessCompanyAPI";
import ProcessSelect from "./ProcessCompanySelectProcess";
import CompanySelect from "./ProcessCompanySelectCompany";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ProcessCompanyCRUD = () => {
  const itemTemplate = (): ProcessCompanyTypes => ({
    id: 0,
    confWorkFlowProcessName: "",
    companyName: "",
    confWorkflowProcessId: 0,
    companyId: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof ProcessCompanyTypes;
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
      key: "confWorkFlowProcessName",
      label: "Procesos",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "companyName", label: "Empresa" },
    {
      key: "confWorkflowProcessId",
      label: "Proceso",
      required: true,
      maxLength: 100,
      regex: /^\d+$/,
      hidden: true,
    },
    {
      key: "companyId",
      label: "Empresa",
      required: true,
      maxLength: 100,
      regex: /^\d+$/,
      hidden: true,
    },
  ];

  const renderCustomFormField = (
    colKey: keyof ProcessCompanyTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "confWorkflowProcessId") {
      return (
        <ProcessSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) =>
            onChange(newDepartmentId.toString())
          }
        />
      );
    } else if (colKey === "companyName") {
      return (
        <CompanySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) =>
            onChange(newDepartmentId.toString())
          }
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
              Gestión de procesos y empresas
            </h3>
            <FavoritoButton path="/processCompany" label="Procesos empresa" />
          </div>
          <p>
            Administre los procesos y empresas mediante la creación, edición o
            eliminación de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ProcessCompanyTypes>
                fetchItems={GetProcessCompany}
                searchItem={GetSearchProcessCompany}
                createItem={CreateProcessCompany}
                updateItem={UpdateProcessCompany}
                deleteItem={DeleteProcessCompany}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ProcessCompanySortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessCompanyCRUD;
