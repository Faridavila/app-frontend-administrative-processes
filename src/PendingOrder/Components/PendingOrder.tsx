import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Table, Alert, Button } from 'react-bootstrap';
import { PendingOrderTypes } from "../Types/PendingOrderTypes";
import ClientsSelect from "./SelectClient";
import SelectProduct from "./SelectProduct"; 
import { AddIcon, DeleteIcon } from '../Icons/Icons';

// Importamos los tipos y APIs necesarias
import { GetAllProductNoPage } from '../../Product/API/ProductAPI';
import { GetAllClientNoPage } from '../../Client/API/ClientAPI';
import { ProductTypes } from '../../Product/Types/ProductTypes';
import { ClientTypes } from '../../Client/Types/ClientTypes';
import ProductDetailSupplierCRUD from "../../ProductDetailSupplier/Components/ProductDetailSupplier";

interface PendingOrderProps {
  onRowClick?: (item: PendingOrderTypes) => void;
}

interface ProductLine {
  tempId: string;
  productId: number;
  productName: string;
  purchasePrice: number;
  quantity: number;
  total: number;
}

const PendingOrder: React.FC<PendingOrderProps> = ({ onRowClick }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<PendingOrderTypes | null>(null);
  const [selectedPendingOrderId, setSelectedPendingOrderId] = useState<number | null>(null);
  
  const [customerId, setCustomerId] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [observation, setObservation] = useState<string>('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    city: '',
    phone: ''
  });
  
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentOperation, setCurrentOperation] = useState<'add' | 'edit'>('add');

  // Caché para productos y clientes
  const [productsCache, setProductsCache] = useState<ProductTypes[]>([]);
  const [clientsCache, setClientsCache] = useState<ClientTypes[]>([]);

  // Cargar datos solo cuando se abre el modal
  const loadCache = async () => {
    const [products, clients] = await Promise.all([
      GetAllProductNoPage(),
      GetAllClientNoPage()
    ]);
    setProductsCache(products || []);
    setClientsCache(clients || []);
  };

  useEffect(() => {
    if (currentOperation === 'add' || currentOperation === 'edit') {
      loadCache();
    }
  }, [currentOperation]);

  // Validación en tiempo real (sin tocar nada)
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (!date) newErrors['date'] = 'Fecha es obligatoria.';
    if (customerId <= 0) newErrors['customerId'] = 'Debe seleccionar un cliente.';
    
    if (productLines.length > 0) {
      const hasInvalidProducts = productLines.some(p => 
        p.productId <= 0 || p.quantity <= 0 || p.purchasePrice <= 0
      );
      if (hasInvalidProducts) {
        newErrors['products'] = 'Ingrese todos los campos requeridos en los productos agregados.';
      }
    } else {
      newErrors['products'] = 'Debe agregar al menos un producto.';
    }
    
    setErrors(newErrors);
  }, [customerId, date, productLines]);

  const itemTemplate = (): PendingOrderTypes => ({
    id: 0,
    customerId: 0,
    customerName: "",
    customerAddress: "",
    customerCity: "",
    customerPhone: "",
    totalPurchase: 0,
    date: "",
    observation: "",
    statusOrder: "",
    status: "",
    products: [],
  });

  const columns = [
    { key: "id", label: "N° Pedido", hiddenInCreate: true, hiddenInEdit: true },
    { key: "customerId", label: "Cliente", hidden: true },
    { key: "customerName", label: "Cliente", hiddenInCreate: true, hiddenInEdit: true },
    { key: "customerCity", label: "Ciudad", hiddenInCreate: true, hiddenInEdit: true },
    { key: "customerAddress", label: "Dirección", hiddenInCreate: true, hiddenInEdit: true },
    { key: "customerPhone", label: "Celular", hiddenInCreate: true, hiddenInEdit: true },
    { key: "date", label: "Fecha", hiddenInCreate: true, hiddenInEdit: true },
   
    {
      key: "statusOrder",
      label: "Estado",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item: PendingOrderTypes) => {
        const statusColor = getStatusColor(item.status);
        return (
          <span
            style={{
              backgroundColor: statusColor,
              padding: '5px 10px',
              borderRadius: '5px',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            {item.status}
          </span>
        );
      }
    },
     { key: "observation", label: "Observacion", hiddenInCreate: true, hiddenInEdit: true },
     { key: "totalPurchase", label: "Total", hiddenInCreate: true, hiddenInEdit: true },
  ];

  const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onAddModalOpen = () => {
    setCurrentOperation('add');
    setCustomerId(0);
    setDate(getLocalDate());
    setObservation('');
    setCustomerInfo({ name: '', address: '', city: '', phone: '' });
    setProductLines([{
      tempId: Date.now().toString(),
      productId: 0,
      productName: '',
      purchasePrice: 0,
      quantity: 0,
      total: 0,
    }]);
    setErrors({});
  };

  const onEditModalOpen = (item: PendingOrderTypes) => {
    setCurrentOperation('edit');
    setCustomerId(item.customerId);
    setDate(item.date.split('T')[0] || '');
    setObservation(item.observation);
    setCustomerInfo({
      name: item.customerName,
      address: item.customerAddress,
      city: item.customerCity,
      phone: item.customerPhone
    });
    
    const lines: ProductLine[] = item.products.map((p, index) => ({
      tempId: `${Date.now()}-${index}`,
      productId: p.productId,
      productName: '',
      purchasePrice: p.purchasePrice,
      quantity: p.quantity,
      total: p.total
    }));
    setProductLines(lines);
    setErrors({});
  };

  const handleRowSelection = (assignment: PendingOrderTypes) => {
    setSelectedAssignment(assignment);
    if (onRowClick) {
      onRowClick(assignment);
    }
  };

  const handleAddLine = () => {
    const newLine: ProductLine = {
      tempId: Date.now().toString(),
      productId: 0,
      productName: "",
      purchasePrice: 0,
      quantity: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const handleRemoveLine = (tempId: string) => {
    setProductLines(productLines.filter(line => line.tempId !== tempId));
  };

  const handleLineChange = (tempId: string, field: 'purchasePrice' | 'quantity', value: number) => {
    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId
          ? {
              ...line,
              [field]: value,
              total: field === 'purchasePrice' ? line.quantity * value : value * line.purchasePrice,
            }
          : line
      )
    );
  };


  const handleProductChange = (tempId: string, productId: number) => {
    const selectedProduct = productsCache.find(p => p.id === productId);

    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId
          ? {
              ...line,
              productId,
              productName: selectedProduct?.productName || '',
              purchasePrice: selectedProduct?.price || 0,
              total: (selectedProduct?.price || 0) * line.quantity
            }
          : line
      )
    );
  };

  const getStatusColor = (statusOrder: string) => {
    switch (statusOrder) {
      case "Pendiente": return "#ffc107";
      case "Inicio": return "#17a2b8";
      case "Cargado": return "#28a745";
      default: return "transparent";
    }
  };

  const renderCustomAddModal = (onSave: () => Promise<void>, onCancel: () => void) => {
    const getFieldError = (key: string) => errors[key] || null;
    const totalGeneral = productLines.reduce((sum, line) => sum + line.total, 0);

    return (
      <Form>
        <Row>
          {/* COLUMNA IZQUIERDA */}
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Cliente *</Form.Label>
              <ClientsSelect
                selectedValue={customerId}
                onChange={(newId: number) => {
                  setCustomerId(newId);
                  const client = clientsCache.find(c => c.id === newId);
                  if (client) {
                    setCustomerInfo({
                      name: client.name || '',
                      address: client.address || '',
                      city: client.city || '',
                      phone: client.phone || ''
                    });
                  } else {
                    setCustomerInfo({ name: '', address: '', city: '', phone: '' });
                  }
                }}
              />
              <div>
                {customerId <= 0 && getFieldError('customerId') && (
                  <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                    {getFieldError('customerId')}
                  </div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={customerInfo.name} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" value={customerInfo.address} readOnly />
            </Form.Group>
          </Col>

          {/* COLUMNA DERECHA */}
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                isInvalid={!!getFieldError('date')}
              />
              <div style={{ minHeight: '30px' }}>
                {getFieldError('date') && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {getFieldError('date')}
                  </Form.Control.Feedback>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control type="text" value={customerInfo.city} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Celular</Form.Label>
              <Form.Control type="text" value={customerInfo.phone} readOnly />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Observaciones del pedido..."
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <h6 className="mb-2">Productos del Pedido</h6>
            <div className="mb-3" style={{
              borderRadius: '0.375rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              overflow: 'visible'
            }}>
              <Table bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>PRODUCTO</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>PRECIO</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>CANTIDAD</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>TOTAL</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {productLines.map((line) => (
                    <tr key={line.tempId}>
                      <td style={{ overflow: 'visible' }}>
                        <SelectProduct
                          selectedValue={line.productId}
                          onChange={(newId: number) => handleProductChange(line.tempId, newId)}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Form.Control
                          type="number"
                          placeholder="Precio"
                          value={line.purchasePrice || ''}
                          onChange={(e) => handleLineChange(line.tempId, 'purchasePrice', parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.01}
                          style={{ maxWidth: '120px', margin: '0 auto' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Form.Control
                          type="number"
                          placeholder="Cantidad"
                          value={line.quantity || ''}
                          onChange={(e) => handleLineChange(line.tempId, 'quantity', parseFloat(e.target.value) || 0)}
                          min={1}
                          style={{ maxWidth: '120px', margin: '0 auto' }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                        ${line.total.toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveLine(line.tempId)}
                        >
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {productLines.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No hay productos agregados. Haz clic en "Añadir Producto".
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {getFieldError('products') && (
              <Alert variant="danger" className="mb-2">
                {getFieldError('products')}
              </Alert>
            )}

            <Button
              variant="outline-secondary"
              onClick={handleAddLine}
              className="btn-sm mb-3"
            >
              <AddIcon /> Añadir Producto
            </Button>

            <div className="text-end">
              <strong className="fs-2 fw-bold">
                Total: {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalGeneral)}
              </strong>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderCustomValidation = () => {
    return Object.keys(errors).length === 0;
  };

  const customSave = async (onSuccess: () => void, onError: (error: any) => void) => {
    if (Object.keys(errors).length > 0) {
      onError(new Error('Corrija los errores en el formulario'));
      return;
    }

    const totalPurchase = productLines.reduce((sum, line) => sum + line.total, 0);

    const pendingOrder: PendingOrderTypes = {
      ...itemTemplate(),
      id: currentOperation === 'edit' ? selectedAssignment?.id || 0 : 0,
      customerId,
      customerName: customerInfo.name,
      customerAddress: customerInfo.address,
      customerCity: customerInfo.city,
      customerPhone: customerInfo.phone,
      date,
      observation,
      totalPurchase,
      status: 'Pendiente',
      statusOrder: 'Pendiente',
      products: productLines.map(line => ({
        productId: line.productId,
        purchasePrice: line.purchasePrice,
        quantity: line.quantity,
        total: line.total
      }))
    };

    try {
      if (currentOperation === 'add') {
        console.log('Crear Pedido:', pendingOrder);
      } else {
        console.log('Actualizar Pedido:', pendingOrder);
      }
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const onAddModalClose = () => {
    setProductLines([]);
    setDate('');
    setObservation('');
    setCustomerId(0);
    setCustomerInfo({ name: '', address: '', city: '', phone: '' });
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
          Pedidos Pendientes 
        </h3>
        <p>
          Administre los pedidos pendientes mediante la creación, edición o eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<PendingOrderTypes>
              fetchItems={async () => []}
              searchItem={async () => []}
              createItem={async () => {}}
              updateItem={async () => {}}
              deleteItem={async () => {}}
              itemTemplate={itemTemplate}
              columns={columns as any}
              filterButtonOrder={1}
              pageTitle="Pedidos Pendientes"
              renderCustomAddModal={renderCustomAddModal}
              renderCustomValidation={renderCustomValidation}
              customSave={customSave}
              onAddModalOpen={onAddModalOpen}
              onAddModalClose={onAddModalClose}
              onEditModalOpen={onEditModalOpen}
              onRowClick={handleRowSelection}
            />
              </div>
        </div>
      </div>
      <style>{`.selected-row { background-color: #cc322d !important; color: white; }`}</style>

      <div className="card mt-1">
        <ProductDetailSupplierCRUD
          extraParams={{ shoppingSupplierId: selectedPendingOrderId ?? 0 }}
          setSelectedPendingOrderId={setSelectedPendingOrderId}
        />
      </div>
    </div>
  );
};

export default PendingOrder;