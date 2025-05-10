import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { UserTypes } from "../Types/UserTypes";
import { UserSortFieldMap } from "../Types/MapeoUser";
import {
  GetUser,
  CreateUser,
  UpdateUser,
  DeleteUser,
  GetSearchUser,
} from "../API/UserAPI";
import CompanySelect from "./UserSelectCompany";
import AreaSelect from "./UserSelectArea";
import RolSelect from "./UserSelectRol";
import PositionSelect from "./UserSelectPosition";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const UserCRUD = () => {
  const itemTemplate = (): UserTypes => ({
    id: 0,
    name: "",
    login: "",
    password: "",
    email: "",
    rol: { id: 0, name: "" },
    position: { id: 0, description: "" },
    company: { companyid: 0, companyName: "" },
    area: { id: 0, description: "" },
    status: "ACTIVE",
  });

  const columns: {
    key: keyof UserTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: UserTypes) => React.ReactNode;
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "name",
      label: "Nombre",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "login",
      label: "Login",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "password",
      label: "Contraseña",
      required: true,
      minLength: 2,
      maxLength: 100,
      render: (item: UserTypes) => (
        <span>{"*".repeat(item.password.length)}</span>
      ),
    },
    {
      key: "email",
      label: "Correo",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "area",
      label: "Area",
      render: (item: UserTypes) => {
        return item.area?.description || "";
      },
    },
    {
      key: "rol",
      label: "Rol",
      render: (item: UserTypes) => {
        return item.rol?.name || "";
      },
    },
    {
      key: "position",
      label: "Cargo",
      render: (item: UserTypes) => {
        return item.position?.description || "";
      },
    },
    {
      key: "company",
      label: "Empresa",
      render: (item: UserTypes) => {
        return item.company?.companyName || "";
      },
    },
  ];

  const renderCustomFormField = (
    colKey: keyof UserTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "company") {
      return (
        <CompanySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) =>
            onChange(newDepartmentId.toString())
          }
        />
      );
    } else if (colKey === "area") {
      return (
        <AreaSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) =>
            onChange(newDepartmentId.toString())
          }
        />
      );
    } else if (colKey === "rol") {
      return (
        <RolSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) =>
            onChange(newDepartmentId.toString())
          }
        />
      );
    } else if (colKey === "position") {
      return (
        <PositionSelect
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
              Gestión de Usuarios
            </h3>
            <FavoritoButton path="/user" label="Usuarios" />
          </div>
          <p>
            Administre los usuarios mediante la creación, edición o eliminación
            de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<UserTypes>
                fetchItems={GetUser}
                searchItem={GetSearchUser}
                createItem={CreateUser}
                updateItem={UpdateUser}
                deleteItem={DeleteUser}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={UserSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCRUD;
