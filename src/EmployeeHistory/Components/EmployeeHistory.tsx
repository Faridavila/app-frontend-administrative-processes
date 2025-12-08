import CRUDForm, { ColumnDefinition } from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EmployeeHistoryTypes } from "../Types/EmployeeHistoryTypes";
import { EmployeeHistorySortFieldMap } from "../Types/MapeoEmployeeHistory";
import {
  GetEmployeeHistory,
  CreateEmployeeHistory,
  UpdateEmployeeHistory,
  DeleteEmployeeHistory,
  GetSearchEmployeeHistory,
} from "../API/EmployeeHistoryAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const EmployeeHistoryCRUD = () => {
  const itemTemplate = (): EmployeeHistoryTypes => ({
    id: 0,
    name: "",
    identification: 0,
    areaName: "",
    positionName: "",
    phone: 0,
    base_salary: undefined,
    paymentValue:"",
    paymentStatus: "",
  });

  const columns: ColumnDefinition<EmployeeHistoryTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true,hidden: true },
    {key: "name",label: "Nombre",required: true,minLength: 2,maxLength: 100,regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/},
    {key: "identification",label: "Numero de Identificación",required: true,regex: /^\d+$/},
    {key: "phone",label: "Número de celular",required: true,regex: /^\d+$/},
    {key: "areaName",label: "Area",required: true,regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    {key: "positionName",label: "Cargo",required: true,minLength: 5,maxLength: 200,regex: /^[A-Za-z0-9áéíóúÁÉÍÓÚ\s\.,#\-]+$/},
    { key: "paymentStatus", label: "Estado", hiddenInCreate: true, hiddenInEdit: true},
    {
      key: "base_salary",
      label: "Salario base",
      required: false,
      regex:/^\d+(\.\d+)?$/,
      render: (item: EmployeeHistoryTypes) => item.base_salary != null ? item.base_salary : "Sin salario base",
    },
    { key: "paymentValue", label: "Valor tota", hiddenInCreate: true, hiddenInEdit: true},
    
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
            Consulta de pago de empleados
            </h3>
            <FavoritoButton path="/EmployeeHistory" label="EmployeeHistoryes" />
          </div>
          <p>
            Consulte el pago a empleados.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<EmployeeHistoryTypes>
                fetchItems={GetEmployeeHistory}
                searchItem={GetSearchEmployeeHistory}
                createItem={CreateEmployeeHistory}
                updateItem={UpdateEmployeeHistory}
                deleteItem={DeleteEmployeeHistory}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                hiddenAddButton={false}
                hiddenAddPlusButton={false}
                hiddenSubtractButton={false}
                hiddenEditButton={false}
                hiddenDeleteButton={false}
                sortFieldMap={EmployeeHistorySortFieldMap}
                pageTitle="Consulta de pagos nomina "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHistoryCRUD;