import CRUDForm, { ColumnDefinition } from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EmployeeHistoryTypes } from "../Types/EmployeeHistoryTypes";
import { EmployeeHistorySortFieldMap } from "../Types/MapeoEmployeeHistory";
import {GetEmployeeHistory,GetSearchEmployeeHistory,} from "../API/EmployeeHistoryAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const EmployeeHistoryCRUD = () => {
  const itemTemplate = (): EmployeeHistoryTypes => ({
    id: 0,
    name: "",
    identification: 0,
    typeIdentificationName: "",
    areaName: "",
    positionName: "",
    phone: 0,
    baseSalary: undefined,
    total:0,
    paymentStatus: "",
  });

    const getStatusColor = (typeTransaction: string) => {
    switch (typeTransaction) {
      case "CANCELADO":
        return "#dc3545";
      case "PENDIENTE":
        return "#28a745";
      case "PRESTAMO":
        return "#ffbf00";
      default:
        return "transparent";
    }
  };

  const formatNumberWithDots = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return "Sin salario base";
  return value.toLocaleString('es-ES');
};


  const columns: ColumnDefinition<EmployeeHistoryTypes>[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true,hidden: true },
    {key: "name",label: "Nombre",required: true,minLength: 2,maxLength: 100,regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/},
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
    {key: "phone",label: "Número de celular",required: true,regex: /^\d+$/},
    { key: "paymentStatus", label: "Estado", hiddenInCreate: true, hiddenInEdit: true,
      render: (item) => {
        const statusColor = getStatusColor(item.paymentStatus);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <span
              style={{
                backgroundColor: statusColor,
                padding: "5px 14px",
                borderRadius: "80px",
                color: "#fff",
                fontWeight: "500",
                display: "inline-block",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              {item.paymentStatus}
            </span>
          </div>
        );
      },
    },
  {
      key: "baseSalary",
      label: "Salario base",
      required: false,
      regex: /^\d+(\.\d+)?$/,
      render: (item: EmployeeHistoryTypes) => (
        <div style={{ textAlign: "center", width: "100%", fontWeight: "500" }}>
          {formatNumberWithDots(item.baseSalary)}
        </div>
      ),
    },
    { key: "total", label: "Valor a pagar", hiddenInCreate: true, hiddenInEdit: true,
        render: (item: EmployeeHistoryTypes) => (
        <div style={{ textAlign: "center", width: "100%", fontWeight: "500" }}>
          {formatNumberWithDots(item.total)}
        </div>
      ),
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
                createItem={async () => {}}
                updateItem={async () => {}}
                deleteItem={async () => {}}
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