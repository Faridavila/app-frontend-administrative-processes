import { useState } from "react";
import { Button } from "react-bootstrap";
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { BranchTypes } from "../Types/BranchTypes";
import { branchSortFieldMap } from "../Types/MapeoBranch";
import MainBranchCheckbox from "./BranchCheckbox";
import DepartmentSelect from "./BranchSelectDepartment";
import MunicipalitySelect from "./BranchSelectCity";
import CompanySelect from "./BranchSelectCompany";
import { Download } from "../Icons/Icons";
import {
  GetBranch,
  CreateBranch,
  UpdateBranch,
  DeleteBranch,
  GetSearchBranch,
} from "../API/BranchAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const BranchCRUD = () => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);

  const itemTemplate = (): BranchTypes => ({
    id: 0,
    mainBranch: "",
    branchName: "",
    departmentName: "",
    companyName: "",
    municipality: "",
    departmentId: 0,
    companyId: 0,
    municipalityId: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof BranchTypes;
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
      key: "branchName",
      label: "Nombre de la Sucursal",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    { key: "mainBranch", label: "¿Es sucursal principal?", hidden: true },
    { key: "departmentId", label: "Departamento", hidden: true },
    { key: "municipalityId", label: "Municipio", hidden: true },
    { key: "companyId", label: "Nombre de empresa", hidden: true },
    {
      key: "departmentName",
      label: "Departamento",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "municipality",
      label: "Municipio",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "companyName",
      label: "Nombre de empresa",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
  ];

  const renderCustomFormField = (
    colKey: keyof BranchTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "mainBranch") {
      return <MainBranchCheckbox value={value} onChange={onChange} />;
    } else if (colKey === "departmentId") {
      return (
        <DepartmentSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) => {
            setSelectedDepartmentId(newDepartmentId);
            onChange(newDepartmentId.toString());
          }}
        />
      );
    } else if (colKey === "municipalityId") {
      return (
        <MunicipalitySelect
          selectedValue={parseInt(value, 10)}
          departmentId={selectedDepartmentId || 0}
          onChange={(newMunicipalityId) => {
            onChange(newMunicipalityId);
          }}
        />
      );
    } else if (colKey === "companyId") {
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
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de Sucursales
            </h3>{" "}
            <FavoritoButton path="/branch" label="Sucursales" />
          </div>
          <p>
            Administre las sucursales mediante la creación, edición o
            eliminación de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <div
                className="d-flex justify-content-end mb-3"
                style={{ position: "absolute", right: "180px", top: "30px" }}
              >
                <Button
                  className="btn btn-primary me-2"
                  aria-label="Descargar tabla"
                  style={{ fontSize: "0px", padding: "8px 10px" }}
                >
                  <Download />
                </Button>
              </div>

              <CRUDForm<BranchTypes>
                fetchItems={GetBranch}
                searchItem={GetSearchBranch}
                createItem={CreateBranch}
                updateItem={UpdateBranch}
                deleteItem={DeleteBranch}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={branchSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchCRUD;
