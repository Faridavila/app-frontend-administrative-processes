import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { DepartmentTypes } from "../Types/DepartmentTypes";
import { DepartmentSortFieldMap } from "../Types/MapeoDepartment";
import {
  GetDepartment,
  CreateDepartment,
  UpdateDepartment,
  DeleteDepartment,
  GetSearchDepartment,
} from "../API/DepartmentAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const DepartmentCRUD = () => {
  const itemTemplate = (): DepartmentTypes => ({
    id: 0,
    departmentCode: 0,
    departmentName: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof DepartmentTypes;
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
      key: "departmentCode",
      label: "Código",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^\d+$/,
    },
    {
      key: "departmentName",
      label: "Nombre",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
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
              Gestión de Departamentos
            </h3>{" "}
            <FavoritoButton path="/department" label="Departamentos" />
          </div>
          <p>
            Administre los departamentos mediante la creación, edición o
            eliminación de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<DepartmentTypes>
                fetchItems={GetDepartment}
                searchItem={GetSearchDepartment}
                createItem={CreateDepartment}
                updateItem={UpdateDepartment}
                deleteItem={DeleteDepartment}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={DepartmentSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCRUD;
