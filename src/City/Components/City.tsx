import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CityTypes } from "../Types/CityTypes";
import { CitySortFieldMap } from "../Types/MapeoCity";
import {
  GetCity,
  CreateCity,
  UpdateCity,
  DeleteCity,
  GetSearchCity,
} from "../API/CityAPI";
import DepartmentSelect from "./CitySelectDepartment";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const CityCRUD = () => {
  const itemTemplate = (): CityTypes => ({
    id: 0,
    cityCode: 0,
    cityName: "",
    departmentId: 0,
    departmentName: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof CityTypes;
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
      key: "departmentName",
      label: "Departamento",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "departmentId", label: "Departamento", hidden: true },
    {
      key: "cityCode",
      label: "Codigo",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^\d+$/,
    },
    {
      key: "cityName",
      label: "Nombre",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
  ];

  const renderCustomFormField = (
    colKey: keyof CityTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "departmentId") {
      return (
        <DepartmentSelect
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de localidades
          </h3>
          <FavoritoButton path="/city" label="Localidad" />
        </div>
        <p>
          Administre las localidades mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<CityTypes>
              fetchItems={GetCity}
              searchItem={GetSearchCity}
              createItem={CreateCity}
              updateItem={UpdateCity}
              deleteItem={DeleteCity}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={CitySortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCRUD;
