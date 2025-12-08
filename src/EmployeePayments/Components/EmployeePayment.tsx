import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { EmployeePaymentTypes } from "../Types/EmployeePaymentTypes";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap';
import { MoneyIcon, Salida } from '../Icons/Icons'; 
import { EmployeePaymentSortFieldMap } from "../Types/MapeoEmployeePaymentTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import EmployeePaymentSelect from "./SelectEmployeePayment";
import {
  GetEmployeePayment,
  UpdateIntorySubtract,
  DeleteEmployeePayment,
  CreateEmployeePayment,
  UpdateEmployeePayment,
  GetSearchEmployeePayment,
  UpdateIntoryAdd,
} from "../API/EmployeePaymentAPI";

interface EmployeePaymentLine {
  tempId: string;
  EmployeePaymentId: number;
  EmployeePaymentName: string;
  purchasePrice: number;
  quantity: number;
  total: number;
}

const EmployeePayment = () => {
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [EmployeePaymentLines, setEmployeePaymentLines] = useState<EmployeePaymentLine[]>([]);
  const [date, setDate] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [currentAction, setCurrentAction] = useState<'add' | 'subtract' | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const itemTemplate = (): EmployeePaymentTypes => ({
    id: 0,
    employeeId: 0,
    employeeName: "",
    positionName: "",
    areaName: "",
    date: new Date().toISOString().split("T")[0],
    phone: 0,
    paymentAmount: 0,
    typeTransaction: "",
    observation: "",
    movements: "",
    status: "",
  });

  const getStatusColor = (EmployeePaymentStatus: string) => {
    switch (EmployeePaymentStatus) {
      case "agotado":
        return "red";
      case "pocas unidades":
        return "orange";
      case "disponible":
        return "green";
      default:
        return "transparent";
    }
  };

  const columns: {
    key: keyof EmployeePaymentTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof EmployeePaymentTypes;
    validationMessage?: string;
    render?: (item: EmployeePaymentTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
    { key: "employeeId", label: "Empleado", hidden: true, required: true },
    { key: "employeeName", label: "Empleado", hiddenInCreate: true, hiddenInEdit: true },
    { key: "areaName", label: "Área", hiddenInCreate: true, hiddenInEdit: true },
    { key: "positionName", label: "Cargo", hiddenInCreate: true, hiddenInEdit: true },
    { key: "phone", label: "Teléfono", hiddenInCreate: true, hiddenInEdit: true, regex: /^\d+$/ },
    { key: "paymentAmount", label: "Monto", required: true, regex: /^\d+(\.\d+)?$/ },
    { key: "movements", label: "Tipo de movimiento", required: true },
    {
      key: "date",
      label: "Fecha",
      render: (item) => {
        const date = item.date ? new Date(item.date).toLocaleDateString() : "No disponible";
        return <span>{date}</span>;
      }
    },
    {
      key: "observation",
      label: "Observacion",
      hidden: true,
      required: true,
    },
    {
      key: "typeTransaction",
      label: "Tipo de transacción",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item) => {
        const statusColor = getStatusColor(item.typeTransaction);
        return (
          <span
            style={{
              backgroundColor: statusColor,
              padding: '5px',
              borderRadius: '5px',
              color: '#fff',
            }}
          >
            {item.typeTransaction}
          </span>
        );
      }
    }
  ];

  const renderCustomFormField = (
    colKey: keyof EmployeePaymentTypes,
    value: any,
    onUpdate: (update: Partial<EmployeePaymentTypes>) => void,
    currentItem: EmployeePaymentTypes
  ) => {
    if (colKey === "employeeId") {
      return (
        <EmployeePaymentSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newEmployeePaymentId: number) => onUpdate({ employeeId: newEmployeePaymentId })} 
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
    if (colKey === "movements") {
      return (
        <Form.Select
          value={value || ""}
          onChange={(e) => onUpdate({ movements: e.target.value })}
          aria-label="Tipo de movimiento"
          required
        >
          <option value="entrada">Seleccione una opcion</option>
          <option value="entrada">Entrada</option>
          <option value="prestamo">Préstamo</option>
        </Form.Select>
      );
    }
    return null;
  };

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: EmployeePaymentTypes | null,
    onFieldUpdate: (update: Partial<EmployeePaymentTypes>) => void
  ) => {
    if (!currentItem) return null;

    const isLoanAction = generalActionKey === 'loan';
    const showMovements = !isLoanAction;
    const paymentLabel = isLoanAction ? 'Valor a pagar' : 'Monto';

    return (
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Empleado <span className="text-danger">*</span></Form.Label>
              {renderCustomFormField('employeeId', currentItem.employeeId, onFieldUpdate, currentItem)}
              {currentItem.employeeId === 0 && <div className="text-danger small mt-1">Empleado es obligatorio.</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{paymentLabel} <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="paymentAmount"
                placeholder={paymentLabel}
                value={currentItem.paymentAmount || ''}
                onChange={(e) => onFieldUpdate({ paymentAmount: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {showMovements ? (
            <>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de movimiento <span className="text-danger">*</span></Form.Label>
                  {renderCustomFormField('movements', currentItem.movements, onFieldUpdate, currentItem)}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha <span className="text-danger">*</span></Form.Label>
                  {renderCustomFormField('date', currentItem.date, onFieldUpdate, currentItem)}
                </Form.Group>
              </Col>
            </>
          ) : (
            <>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha <span className="text-danger">*</span></Form.Label>
                  {renderCustomFormField('date', currentItem.date, onFieldUpdate, currentItem)}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Observación <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observation"
                    placeholder="Observación"
                    value={currentItem.observation || ''}
                    onChange={(e) => onFieldUpdate({ observation: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
        {showMovements && (
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Observación <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observation"
                  placeholder="Observación"
                  value={currentItem.observation || ''}
                  onChange={(e) => onFieldUpdate({ observation: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </Form>
    );
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de  ingresos, préstamos y pagos  a empleados
          </h3>
          <FavoritoButton path="/EmployeePayment" label="EmployeePaymentos" />
        </div>
        <p>
          Administre la nomina, ingresos, préstamos y pagos a empleados.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<EmployeePaymentTypes>
              fetchItems={GetEmployeePayment}
              searchItem={GetSearchEmployeePayment}
              createItem={CreateEmployeePayment}
              updateItem={UpdateEmployeePayment}
              deleteItem={DeleteEmployeePayment}
              generalItems={{
                add: UpdateIntoryAdd,
                subtract: UpdateIntorySubtract,
                loan: UpdateIntoryAdd 
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
              pageTitle="Inventario"
              renderCustomFormField={renderCustomFormField}
              renderCustomActionModal={renderCustomActionModal}
              customGeneralActionButtons={[
                {
                  key: 'loan',
                  label: 'Crear pago',
                  color: 'success',
                  icon: <MoneyIcon />,
                  order: 8,
                  hidden: false,
                  ariaLabel: 'Registrar Préstamo a Empleado'
                }
              ]}
              customSubtractActionButton={{
                label: 'Movimientos',
                color: 'warning',
                icon: <Salida />,
                order: 6,
                ariaLabel: 'Registrar Salida'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayment;