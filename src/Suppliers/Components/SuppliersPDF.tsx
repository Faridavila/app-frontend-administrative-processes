
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState, useEffect } from 'react';
import { SupplierTypes } from "../Types/SuppliersTypes";
import { SuppliersSortFieldMap } from "../Types/MapeoSuppliers";
import {
  GetSuppliers,
  CreateSuppliers,
  UpdateSuppliers,
  DeleteSuppliers,
  GetSearchSuppliers,
} from "../API/SuppliersAPI";
import {
  CreateSupplierProducts,
  UpdateSupplierProducts,
  DeleteSupplierProducts,
  GetSupplierProducts
} from "../../SupplierProduct/API/SupplierProductAPI";
import SupplierProductsCRUD from "../../SupplierProduct/Components/SupplierProduct"
import WarehouseSelect from "./SelectWarehouse";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import ProductSelect from "../../Inventory/Components/SelectProduct";
import { SupplierProductTypes } from "../../SupplierProduct/Types/SupplierProductTypes";
import { AddIcon, DeleteIcon, PDFIcon } from '../Icons/Icons';
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap';
import { generateTicketPDF, PDFTicketConfig } from '../../Hooks/usePDFGeneradorTicket';
import { GetCompanyById } from "../../Company/API/CompanyAPI";
import { CompanyType } from "../../Company/Types/Company";

interface ProductLine {
  tempId: string;
  id?: number;
  productId: number;
  productName: string;
  purchasePrice: number;
}

interface RouteCRUDProps {
  onRowClick?: (item: SupplierTypes) => void;
}

const SuppliersCRUD: React.FC<RouteCRUDProps> = ({ onRowClick }) => {
  const [selectedRoute, setSelectedSupplier] = useState<SupplierTypes | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [supplierName, setSupplierName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [initialProductLines, setInitialProductLines] = useState<ProductLine[]>([]);
  const [showProductsConfig, setShowProductsConfig] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentOperation, setCurrentOperation] = useState<'add' | 'edit'>('add');
  const [currentSupplierId, setCurrentSupplierId] = useState<number>(0);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProductTypes[]>([]);
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);

  // Cargar datos de la empresa al montar el componente
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await GetCompanyById(1);
        if (data) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error('Error al cargar datos de la empresa:', error);
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    ['name', 'email', 'phone'].forEach(key => {
      const value = key === 'name' ? supplierName : key === 'email' ? email : phone;
      const error = validateField(key as keyof SupplierTypes, value);
      if (error) newErrors[key] = error;
    });
    if (warehouseId === 0) newErrors['warehouseId'] = 'Bodega es obligatoria.';
    setErrors(newErrors);
  }, [supplierName, email, phone, warehouseId, productLines, showProductsConfig]);

  useEffect(() => {
    if (selectedSupplierId) {
      loadSupplierProducts(selectedSupplierId);
    } else {
      setSupplierProducts([]);
    }
  }, [selectedSupplierId]);

  const loadSupplierProducts = async (supplierId: number) => {
    try {
      const products = await GetSupplierProducts(0, 100000, {}, undefined, undefined, { supplierId });
      setSupplierProducts(products);
    } catch (error) {
      console.error('Error al cargar productos del proveedor:', error);
      setSupplierProducts([]);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedRoute) {
      alert('Por favor, seleccione un proveedor primero');
      return;
    }

    if (supplierProducts.length === 0) {
      alert('El proveedor seleccionado no tiene productos asociados');
      return;
    }

    if (!companyData) {
      alert('No se pudieron cargar los datos de la empresa');
      return;
    }

    const total = supplierProducts.reduce((sum, product) => {
      return sum + parseFloat(product.purchasePrice || '0');
    }, 0);

    const numeroPago = `${selectedRoute.id}-${Date.now().toString().slice(-6)}`;

    const ticketConfig: PDFTicketConfig = {
      companyInfo: {
        logo: 'https://res.cloudinary.com/dfotyo6jc/image/upload/v1761872392/Captura_de_pantalla_2025-10-30_195850_kwda8d.png',
        logoWidth: 40,  
        logoHeight: 35, 
        nit: companyData.nit,
        direccion: companyData.address,
        celular: companyData.phone,
        email: companyData.email,
      },
      mainInfo: {
        fecha: new Date().toLocaleString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        numeroPago: numeroPago,
        proveedor: selectedRoute.name,
      },
      products: supplierProducts.map(product => ({
        producto: product.productName,
        // cantidad: 1, // Opcional: 
        valor: parseFloat(product.purchasePrice),
      })),
      total: total,
      footer: {
        showGeneratedBy: true,
        generatedByText: `Hecho en Colombia por ${companyData.companyName}`,
        showPageNumber: true,
      },
      fileName: `Ticket_Proveedor_${selectedRoute.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      ticketType: 'compra',
    };

    generateTicketPDF(ticketConfig);
  };

  const itemTemplate = (): SupplierTypes => ({
    id: 0,
    name: "",
    email: "",
    phone: 0,
    warehouseId: 0,
    warehouseName: "",
    warehouse: "",
    status: "",
  });

  const handleRowSelection = (supplier: SupplierTypes) => {
    setSelectedSupplier(supplier);
    setSelectedSupplierId(supplier.id);
    if (onRowClick) {
      onRowClick(supplier);
    }
  };

  const onAddModalOpen = () => {
    setCurrentOperation('add');
    setSupplierName('');
    setEmail('');
    setPhone(0);
    setWarehouseId(0);
    setProductLines([]);
    setInitialProductLines([]);
    setShowProductsConfig(false);
    setErrors({});
    setCurrentSupplierId(0);
  };

  const onEditModalOpen = (item: SupplierTypes) => {
    setCurrentOperation('edit');
    setSupplierName(item.name);
    setEmail(item.email);
    setPhone(item.phone);
    setWarehouseId(item.warehouseId);
    setShowProductsConfig(true);
    setErrors({});
    setCurrentSupplierId(item.id);
    GetSupplierProducts(0, 100000, {}, undefined, undefined, { supplierId: item.id }).then((products: SupplierProductTypes[]) => {
      const lines: ProductLine[] = products.map(p => ({
        tempId: Date.now().toString() + Math.random().toString(),
        id: p.id,
        productId: p.productId,
        productName: p.productName,
        purchasePrice: parseFloat(p.purchasePrice),
      }));
      setProductLines(lines);
      setInitialProductLines(JSON.parse(JSON.stringify(lines)));
    }).catch(error => {
      console.error('Error loading products:', error);
    });
  };

  const handleAddLine = () => {
    const newLine: ProductLine = {
      tempId: Date.now().toString(),
      productId: 0,
      productName: "",
      purchasePrice: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const handleRemoveLine = (tempId: string) => {
    setProductLines(productLines.filter(line => line.tempId !== tempId));
  };

  const handleLineChange = (tempId: string, field: 'purchasePrice', value: number) => {
    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId ? { ...line, [field]: value } : line
      )
    );
  };

  const handleProductChange = (tempId: string, productId: number) => {
    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId ? { ...line, productId } : line
      )
    );
  };

  const validateField = (key: keyof SupplierTypes, value: any): string | null => {
    const column = columns.find(col => col.key === key);
    if (!column) return null;
    if (column.required) {
      if (value == null || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && (isNaN(value) || value <= 0))) {
        return `${column.label} es obligatorio.`;
      }
    }
    const valueStr = String(value ?? '');
    if (column.minLength && valueStr.length < column.minLength) {
      return `${column.label} debe tener al menos ${column.minLength} caracteres.`;
    }
    if (column.maxLength && valueStr.length > column.maxLength) {
      return `${column.label} no puede exceder los ${column.maxLength} caracteres.`;
    }
    if (column.regex && !column.regex.test(valueStr)) {
      return `${column.label} tiene un formato inválido.`;
    }
    return null;
  };

  const handleSupplierChange = (key: keyof SupplierTypes, value: any) => {
    switch (key) {
      case 'name':
        setSupplierName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'warehouseId':
        setWarehouseId(value);
        break;
    }
    const error = validateField(key, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (!error) {
        delete newErrors[key];
      } else {
        newErrors[key] = error;
      }
      return newErrors;
    });
  };

  const renderCustomAddModal = (onSave: () => Promise<void>, onCancel: () => void) => {
    const fieldOrder = ['name', 'email', 'phone', 'warehouseId'] as const;
    type FieldKey = typeof fieldOrder[number];
    const getFieldError = (key: FieldKey) => errors[key as string] || null;
    const firstInvalidKey = fieldOrder.find(key => !!getFieldError(key)) || null;

    return (
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={supplierName}
                onChange={(e) => handleSupplierChange('name', e.target.value)}
                isInvalid={'name' === firstInvalidKey}
              />
              {'name' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('name')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => handleSupplierChange('email', e.target.value)}
                isInvalid={'email' === firstInvalidKey}
              />
              {'email' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('email')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                value={phone || ''}
                onChange={(e) => handleSupplierChange('phone', Number(e.target.value))}
                isInvalid={'phone' === firstInvalidKey}
              />
              {'phone' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('phone')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Bodega</Form.Label>
              <WarehouseSelect
                selectedValue={warehouseId}
                onChange={(newId: number) => handleSupplierChange('warehouseId', newId)}
              />
              {'warehouseId' === firstInvalidKey && errors.warehouseId && (
                <div className="text-danger">{errors.warehouseId}</div>
              )}
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Desea configurar el precio de compra por producto?"
                checked={showProductsConfig}
                onChange={(e) => {
                  setShowProductsConfig(e.target.checked);
                  if (e.target.checked && productLines.length === 0) {
                    handleAddLine();
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        {showProductsConfig && (
          <Row className="flex-grow-1">
            <Col xs={12} className="p-0">
              <div className="mb-3 flex-grow-1" style={{
                borderRadius: '0.375rem',
                boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                maxWidth: '100%',
                width: '100%',
                overflow: 'visible'
              }}>
                <div>
                  <Table bordered hover className="mb-0" style={{ tableLayout: 'auto', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50%', padding: '12px', textAlign: 'left' }}>PRODUCTO</th>
                        <th style={{ width: '30%', padding: '12px', textAlign: 'center' }}>PRECIO DE COMPRA</th>
                        <th style={{ width: '20%', padding: '12px', textAlign: 'center' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productLines.map((line) => (
                        <tr key={line.tempId}>
                          <td style={{ overflow: 'visible' }}>
                            <ProductSelect
                              selectedValue={line.productId}
                              onChange={(newId: number) => handleProductChange(line.tempId, newId)}
                            />
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <Form.Control
                              type="number"
                              placeholder="Precio de compra"
                              value={line.purchasePrice || ''}
                              onChange={(e) => handleLineChange(line.tempId, 'purchasePrice', parseFloat(e.target.value) || 0)}
                              min={0}
                              step={0.01}
                              className="form-control form-control-sm text-center"
                              style={{ borderRadius: '0.375rem', maxWidth: '120px', margin: '0 auto', border: '1px solid #ced4da' }}
                            />
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <Button
                              className='btn btn-danger p-0'
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto'
                              }}
                              aria-label="Eliminar Elemento Seleccionado"
                              onClick={() => handleRemoveLine(line.tempId)}
                            >
                              <DeleteIcon />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {productLines.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            No hay productos agregados. Haz clic en "Añadir Producto".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              {showProductsConfig && (productLines.length === 0 || !productLines.every(line => line.productId > 0 && line.purchasePrice > 0)) && (
                <Alert variant="danger" className="mt-2 mb-2">
                  Ingrese todos los campos requeridos, en los productos agregados.
                </Alert>
              )}

              <Button
                variant="outline-secondary"
                onClick={handleAddLine}
                className="btn-sm px-1"
              >
                <span className="me-1">
                  <AddIcon />
                </span>
                Añadir Producto
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    );
  };

  const customSave = async (onSuccess: () => void, onError: (error: any) => void) => {
    const validationErrors = {};
    ['name', 'email', 'phone'].forEach(key => {
      const value = key === 'name' ? supplierName : key === 'email' ? email : phone;
      const error = validateField(key as keyof SupplierTypes, value);
      if (error) validationErrors[key] = error;
    });
    if (warehouseId === 0) validationErrors['warehouseId'] = 'Bodega es obligatoria.';
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      onError(new Error('Corrija los errores en los campos del proveedor'));
      return;
    }

    if (showProductsConfig) {
      if (productLines.length === 0 || !productLines.every(line => line.productId > 0 && line.purchasePrice > 0)) {
        onError(new Error('Ingrese todos los campos requeridos en las líneas de productos'));
        return;
      }
    }

    const supplier: SupplierTypes = {
      ...itemTemplate(),
      id: currentOperation === 'edit' ? currentSupplierId : 0,
      name: supplierName,
      email,
      phone,
      warehouseId,
    };
    try {
      let supplierId: number;
      if (currentOperation === 'add') {
        const created = await CreateSuppliers(supplier, null);
        supplierId = created.id;
      } else {
        await UpdateSuppliers(currentSupplierId, supplier, null);
        supplierId = currentSupplierId;
      }
      if (showProductsConfig) {
        const deleted = initialProductLines.filter(init => !productLines.some(line => line.id === init.id));
        for (const del of deleted) {
          if (del.id) await DeleteSupplierProducts(del.id);
        }
        for (const line of productLines) {
          const item: SupplierProductTypes = {
            id: line.id || 0,
            productId: line.productId,
            productName: line.productName,
            purchasePrice: line.purchasePrice.toString(),
            status: "",
          };
          if (line.id) {
            await UpdateSupplierProducts(line.id, item, null);
          } else {
            await CreateSupplierProducts(item, null, { supplierId });
          }
        }
      }
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const renderCustomValidation = () => {
    const hasSupplierErrors = Object.keys(errors).length > 0 || warehouseId === 0;
    if (hasSupplierErrors) {
      return false;
    }
    if (!showProductsConfig) {
      return true;
    }
    const allLinesComplete = productLines.length > 0 && productLines.every(line => line.productId > 0 && line.purchasePrice > 0);
    return allLinesComplete;
  };

  const columns: {
    key: keyof SupplierTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "name",
        label: "Nombre",
        required: true,
        minLength: 2,
        maxLength: 100,
        regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/,
      },
      {
        key: "email",
        label: "Correo",
      },
      {
        key: "phone",
        label: "Celular",
        required: true,
        minLength: 10,
        maxLength: 10,
        regex: /^\d+$/,
      },
      { key: "warehouseId", label: "Bodega", hidden: true, required: true },
      { key: "warehouseName", label: "Bodega", required: true, hiddenInCreate: true, hiddenInEdit: true },
    ];

  const renderCustomFormField = (
    colKey: keyof SupplierTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "warehouseId") {
      return (
        <WarehouseSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newWarehouseId: number) => onChange(newWarehouseId.toString())}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de proveedores
          </h3>
          <FavoritoButton path="/SupplierPendingProduct" label="SupplierPendingProductos" />
        </div>
        <p>
          Administre los proveedores mediante la creación, edición o eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '246px',
              zIndex: 10
            }}>
              <Button
                variant="danger"
                onClick={handleDownloadPDF}
                disabled={!selectedRoute || supplierProducts.length === 0}
                style={{
                  width: '33px',
                  height: '33px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: !selectedRoute || supplierProducts.length === 0 ? '#6c757d' : '#dc3545',
                  color: 'white'
                }}
                title="Descargar ticket PDF del proveedor seleccionado"
              >
                <PDFIcon />
              </Button>
            </div>

            <CRUDForm<SupplierTypes>
              fetchItems={GetSuppliers}
              searchItem={GetSearchSuppliers}
              createItem={CreateSuppliers}
              updateItem={UpdateSuppliers}
              deleteItem={DeleteSuppliers}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={SuppliersSortFieldMap}
              pageTitle="Proveedores"
              renderCustomFormField={renderCustomFormField}
              renderCustomAddModal={renderCustomAddModal}
              renderCustomValidation={renderCustomValidation}
              customSave={customSave}
              onAddModalOpen={onAddModalOpen}
              onEditModalOpen={onEditModalOpen}
              onRowClick={handleRowSelection}
              rowClassName={(item: SupplierTypes) => selectedSupplierId === item.id ? 'selected-row' : ''}
            />
          </div>
        </div>
      </div>
      <style>{`
        .selected-row { 
          background-color: #cc322d !important; 
          color: white; 
        }
      `}</style>

      <div className="card mt-1">
        <SupplierProductsCRUD
          extraParams={{ supplierId: selectedSupplierId ?? 0 }}
          setSelectedSupplierId={setSelectedSupplierId}
        />
      </div>
    </div>
  );
};

export default SuppliersCRUD;



