import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EmployeePaymentTypes } from "../Types/EmployeePaymentTypes";
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { MoneyIcon, Salida } from "../Icons/Icons";
import { EmployeePaymentSortFieldMap } from "../Types/MapeoEmployeePaymentTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import EmployeeSelect from "./SelectEmployeePayment";
import { EmployeeHistoryTypes } from "../../EmployeeHistory/Types/EmployeeHistoryTypes";
import {GetEmployeePayment, CreateEmployeePayment, GetSearchEmployeePayment} from "../API/EmployeePaymentAPI";

const EmployeePayment = () => {
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<EmployeePaymentTypes | null>(null);
  const [generalActionKey, setGeneralActionKey] = useState<string | null>(null);
  const generalActionKeyRef = useRef<string | null>(null);
  const [fromDate, setFromDate] = useState<string>(""); 
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId, 10));
    }
  }, []);

  useEffect(() => {
    generalActionKeyRef.current = generalActionKey;
  }, [generalActionKey]);

const itemTemplate = (): EmployeePaymentTypes => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  return {
    id: 0,
    employeeId: 0,
    employeeName: "",
    date: currentDate,  
    paymentAmount: 0,
    typeTransaction: "",
    observation: "",
    status: "",
  };
};

  const getStatusColor = (typeTransaction: string) => {
    switch (typeTransaction) {
      case "PAGO":
        return "#dc3545";
      case "ENTRADA":
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

  const formatDateForBackend = (date: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchWithDates = async (
    page: number,
    size: number,
    filters: Partial<EmployeePaymentTypes>,
    sortOrder?: string,
    sortBy?: keyof EmployeePaymentTypes
  ) => {
    const formattedStartDate = fromDate ? formatDateForBackend(fromDate) : undefined;
    const formattedEndDate = toDate ? formatDateForBackend(toDate) : undefined;

    return await GetEmployeePayment(
      page,
      size,
      filters,
      sortOrder || "ASC",
      sortBy,
      formattedStartDate,
      formattedEndDate
    );
  };

  const searchWithDates = async (
    page: number,
    size: number,
    filters: Partial<EmployeePaymentTypes>,
    sortOrder?: string,
    sortBy?: keyof EmployeePaymentTypes
  ) => {
    const formattedStartDate = fromDate ? formatDateForBackend(fromDate) : undefined;
    const formattedEndDate = toDate ? formatDateForBackend(toDate) : undefined;

    return await GetSearchEmployeePayment(
      page,
      size,
      filters,
      sortOrder || "ASC",
      sortBy,
      formattedStartDate,
      formattedEndDate
    );
  };

  const columns: {
    key: keyof EmployeePaymentTypes;
    label: string;
    required?: boolean;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    type?: "text" | "number" | "image" | "password" | "date";
    render?: (item: EmployeePaymentTypes) => React.ReactNode;
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "employeeId", label: "Empleado", hidden: true, required: true },
    {
      key: "employeeName",
      label: "Empleado",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "paymentAmount",
      label: "Monto",
      required: true,
      regex: /^\d+(\.\d+)?$/,
      render: (item: EmployeePaymentTypes) => (
        <div style={{ textAlign: "center", width: "100%", fontWeight: "500" }}>
          {formatNumberWithDots(item.paymentAmount)}
        </div>
      ),
    },
    {
      key: "date",
      label: "Fecha",
      required: true,
      type: "date",
      render: (item: EmployeePaymentTypes) => {
        if (!item.date) {
          return <div style={{ textAlign: "center", width: "100%" }}>-</div>;
        }
        const [year, month, day] = item.date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            {formattedDate}
          </div>
        );
      },
    },
    {
      key: "observation",
      label: "Observación",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item) => {
        const observation = item.observation || "Sin observación";
        return <span>{observation}</span>;
      }
    },
    {
      key: "typeTransaction",
      label: "Tipo de transacción",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item) => {
        const statusColor = getStatusColor(item.typeTransaction);
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
              {item.typeTransaction}
            </span>
          </div>
        );
      },
    },
  ];

  const renderCustomActionValidation = (generalActionKey: string) => {
    if (!currentItem) return false;

    const isPaymentAction = generalActionKey === "loan";
    const isMovementAction = generalActionKey === "subtract";

    if (currentItem.employeeId === 0) {
      return false;
    }

    if (!currentItem.paymentAmount || currentItem.paymentAmount <= 0) {
      return false;
    }

    if (isMovementAction && (!currentItem.typeTransaction || currentItem.typeTransaction === "")) {
      return false;
    }

    if (!currentItem.date) {
      return false;
    }

    return true;
  };

  const renderCustomFormField = (
    colKey: keyof EmployeePaymentTypes,
    value: any,
    onUpdate: (update: Partial<EmployeePaymentTypes>) => void,
  ) => {
    if (colKey === "employeeId") {
      return (
        <EmployeeSelect
          selectedValue={parseInt(value, 10) || 0}
          onChange={(newEmployeeId: number, employeeData?: EmployeeHistoryTypes) => {
            const isPaymentAction = generalActionKeyRef.current === "loan";
            
            if (isPaymentAction && employeeData?.total !== undefined) {
              onUpdate({ 
                employeeId: newEmployeeId,
                paymentAmount: employeeData.total
              });
            } else {
              onUpdate({ employeeId: newEmployeeId });
            }
          }}
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
    if (colKey === "typeTransaction") {
      return (
        <Form.Select
          value={value || ""}
          onChange={(e) => onUpdate({ typeTransaction: e.target.value })}
          aria-label="Tipo de movimiento"
          required
        >
          <option value="">Seleccione tipo</option>
          <option value="ENTRADA">Entrada</option>
          <option value="PRESTAMO">Préstamo</option>
        </Form.Select>
      );
    }
    return null;
  };

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    actionKey: string,
    modalCurrentItem: EmployeePaymentTypes | null,
    onFieldUpdate: (update: Partial<EmployeePaymentTypes>) => void
  ) => {
    if (!modalCurrentItem) return null;

    if (actionKey !== generalActionKey) {
      setGeneralActionKey(actionKey);
      generalActionKeyRef.current = actionKey;
    }

    if (modalCurrentItem !== currentItem) {
      setCurrentItem(modalCurrentItem);
    }

    const isPaymentAction = actionKey === "loan";
    const isMovementAction = actionKey === "subtract";
    const paymentLabel = isPaymentAction ? "Valor a pagar" : "Monto";

    if (isPaymentAction && modalCurrentItem.typeTransaction !== "PAGO") {
      onFieldUpdate({ typeTransaction: "PAGO" });
    }

    const isEmployeeInvalid = modalCurrentItem.employeeId === 0;
    const isPaymentAmountInvalid = !isEmployeeInvalid && (!modalCurrentItem.paymentAmount || modalCurrentItem.paymentAmount <= 0);
    const isTypeTransactionInvalid = !isEmployeeInvalid && !isPaymentAmountInvalid && isMovementAction && (!modalCurrentItem.typeTransaction || modalCurrentItem.typeTransaction === "");
    
    const handleFieldUpdate = (update: Partial<EmployeePaymentTypes>) => {
      const updatedItem = { ...modalCurrentItem, ...update };
      setCurrentItem(updatedItem);
      onFieldUpdate(update);
    };

    return (
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Empleado <span className="text-danger">*</span>
              </Form.Label>
              {renderCustomFormField("employeeId", modalCurrentItem.employeeId, handleFieldUpdate)}
              {isEmployeeInvalid && (
                <div className="text-danger small mt-1">
                  Empleado es obligatorio.
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                {paymentLabel} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={paymentLabel}
                value={
                  modalCurrentItem.paymentAmount != null
                    ? modalCurrentItem.paymentAmount.toLocaleString('es-ES', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : ""
                }
                onChange={(e) => {
                  let input = e.target.value;
                  input = input.replace(/\./g, "");

                  if (!/^\d*\.?\d*$/.test(input)) {
                    return;
                  }

                  const numericValue = input === "" ? 0 : parseFloat(input);

                  handleFieldUpdate({
                    paymentAmount: numericValue,
                  });
                }}
                required
                className="fw-medium"
                isInvalid={isPaymentAmountInvalid}
              />
              {isPaymentAmountInvalid && (
                <div className="text-danger small mt-1">
                  {paymentLabel} es obligatorio.
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {isMovementAction && (
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tipo de movimiento <span className="text-danger">*</span>
                </Form.Label>
                {renderCustomFormField("typeTransaction", modalCurrentItem.typeTransaction, handleFieldUpdate)}
                {isTypeTransactionInvalid && (
                  <div className="text-danger small mt-1">
                    Tipo de movimiento es obligatorio.
                  </div>
                )}
              </Form.Group>
            </Col>
          )}

          <Col md={isMovementAction ? 6 : 12}>
            <Form.Group className="mb-3">
              <Form.Label>
                Fecha <span className="text-danger">*</span>
              </Form.Label>
              {renderCustomFormField("date", modalCurrentItem.date, handleFieldUpdate)}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Observación opcional"
                value={modalCurrentItem.observation || ""}
                onChange={(e) => handleFieldUpdate({ observation: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>

        {isPaymentAction && (
          <input type="hidden" name="typeTransaction" value="PAGO" />
        )}
      </Form>
    );
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de ingresos, préstamos y pagos a empleados
          </h3>        
          <FavoritoButton path="/EmployeePayment" label="Pagos a Empleados" />
        </div>
        <p>Administre la nómina, ingresos, préstamos y pagos a empleados.</p>

        <div className="mb-1">
          <label className="form-label d-block mb-1">Rango de Fechas</label>

          <div className="date-range-container d-flex gap-2">
            <input
              type="date"
              className="form-control date-input-responsive"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="Fecha desde"
            />
            <input
              type="date"
              className="form-control date-input-responsive"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="Fecha hasta"
            />
          </div>
        </div>
        
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<EmployeePaymentTypes>
              fetchItems={fetchWithDates}
              searchItem={searchWithDates}
              createItem={CreateEmployeePayment}
              updateItem={async () => {}}
              deleteItem={async () => {}}
              generalItems={{
                add: CreateEmployeePayment,
                subtract: CreateEmployeePayment,
                loan: CreateEmployeePayment,
              }}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              hiddenAddButton={false}
              hiddenAddPlusButton={false}
              hiddenSubtractButton={true}
              hiddenEditButton={false}
              hiddenDeleteButton={false}
              sortFieldMap={EmployeePaymentSortFieldMap}
              pageTitle="Pagos a Empleados"
              renderCustomFormField={renderCustomFormField}
              renderCustomActionModal={renderCustomActionModal}
              renderCustomActionValidation={renderCustomActionValidation}
              customGeneralActionButtons={[
                {
                  key: "loan",
                  label: "Crear pago",
                  color: "success",
                  icon: <MoneyIcon />,
                  order: 8,
                  hidden: false,
                  ariaLabel: "Registrar pago a empleado",
                },
              ]}
              customSubtractActionButton={{
                label: "Movimientos",
                color: "warning",
                icon: <Salida />,
                order: 6,
                ariaLabel: "Registrar movimiento",
              }}
              key={`${fromDate}-${toDate}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayment;