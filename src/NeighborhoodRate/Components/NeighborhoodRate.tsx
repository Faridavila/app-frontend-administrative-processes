import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { NeighborhoodRateTypes } from "../Types/NeighborhoodRateTypes";
import { NeighborhoodRateSortFieldMap } from "../Types/MapeoNeighborhoodRate";
import {
  GetNeighborhoodRate,
  CreateNeighborhoodRate,
  UpdateNeighborhoodRate,
  DeleteNeighborhoodRate,
  GetSearchNeighborhoodRate,
  GeneralSupplierRate,
} from "../API/NeighborhoodRateAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import CitySelect from "./SelectCity";
import DepartmentSelect from "../../Branch/Components/BranchSelectDepartment";
import { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { PriceIcon } from "../Icons/Icons";

const NeighborhoodRateCRUD = () => {
  const [allNeighborhoodRates, setAllNeighborhoodRates] = useState<
    NeighborhoodRateTypes[]
  >([]);
  const [currentItem, setCurrentItem] = useState<NeighborhoodRateTypes | null>(null);
  const currentItemRef = useRef<NeighborhoodRateTypes | null>(null);

  useEffect(() => {
    currentItemRef.current = currentItem;
  }, [currentItem]);

  useEffect(() => {
    const loadAllRates = async () => {
      try {
        const rates = await GetNeighborhoodRate(0, 100000, {});
        setAllNeighborhoodRates(rates);
      } catch (error) {
        console.error("Error loading rates:", error);
      }
    };
    loadAllRates();
  }, []);

  const itemTemplate = (): NeighborhoodRateTypes => ({
    id: 0,
    departmentId: 0,
    departmentName: "",
    cityId: 0,
    cityName: "",
    neighborhood: "",
    rate: 0,
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
      hiddenInEdit: true,
    },
    {
      key: "cityId",
      label: "Ciudad",
      hidden: true,
      type: "number",
    },
    {
      key: "cityName",
      label: "Ciudad",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "neighborhood",
      label: "Barrio",
    },
    {
      key: "rate",
      label: "Tarifa",
      required: true,
      type: "number",
    },
  ];

  const renderCustomFormField = (
    colKey: keyof NeighborhoodRateTypes,
    value: any,
    onChange: (update: Partial<NeighborhoodRateTypes>) => void
  ) => {
    if (colKey === "departmentId") {
      return (
        <DepartmentSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) => {
            onChange({ departmentId: newDepartmentId });
          }}
        />
      );
    }
    if (colKey === "cityId") {
      return (
        <CitySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCityId: number) => {
            onChange({ cityId: newCityId });
          }}
        />
      );
    }
    return null;
  };

  const updatePricesFunction = async (
    item: NeighborhoodRateTypes,
  ) => {
    const rateValue = item.rate;
    const operationTypeId = item.cityId; 
    const selectedDepartmentId = item.departmentId;
    const selectedCityId = item.id;

    if (selectedDepartmentId <= 0) {
      throw new Error("Debe seleccionar un departamento");
    }

    if (selectedCityId <= 0) {
      throw new Error("Debe seleccionar un municipio");
    }

    if (operationTypeId <= 0 || operationTypeId > 2) {
      throw new Error("Debe seleccionar un tipo de operación válido");
    }

    if (rateValue <= 0) {
      throw new Error("El valor debe ser mayor a 0");
    }

    const typeOperation = operationTypeId === 2 ? "SUBTRACT" : "ADD";

    await GeneralSupplierRate({
      cityId: selectedCityId,
      departmentId: selectedDepartmentId,
      rate: rateValue,
      typeOperation: typeOperation,
    });
  };

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    modalCurrentItem: NeighborhoodRateTypes | null,
    onFieldUpdate: (update: Partial<NeighborhoodRateTypes>) => void
  ) => {
    if (generalActionKey !== "subtract") return null;

    if (modalCurrentItem !== currentItem) {
      setCurrentItem(modalCurrentItem);
    }

    const rateValue = modalCurrentItem?.rate || 0;
    const operationTypeId = modalCurrentItem?.cityId || 0; 
    const selectedDepartmentId = modalCurrentItem?.departmentId || 0;
    const selectedCityId = modalCurrentItem?.id || 0; 

    const operationType = operationTypeId === 2 ? "decrease" : "increase";

    const previewRates = allNeighborhoodRates.filter(
      (rate) =>
        rate.departmentId === selectedDepartmentId &&
        rate.cityId === selectedCityId
    );

    const previewChanges = previewRates.map((rate) => {
      const currentPrice = rate.rate;
      const changeAmount = rateValue;
      const newPrice =
        operationType === "increase"
          ? currentPrice + changeAmount
          : Math.max(0, currentPrice - changeAmount);

      return {
        id: rate.id,
        neighborhood: rate.neighborhood,
        currentPrice,
        changeAmount,
        newPrice,
      };
    });

    return (
      <Form>
        <Alert variant="info" className="mb-4">
          <strong>📋 Actualización General de Tarifas</strong>
        </Alert>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                Departamento <span className="text-danger">*</span>
              </Form.Label>
              <DepartmentSelect
                selectedValue={selectedDepartmentId}
                onChange={(newId: number) => {
                  onFieldUpdate({
                    departmentId: newId,
                    id: 0, 
                  });
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                Municipio <span className="text-danger">*</span>
              </Form.Label>
              <CitySelect
                selectedValue={selectedCityId}
                onChange={(newId: number) => {
                  onFieldUpdate({ id: newId }); 
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                Tipo de operación <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={operationTypeId}
                onChange={(e) =>
                  onFieldUpdate({
                    cityId: parseInt(e.target.value) || 0,
                  })
                }
                required
              >
                <option value={0}>Seleccione una opción</option>
                <option value={1}>Incremento (+)</option>
                <option value={2}>Disminución (-)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group >
              <Form.Label>
                Valor <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.01}
                value={rateValue}
                onChange={(e) =>
                  onFieldUpdate({ rate: parseFloat(e.target.value) || 0 })
                }
                placeholder="Ej: 5000"
                required
              />
              {operationTypeId > 0 && (
                <Form.Text className="text-muted">
                  Valor a {operationType === "increase" ? "sumar" : "restar"}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        {rateValue > 0 &&
          operationTypeId > 0 &&
          selectedCityId > 0 &&
          previewChanges.length > 0 && (
            <>
              <Alert variant="success" className="mb-1">
                <strong>⚠️ Vista Previa</strong> - Se{" "}
                {operationType === "increase"
                  ? "sumarán"
                  : "restarán"}{" "}
                <strong>${rateValue.toLocaleString("es-ES")}</strong> a las tarifas
              </Alert>


            </>
          )}

        {selectedDepartmentId > 0 &&
          selectedCityId > 0 &&
          operationTypeId > 0 &&
          rateValue > 0 &&
          previewChanges.length === 0 && (
            <Alert variant="warning" className="mb-0">
              <strong>⚠️ Advertencia:</strong> No se encontraron tarifas para
              actualizar con los filtros seleccionados
            </Alert>
          )}
      </Form>
    );
  };

  const renderCustomActionValidation = (generalActionKey: string) => {
    if (generalActionKey !== "subtract") return false;
    if (!currentItem) return false;

    const selectedDepartmentId = currentItem.departmentId || 0;
    const selectedCityId = currentItem.id || 0;
    const operationTypeId = currentItem.cityId || 0;
    const rateValue = currentItem.rate || 0;

    if (selectedDepartmentId <= 0) return false;
    if (selectedCityId <= 0) return false;
    if (operationTypeId <= 0) return false;
    if (rateValue <= 0) return false;

    const hasRates = allNeighborhoodRates.some(
      (rate) =>
        rate.departmentId === selectedDepartmentId &&
        rate.cityId === selectedCityId
    );

    return hasRates;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
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
            Administre las tarifa por barrio mediante la creación, edición o
            eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<NeighborhoodRateTypes>
                fetchItems={GetNeighborhoodRate}
                searchItem={GetSearchNeighborhoodRate}
                createItem={CreateNeighborhoodRate}
                updateItem={UpdateNeighborhoodRate}
                deleteItem={DeleteNeighborhoodRate}
                generalItems={{ subtract: updatePricesFunction }}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                subtractButtonOrder={11}
                sortFieldMap={NeighborhoodRateSortFieldMap}
                hiddenSubtractButton={true}
                pageTitle="tarifa por barrio"
                renderCustomFormField={renderCustomFormField}
                renderCustomActionModal={renderCustomActionModal}
                renderCustomActionValidation={renderCustomActionValidation}
                customSubtractActionButton={{
                  label: "Tarifa General",
                  color: "warning",
                  icon: <PriceIcon />,
                  order: 6,
                  ariaLabel: "Actualizar Tarifas Masivamente",
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