import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { NeighborhoodRateTypes } from "../Types/NeighborhoodRateTypes";
import { NeighborhoodRateSortFieldMap } from "../Types/MapeoNeighborhoodRate";
import {
  GetNeighborhoodRate,
  CreateNeighborhoodRate,
  UpdateNeighborhoodRate,
  DeleteNeighborhoodRate,
  GetSearchNeighborhoodRate,
} from "../API/NeighborhoodRateAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import CitySelect from "./SelectCity";
import DepartmentSelect from "../../Branch/Components/BranchSelectDepartment";
import { useState, useEffect } from 'react';
import { Row, Col, Form, Alert, Table } from 'react-bootstrap';
import { PriceIcon } from "../Icons/Icons";

const NeighborhoodRateCRUD = () => {
  const [allNeighborhoodRates, setAllNeighborhoodRates] = useState<NeighborhoodRateTypes[]>([]);

  useEffect(() => {
    const loadAllRates = async () => {
      try {
        const rates = await GetNeighborhoodRate(0, 100000, {});
        setAllNeighborhoodRates(rates);
      } catch (error) {
        console.error('Error loading rates:', error);
      }
    };
    loadAllRates();
  }, []);

  const itemTemplate = (): NeighborhoodRateTypes => ({
    id: 0,
    departmentId: 0,
    departmentName: "",
    municipalityId: 0,
    municipality: "",
    neighborhoodId: 0,
    neighborhoodName: "",
    priceRate: 0,
    status: "",
  });

  const columns: {
    key: keyof NeighborhoodRateTypes;
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
      key: "departmentId",
      label: "Departamento",
      hidden: true,
      type: "number",  
    },
    {
      key: "departmentName",
      label: "Departamento",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true
    },
    {
      key: "municipalityId",
      label: "Municipio",
      hidden: true,
      type: "number",  
    },
    {
      key: "municipality",
      label: "Municipio",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true
    },
    {
      key: "neighborhoodName",
      label: "Barrio",
    },
    {
      key: "priceRate",
      label: "Tarifa",
      required: true,
      type: "number",  
    },
  ];

  const renderCustomFormField = (
    colKey: keyof NeighborhoodRateTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "departmentId") {
      return (
        <DepartmentSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newSupplierId: number) => {
            onChange(newSupplierId.toString());
          }}
        />
      );
    }
      if (colKey === "municipalityId") {
      return (
        <CitySelect
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
    item: NeighborhoodRateTypes,
    imageFile: File | null,
    extraParams?: Record<string, any>
  ) => {
    const percentageChange = item.priceRate;
    const operationTypeId = item.municipalityId; // 1 for increase, 2 for decrease
    const selectedDepartmentId = item.departmentId;

    if (percentageChange <= 0) {
      throw new Error('El porcentaje debe ser mayor a 0');
    }

    if (operationTypeId <= 0 || operationTypeId > 2) {
      throw new Error('Debe seleccionar un tipo de operación válido');
    }

    if (selectedDepartmentId <= 0) {
      throw new Error('Debe seleccionar un departamento');
    }

    // Filter rates by selected department and municipality if specified
    let filteredRates = allNeighborhoodRates.filter(rate => rate.departmentId === selectedDepartmentId);
    if (item.departmentId > 0 && item.neighborhoodId > 0) { // Assuming neighborhoodId used for mun filter, adjust if needed
      filteredRates = filteredRates.filter(rate => rate.neighborhoodId === item.neighborhoodId);
    }

    if (filteredRates.length === 0) {
      throw new Error('No hay tarifas para actualizar con los filtros seleccionados');
    }

    const operationType = operationTypeId === 2 ? 'decrease' : 'increase';

    for (const rate of filteredRates) {
      const currentPrice = rate.priceRate;
      const changeAmount = (currentPrice * percentageChange) / 100;
      const newPrice = operationType === 'increase' 
        ? currentPrice + changeAmount 
        : currentPrice - changeAmount;

      const updatedRate: NeighborhoodRateTypes = {
        ...rate,
        priceRate: Math.max(0, newPrice),
      };

      await UpdateNeighborhoodRate(rate.id, updatedRate, extraParams);
    }
  };

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: NeighborhoodRateTypes | null,
    onFieldUpdate: (update: Partial<NeighborhoodRateTypes>) => void
  ) => {
    if (generalActionKey !== 'subtract') return null; 

    const percentageChange = currentItem?.priceRate || 0;
    const operationTypeId = currentItem?.municipalityId || 0; // 1 increase, 2 decrease
    const selectedDepartmentId = currentItem?.departmentId || 0;
    const operationType = operationTypeId === 2 ? 'decrease' : 'increase';

    // Filter preview rates by selected department
    let previewRates = allNeighborhoodRates.filter(rate => rate.departmentId === selectedDepartmentId);
    // If municipality selected, filter further (assuming neighborhoodId as proxy for mun, adjust prop if needed)
    if (currentItem?.neighborhoodId > 0) {
      previewRates = previewRates.filter(rate => rate.neighborhoodId === currentItem.neighborhoodId);
    }

    const previewChanges = previewRates.map(rate => {
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
        <Alert variant="info" className="mb-4">
          <strong> Actualización General de Tarifas</strong>
        </Alert>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>Departamento <span className="text-danger">*</span></Form.Label>
              <DepartmentSelect
                selectedValue={selectedDepartmentId}
                onChange={(newId: number) => {
                  onFieldUpdate({ departmentId: newId, municipalityId: 0, neighborhoodId: 0 });
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>Municipio</Form.Label>
              <CitySelect
                selectedValue={currentItem?.neighborhoodId || 0} // Using neighborhoodId as proxy for mun select
                departmentId={selectedDepartmentId}
                onChange={(newId: number) => {
                  onFieldUpdate({ neighborhoodId: newId });
                }}
                disabled={selectedDepartmentId <= 0}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>Tipo de operación <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={operationTypeId}
                onChange={(e) => onFieldUpdate({ municipalityId: parseInt(e.target.value) || 0 })}
                required
              >
                <option value={0}>Seleccione una opción</option>
                <option value={1}>Incremento</option>
                <option value={2}>Disminución</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>Valor <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={percentageChange}
                onChange={(e) => onFieldUpdate({ priceRate: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 10 para 10%"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {percentageChange > 0 && operationTypeId > 0 && previewRates.length > 0 && (
          <>
            <Alert variant="warning" className="mb-4">
              <strong>⚠️ Vista Previa</strong> - Se {operationType === 'increase' ? 'incrementarán' : 'disminuirán'} las tarifas en <strong>{percentageChange}%</strong>
            </Alert>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
              <Table bordered hover size="sm" className="mb-0">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Barrio</th>
                    <th className="text-end">Tarifa Actual</th>
                    <th className="text-center">Cambio</th>
                    <th className="text-end">Nueva Tarifa</th>
                  </tr>
                </thead>
                <tbody>
                  {previewChanges.map((item) => (
                    <tr key={item.id}>
                      <td>{item.neighborhoodName}</td>
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

            <Alert variant="success" className="mt-4 mb-0">
              <strong>📊 Resumen:</strong> Se actualizarán <strong>{previewRates.length}</strong> tarifa(s)
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
              Gestión de tarifa por barrio
            </h3>
            <FavoritoButton path="/NeighborhoodRate" label="NeighborhoodRate" />
          </div>
          <p>
            Administre las tarifa por barrio mediante la creación, edición o eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<NeighborhoodRateTypes>
                fetchItems={GetNeighborhoodRate}
                searchItem={GetSearchNeighborhoodRate}
                createItem={CreateNeighborhoodRate}
                updateItem={UpdateNeighborhoodRate}
                deleteItem={DeleteNeighborhoodRate}
                generalItems={{ subtract: updatePricesFunction}}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                subtractButtonOrder={11}
                sortFieldMap={NeighborhoodRateSortFieldMap}
                hiddenSubtractButton={true}
                pageTitle="tarifa de proveedores"
                renderCustomFormField={renderCustomFormField}
                renderCustomActionModal={renderCustomActionModal}
                customSubtractActionButton={{
                  label: 'Tarifa General',
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

export default NeighborhoodRateCRUD;