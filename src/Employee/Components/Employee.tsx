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


const formatNumberWithDots = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return "Sin salario base";
  return value.toLocaleString('es-ES');
};

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
    baseSalary: undefined,
    hasBaseSalary: false,
    status: "",
  });

  const columns: ColumnDefinition<EmployeeTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
    { key: "name", label: "Nombre", required: true },
    { key: "typeIdentificationId", label: "Tipo de identificación", hidden: true },
    { key: "typeIdentificationName", label: "Tipo de identificación", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
    {
      key: "identification",
      label: "Identificación",
      render: (item) => {
        const identification = item.identification || "No disponible";
        const identificationType = item.typeIdentificationName || "Sin tipo";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "1.1em", fontWeight: "600" }}>
              {identificationType}
            </span>
            <span>{identification}</span>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Fecha de ingreso",
      required: true,
      render: (item: EmployeeTypes) => {
        if (!item.date) {
          return <div style={{ textAlign: "center", width: "100%" }}>-</div>;
        }
        const [year, month, day] = item.date.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            {formattedDate}
          </div>
        );
      },
    },
    { key: "areaId", label: "Área", required: true, regex: /^\d+$/, hidden: true },
    { key: "areaName", label: "Área", hiddenInCreate: true, hiddenInEdit: true },
    { key: "positionId", label: "Cargo", required: true, regex: /^\d+$/, hidden: true },
    { key: "positionName", label: "Cargo", hiddenInCreate: true, hiddenInEdit: true },
    { key: "email", label: "Correo" },
    { key: "address", label: "Dirección" },
    { key: "phone", label: "Celular", regex: /^\d+$/ },
    {
      key: "hasBaseSalary",
      label: "",
      hidden: true,
    },
    {
      key: "baseSalary",
      label: "Salario base",
      required: false,
      regex: /^\d+(\.\d+)?$/,
      formHidden: (item) => !item.hasBaseSalary,
      render: (item: EmployeeTypes) => (
        <div style={{ textAlign: "center", width: "100%", fontWeight: "500" }}>
          {formatNumberWithDots(item.baseSalary)}
        </div>
      ),
    },
    { key: "status", label: "Estado", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
  ];

  const renderCustomFormField = (
    colKey: keyof EmployeeTypes,
    value: any,
    onUpdate: (update: Partial<EmployeeTypes>) => void,
    currentItem: EmployeeTypes
  ) => {
    if (colKey === "typeIdentificationId") {
      return (
        <IdentificationTypeSelect
          selectedValue={parseInt(String(value || "0"), 10)}
          onChange={(newCategoryId: number) => onUpdate({ typeIdentificationId: newCategoryId })}
        />
      );
    }

    if (colKey === "areaId") {
      return (
        <AreaSelect
          selectedValue={parseInt(String(value || "0"), 10)}
          onChange={(newAreaId: number) => onUpdate({ areaId: newAreaId })}
        />
      );
    }

    if (colKey === "positionId") {
      return (
        <PositionSelect
          selectedValue={parseInt(String(value || "0"), 10)}
          onChange={(newPositionId: number) => onUpdate({ positionId: newPositionId })}
        />
      );
    }

    if (colKey === "date") {
      return (
        <Form.Control
          type="date"
          value={value || ""}
          onChange={(e) => onUpdate({ date: e.target.value })}
          aria-label="Fecha de ingreso"
        />
      );
    }

    if (colKey === "hasBaseSalary") {
      return (
        <Form.Check
          type="checkbox"
          id="hasBaseSalary"
          label="¿El empleado tiene salario base?"
          checked={!!currentItem.hasBaseSalary}
          onChange={(e) => {
            const checked = e.target.checked;
            onUpdate({
              hasBaseSalary: checked,
              baseSalary: checked ? currentItem.baseSalary ?? undefined : undefined,
            });
          }}
          className="mb-3"
        />
      );
    }
if (colKey === "baseSalary") {
  if (!currentItem.hasBaseSalary) {
    return null;
  }

  const displayValue = currentItem.baseSalary != null && !isNaN(currentItem.baseSalary)
    ? currentItem.baseSalary.toLocaleString('es-ES', { minimumFractionDigits: 0 })
    : "";

  return (
    <Form.Control
      type="text"
      value={displayValue}
      onChange={(e) => {
        const input = e.target.value.replace(/\./g, '');

        if (!/^\d*\.?\d*$/.test(input)) {
          return;
        }

        const numericValue = input === "" || input === "." ? undefined : parseFloat(input);
        onUpdate({ baseSalary: numericValue });
      }}
      placeholder="Ej: 1.500.000"
      aria-label="Salario base"
      className="fw-medium "
    />
  );
}
  return null;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "21px" }}>Gestión de empleados</h3>
            <FavoritoButton path="/employee" label="Empleados" />
          </div>
          <p>Administre los empleados mediante la creación, edición o eliminación de registros.</p>

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