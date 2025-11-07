import CRUDForm, { ColumnDefinition } from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EmployeeTypes } from "../Types/EmployeeTypes";
import { EmployeeSortFieldMap } from "../Types/MapeoEmployee";
import {
  GetEmployee,
  CreateEmployee,
  UpdateEmployee,
  DeleteEmployee,
  GetSearchEmployee,
} from "../API/EmployeeAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import IdentificationTypeSelect from "../../Client/Components/IdentificationTypeSelect";
import AreaSelect from "../../User/Components/UserSelectArea";
import PositionSelect from "../../User/Components/UserSelectPosition";
import { Form } from 'react-bootstrap';

const EmployeeCRUD = () => {
  const itemTemplate = (): EmployeeTypes => ({
    id: 0,
    name: "",
    typeIdentificationId: 0,
    typeIdentificationName: "",
    identification: 0,
    areaId: 0,
    areaName: "",
    positionId: 0,
    positionName: "",
    date: new Date().toISOString().split("T")[0],
    email: "",
    address: "",
    phone: 0,
    base_salary: undefined,
    hasBaseSalary: false,
    status: "",
  });

  const columns: ColumnDefinition<EmployeeTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true,hidden: true },
    {key: "name",label: "Nombre",required: true,minLength: 2,maxLength: 100,regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/},
    {key: "typeIdentificationId",label: "Tipo de identificación",required: true,regex: /^\d+$/},
    {key: "identification",label: "Numero de Identificación",required: true,regex: /^\d+$/},
    {key: "date",label: "Fecha de ingreso",required: true,regex: /^\d{4}-\d{2}-\d{2}$/},
    {key: "areaId",label: "Área",required: true,regex: /^\d+$/},
    {key: "positionId",label: "Cargo",required: true,regex: /^\d+$/},
    {key: "email",label: "Correo",required: true,regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    {key: "address",label: "Dirección",required: true,minLength: 5,maxLength: 200,regex: /^[A-Za-z0-9áéíóúÁÉÍÓÚ\s\.,#\-]+$/},
    {key: "phone",label: "Número de celular",required: true,regex: /^\d+$/},
    {
      key: "hasBaseSalary" as keyof EmployeeTypes,
      label: "",
      hidden: true,
    },
    {
      key: "base_salary",
      label: "Salario base",
      required: false,
      regex:/^\d+(\.\d+)?$/,
      formHidden: (item) => !item.hasBaseSalary,
      tableHidden: (item) => !item.hasBaseSalary,
      render: (item: EmployeeTypes) => item.base_salary != null ? item.base_salary : "Sin salario base",
    },
    { key: "status", label: "Estado", hiddenInCreate: true, hiddenInEdit: true,hidden: true },
  ];

    const renderCustomFormField = (colKey: keyof EmployeeTypes, value: any, onUpdate: (update: Partial<EmployeeTypes>) => void, currentItem: EmployeeTypes) => {
    if (colKey === "typeIdentificationId") {
      return (
        <IdentificationTypeSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCategoryId: number) => onUpdate({ typeIdentificationId: newCategoryId })}
        />
      );
    } else if (colKey === "areaId") {
    return (
      <AreaSelect
        selectedValue={parseInt(value, 10)}
        onChange={(newAreaId: number) =>
          onUpdate({ areaId: newAreaId })
        }
      />
    );
  } else if (colKey === "positionId") {
    return (
      <PositionSelect
        selectedValue={parseInt(value, 10)}
        onChange={(newPositionId: number) =>
          onUpdate({ positionId: newPositionId })
        }
      />
    );
  }
  if (colKey === "date") {
      return (
        <input
          type="date"
          className="form-control"
          value={value || ""}
          onChange={(e) => onUpdate({ date: e.target.value })}
          aria-label="Fecha"
        />
      );
    }
    if (colKey === "hasBaseSalary") {
      return (
        <Form.Check 
          type="checkbox"
          id="hasBaseSalary"
          label="¿El empleado tiene salario base?"
          checked={!!value}
          onChange={(e) => {
            const checked = e.target.checked;
            onUpdate({ 
              hasBaseSalary: checked, 
              ...( !checked && { base_salary: undefined } )
            });
          }}
          className="mb-3"
        />
      );
    }
    if (colKey === "base_salary") {
      if (!currentItem.hasBaseSalary) {
        return null;
      }
      return (
        <Form.Control
          type="number"
          step="0.01"
          min="0.01"
          value={value ?? ""}
          onChange={(e) => {
            const newVal = e.target.value;
            onUpdate({ base_salary: newVal === "" ? undefined : parseFloat(newVal) });
          }}
          placeholder="Ingrese el salario base"
          aria-label="Salario base"
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
              Gestión de empleados
            </h3>
            <FavoritoButton path="/Employee" label="Employeees" />
          </div>
          <p>
            Administre los empleados mediante la creación, edición o eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<EmployeeTypes>
                fetchItems={GetEmployee}
                searchItem={GetSearchEmployee}
                createItem={CreateEmployee}
                updateItem={UpdateEmployee}
                deleteItem={DeleteEmployee}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                sortFieldMap={EmployeeSortFieldMap}
                pageTitle="Empleados"
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCRUD;