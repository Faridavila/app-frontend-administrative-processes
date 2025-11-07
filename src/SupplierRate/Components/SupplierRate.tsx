import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { SupplierRateTypes } from "../Types/SupplierRateTypes";
import { SupplierRateSortFieldMap } from "../Types/MapeoSupplierRate";
import {
  GetSupplierRate,
  CreateSupplierRate,
  UpdateSupplierRate,
  DeleteSupplierRate,
  GetSearchSupplierRate,
} from "../API/SupplierRateAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import SuppliersSelect from "../../ShoppingSuppliers/Components/SelectSupplier";
import { useState, useEffect } from 'react';
import { Row, Col, Form, Alert, Table } from 'react-bootstrap';
import { PriceIcon } from "../Icons/Icons";

const SupplierRateCRUD = () => {
  const [allSupplierRates, setAllSupplierRates] = useState<SupplierRateTypes[]>([]);

  useEffect(() => {
    const fetchAllRates = async () => {
      try {
        const allData = await GetSupplierRate(0, 10000, {}, undefined, undefined);
        setAllSupplierRates(allData || []);
      } catch (error) {
        console.error('Error fetching all supplier rates:', error);
      }
    };
    fetchAllRates();
  }, []);

  const itemTemplate = (): SupplierRateTypes => ({
    id: 0,
    supplierId: 0,
    supplierName: "",
    priceRate: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof SupplierRateTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    type?: "text" | "number" | "image" | "password";
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "supplierId",
      label: "Bodega",
      hidden: true,
      required: true,
      type: "number",  
    },
    {
      key: "supplierName",
      label: "Bodega",
      hiddenInCreate: true,
      hiddenInEdit: true
    },
    {
      key: "priceRate",
      label: "Tarifa",
      required: true,
      type: "number",  
    },
  ];

  const renderCustomFormField = (
    colKey: keyof SupplierRateTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "supplierId") {
      return (
        <SuppliersSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newSupplierId: number) => {
            onChange(newSupplierId.toString());
          }}
        />
      );
    }
    return null;
  };

  const updatePricesFunction = async (
    item: SupplierRateTypes,
    imageFile: File | null,
    extraParams?: Record<string, any>
  ) => {
    const percentageChange = item.priceRate;
    const operationType = item.supplierId === 2 ? 'decrease' : 'increase';

    if (percentageChange <= 0) {
      throw new Error('El porcentaje debe ser mayor a 0');
    }

    if (item.supplierId <= 0) {
      throw new Error('Debe seleccionar un tipo de operación');
    }

    if (allSupplierRates.length === 0) {
      throw new Error('No hay tarifas para actualizar');
    }

    for (const rate of allSupplierRates) {
      const currentPrice = rate.priceRate;
      const changeAmount = (currentPrice * percentageChange) / 100;
      const newPrice = operationType === 'increase' 
        ? currentPrice + changeAmount 
        : currentPrice - changeAmount;

      const updatedRate: SupplierRateTypes = {
        ...rate,
        priceRate: Math.max(0, newPrice),
      };

      await UpdateSupplierRate(rate.id, updatedRate, extraParams);
    }
  };
  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: SupplierRateTypes | null,
    onFieldUpdate: (update: Partial<SupplierRateTypes>) => void
  ) => {
    if (generalActionKey !== 'subtract') return null; 

    const percentageChange = currentItem?.priceRate || 0;
    const operationType = currentItem?.supplierId === 2 ? 'decrease' : 'increase';

    const previewChanges = allSupplierRates.map(rate => {
      const currentPrice = rate.priceRate;
      const changeAmount = (currentPrice * percentageChange) / 100;
      const newPrice = operationType === 'increase' 
        ? currentPrice + changeAmount 
        : currentPrice - changeAmount;
      
      return {
        ...rate,
        currentPrice,
        newPrice: Math.max(0, newPrice),
        changeAmount: operationType === 'increase' ? changeAmount : -changeAmount,
      };
    });

    return (
      <Form>
        <Alert variant="info" className="mb-3">
          <strong> Actualización General de Tarifas</strong>
        </Alert>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tipo de operación <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={currentItem?.supplierId || ''}
                onChange={(e) => onFieldUpdate({ supplierId: parseInt(e.target.value) || 0 })}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value={1}>Incremento</option>
                <option value={2}>Disminución</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Valor <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={currentItem?.priceRate || 0}
                onChange={(e) => onFieldUpdate({ priceRate: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 10 para 10%"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {percentageChange > 0 && allSupplierRates.length > 0 && (
          <>
            <Alert variant="warning" className="mb-3">
              <strong>⚠️ Vista Previa</strong> - Se {operationType === 'increase' ? 'incrementarán' : 'disminuirán'} las tarifas en <strong>{percentageChange}%</strong>
            </Alert>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
              <Table bordered hover size="sm" className="mb-0">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Proveedor</th>
                    <th className="text-end">Tarifa Actual</th>
                    <th className="text-center">Cambio</th>
                    <th className="text-end">Nueva Tarifa</th>
                  </tr>
                </thead>
                <tbody>
                  {previewChanges.map((item) => (
                    <tr key={item.id}>
                      <td>{item.supplierName}</td>
                      <td className="text-end">${item.currentPrice.toFixed(2)}</td>
                      <td className="text-center">
                        <span className={operationType === 'increase' ? 'text-success' : 'text-danger'}>
                          {operationType === 'increase' ? '+' : '-'}${Math.abs(item.changeAmount).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-end">
                        <strong>${item.newPrice.toFixed(2)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <Alert variant="success" className="mt-3 mb-0">
              <strong>📊 Resumen:</strong> Se actualizarán <strong>{allSupplierRates.length}</strong> tarifa(s)
            </Alert>
          </>
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
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de tarifa de proveedores
            </h3>
            <FavoritoButton path="/SupplierRate" label="SupplierRate" />
          </div>
          <p>
            Administre las tarifa de proveedores mediante la creación, edición o eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<SupplierRateTypes>
                fetchItems={GetSupplierRate}
                searchItem={GetSearchSupplierRate}
                createItem={CreateSupplierRate}
                updateItem={UpdateSupplierRate}
                deleteItem={DeleteSupplierRate}
                generalItems={{ subtract: updatePricesFunction}}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                subtractButtonOrder={11}
                sortFieldMap={SupplierRateSortFieldMap}
                hiddenSubtractButton={true}
                pageTitle="tarifa de proveedores"
                renderCustomFormField={renderCustomFormField}
                renderCustomActionModal={renderCustomActionModal}
                customSubtractActionButton={{
                  label: 'Tarifas Generales',
                  color: 'warning',
                  icon: <PriceIcon />,
                  order: 6,
                  ariaLabel: 'Actualizar Tarifas Masivamente',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRateCRUD;