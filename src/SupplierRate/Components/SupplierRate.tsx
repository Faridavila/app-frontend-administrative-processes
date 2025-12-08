import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { SupplierRateTypes } from "../Types/SupplierRateTypes";
import { SupplierRateSortFieldMap } from "../Types/MapeoSupplierRate";
import {
  GetSupplierRate,
  CreateSupplierRate,
  UpdateSupplierRate,
  DeleteSupplierRate,
  GetSearchSupplierRate,
  GeneralSupplierRate,
} from "../API/SupplierRateAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import SuppliersSelect from "../../ShoppingSuppliers/Components/SelectSupplier";
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { PriceIcon } from "../Icons/Icons";

const SupplierRateCRUD = () => {

  const itemTemplate = (): SupplierRateTypes => ({
    id: 0,
    supplierId: 0,
    supplierName: "",
    priceRate: 0,
    status: "",
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
    },
    {
      key: "supplierName",
      label: "Bodega",
      required: true,
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
    onChange: (update: Partial<SupplierRateTypes>) => void
  ) => {
    if (colKey === "supplierId") {
      return (
        <SuppliersSelect
          selectedValue={typeof value === 'number' ? value : parseInt(value, 10) || 0}
          onChange={(newSupplierId: number) => {
            onChange({ supplierId: newSupplierId });
          }}
        />
      );
    }

    return null;
  };

  const updatePricesFunction = async (
    item: SupplierRateTypes,
  ) => {
    const rateValue = item.priceRate;
    const operationType = item.supplierId; 

    if (rateValue <= 0) {
      throw new Error('El valor debe ser mayor a 0');
    }

    if (!operationType || operationType <= 0) {
      throw new Error('Debe seleccionar un tipo de operación');
    }

    const payload = operationType === 1 
      ? { addRate: rateValue, subtractRate: null }
      : { addRate: null, subtractRate: rateValue };

    console.log('📤 Enviando payload:', payload);

    await GeneralSupplierRate(payload);
  };

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: SupplierRateTypes | null,
    onFieldUpdate: (update: Partial<SupplierRateTypes>) => void
  ) => {
    if (generalActionKey !== 'subtract') return null; 

    const rateValue = currentItem?.priceRate || 0;
    const operationType = currentItem?.supplierId || 0;

    return (
      <Form>
        <Alert variant="info" className="mb-3">
          <strong>Actualización General de Tarifas</strong>
          <p className="mb-0 mt-2 small">
            {operationType === 1 && rateValue > 0 && (
              <span className="text-success">
                ✓ Se incrementarán todas las tarifas en: <strong>{rateValue}</strong>
              </span>
            )}
            {operationType === 2 && rateValue > 0 && (
              <span className="text-danger">
                ✓ Se reducirán todas las tarifas en: <strong>{rateValue}</strong>
              </span>
            )}
            {(!operationType || operationType <= 0 || rateValue <= 0) && (
              <span className="text-muted">
                Complete todos los campos
              </span>
            )}
          </p>
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
                <option value={2}>Decremento</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Valor <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.01}
                value={currentItem?.priceRate || 0}
                onChange={(e) => onFieldUpdate({ priceRate: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 3000"
                required
              />
              <Form.Text className="text-muted">
                Ingrese el valor que se {operationType === 1 ? 'sumará' : operationType === 2 ? 'restará' : 'aplicará'} a todas las tarifas
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
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
              Gestión de tarifa de bodegas
            </h3>
            <FavoritoButton path="/SupplierRate" label="SupplierRate" />
          </div>
          <p>
            Administre las tarifa de bodegas mediante la creación, edición o eliminación de registros.
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

export default SupplierRateCRUD;