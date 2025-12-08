import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Table, Alert, Button } from 'react-bootstrap';
import { CompleteOrderHistoryTypes, OrderProduct } from "../Types/CompleteOrderHistoryTypes";
import SuppliersSelect from "./SelectSupplier";
import { DeleteIcon } from '../Icons/Icons';

interface CompleteOrderHistoryProps {
  onRowClick?: (item: CompleteOrderHistoryTypes) => void;
}

const CompleteOrderHistory: React.FC<CompleteOrderHistoryProps> = ({ onRowClick }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<CompleteOrderHistoryTypes | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  // Estados del formulario
  const [userId, setUserId] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [neighborhoodRateId, setNeighborhoodRateId] = useState<number>(0);
  const [orderId, setOrderId] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [observation, setObservation] = useState<string>('');

  // Información del pedido seleccionado
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    observation: '',
    city: '',
    phone: '',
    totalPurchase: 0
  });
  
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentOperation, setCurrentOperation] = useState<'add' | 'edit'>('add');

  // Validación en tiempo real
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (userId === 0) newErrors['userId'] = 'Transportador es obligatorio.';
    if (warehouseId === 0) newErrors['warehouseId'] = 'Bodega es obligatoria.';
    if (neighborhoodRateId === 0) newErrors['neighborhoodRateId'] = 'Barrio es obligatorio.';
    if (orderId === 0) newErrors['orderId'] = 'Pedido es obligatorio.';
    if (!date) newErrors['date'] = 'Fecha es obligatoria.';
    if (!time) newErrors['time'] = 'Hora es obligatoria.';
    
    // Validar que todos los productos tengan cantidad por viaje
    if (orderProducts.length > 0) {
      const hasInvalidQuantities = orderProducts.some(p => 
        p.quantityPerTrip <= 0 || p.quantityPerTrip > p.quantity
      );
      if (hasInvalidQuantities) {
        newErrors['products'] = 'Verifique las cantidades por viaje de los productos.';
      }
    }
    
    setErrors(newErrors);
  }, [userId, warehouseId, neighborhoodRateId, orderId, date, time, orderProducts]);

  const itemTemplate = (): CompleteOrderHistoryTypes => ({
    id: 0,
    userId: 0,
    userName: "",
    warehouseId: 0,
    warehouseName: "",
    neighborhoodRateId: 0,
    neighborhoodName: "",
    address: "",
    orderId: 0,
    customerName: "",
    customerAddress: "",
    customerCity: "",
    customerPhone: "",
    totalPurchase: 0,
    date: "",
    hour: "",
    observation: "",
    statusOrder: "",
    status: "",
    products: [],
  });

  const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onAddModalOpen = () => {
    setCurrentOperation('add');
    setUserId(0);
    setWarehouseId(0);
    setNeighborhoodRateId(0);
    setOrderId(0);
    setDate(getLocalDate());
    setTime('');
    setObservation('');
    setCustomerInfo({ name: '', address: '', observation: '', city: '', phone: '', totalPurchase: 0 });
    setOrderProducts([]);
    setErrors({});
  };

  const onEditModalOpen = (item: CompleteOrderHistoryTypes) => {
    setCurrentOperation('edit');
    setUserId(item.userId);
    setWarehouseId(item.warehouseId);
    setNeighborhoodRateId(item.neighborhoodRateId);
    setOrderId(item.orderId);
    setDate(item.date.split('T')[0] || '');
    setTime(item.date.split('T')[1]?.slice(0, 5) || '');
    setObservation(item.observation);
    setCustomerInfo({
      name: item.customerName,
      address: item.customerAddress,
      observation: item.observation,
      city: item.customerCity,
      phone: item.customerPhone,
      totalPurchase: item.totalPurchase
    });
    setOrderProducts(item.products || []);
    setErrors({});
  };

  const handleRowSelection = (assignment: CompleteOrderHistoryTypes) => {
    setSelectedAssignment(assignment);
    if (onRowClick) {
      onRowClick(assignment);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case 'userId':
        setUserId(value);
        break;
      case 'warehouseId':
        setWarehouseId(value);
        break;
      case 'neighborhoodRateId':
        setNeighborhoodRateId(value);
        break;
      case 'orderId':
        setOrderId(value);
        if (value > 0) {
          loadOrderDetails(value);
        } else {
          setCustomerInfo({ name: '', address: '', observation: '', city: '', phone: '', totalPurchase: 0 });
          setOrderProducts([]);
        }
        break;
      case 'date':
        setDate(value);
        break;
      case 'time':
        setTime(value);
        break;
      case 'observation':
        setObservation(value);
        break;
    }
  };

  const loadOrderDetails = async (orderId: number) => {
    try {
      // Aquí llamarías a tu API para obtener los detalles del pedido
      // const orderData = await GetOrderById(orderId);
      
      // Simulación de datos del pedido
      const mockOrderData = {
        customer: {
          name: 'Ana María Torres',
          address: 'Cra 15 #25-30',
          city: 'Cali',
          phone: '3201234567'
        },
        products: [
          { id: 1, productName: 'Ladrillo limpio 10 hueco', quantity: 100, price: 52, total: 5200 },
          { id: 2, productName: 'Ladrillo cálao', quantity: 555, price: 4, total: 2220 },
          { id: 3, productName: 'Cemento gris x 50kg', quantity: 20, price: 35000, total: 700000 },
        ],
        totalPurchase: 707420,
        observation: 'Entregar en horario de oficina'
      };

      // Establecer información del cliente
      setCustomerInfo({
        name: mockOrderData.customer.name,
        address: mockOrderData.customer.address,
        observation: mockOrderData.observation,
        city: mockOrderData.customer.city,
        phone: mockOrderData.customer.phone,
        totalPurchase: mockOrderData.totalPurchase
      });

      // Establecer productos con cantidad por viaje inicializada en 0
      setOrderProducts(mockOrderData.products.map(p => ({
        ...p,
        quantityPerTrip: 0
      })));

      // Establecer observación del pedido
      setObservation(mockOrderData.observation);

    } catch (error) {
      console.error('Error al cargar detalles del pedido:', error);
      setCustomerInfo({ name: '', address: '', observation: '', city: '', phone: '', totalPurchase: 0 });
      setOrderProducts([]);
    }
  };

  const handleQuantityPerTripChange = (productId: number, newQuantity: number) => {
    setOrderProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantityPerTrip: newQuantity }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  const getStatusColor = (statusOrder: string) => {
    switch (statusOrder) {
      case "Pendiente":
        return "#ffc107";
      case "Inicio":
        return "#17a2b8";
      case "Cargado":
        return "#28a745";
      default:
        return "transparent";
    }
  };

  const renderCustomAddModal = (onSave: () => Promise<void>, onCancel: () => void) => {
    const fieldOrder = ['userId', 'warehouseId', 'neighborhoodRateId', 'date', 'time', 'orderId'] as const;
    const getFieldError = (key: string) => errors[key] || null;
    const firstInvalidKey = fieldOrder.find(key => !!getFieldError(key)) || null;

    return (
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group >
              <Form.Label>Transportador</Form.Label>
              <Form.Select
                value={userId}
                onChange={(e) => handleFieldChange('userId', Number(e.target.value))}
                isInvalid={'userId' === firstInvalidKey}
              >
                <option value={0}>Seleccione un transportador</option>
              </Form.Select>
              {'userId' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('userId')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Bodega (Origen)</Form.Label>
              <SuppliersSelect
                selectedValue={warehouseId}
                onChange={(newId: number) => handleFieldChange('warehouseId', newId)}
              />
              {'warehouseId' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('warehouseId')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Barrio (Destino)</Form.Label>
              <Form.Select
                value={neighborhoodRateId}
                onChange={(e) => handleFieldChange('neighborhoodRateId', Number(e.target.value))}
                isInvalid={'neighborhoodRateId' === firstInvalidKey}
              >
                <option value={0}>Seleccione un barrio</option>
                {/* Mapear tus barrios aquí */}
              </Form.Select>
              {'neighborhoodRateId' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('neighborhoodRateId')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Fecha</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    isInvalid={'date' === firstInvalidKey}
                  />
                  {'date' === firstInvalidKey && (
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('date')}
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleFieldChange('time', e.target.value)}
                    isInvalid={'time' === firstInvalidKey}
                  />
                  {'time' === firstInvalidKey && (
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('time')}
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Pedido</Form.Label>
              <Form.Select
                value={orderId}
                onChange={(e) => handleFieldChange('orderId', Number(e.target.value))}
                isInvalid={'orderId' === firstInvalidKey}
              >
                <option value={0}>Seleccione un pedido</option>
                <option value={1}>Pedido #001 - Ana María Torres</option>
                <option value={2}>Pedido #002 - Luis Martínez</option>
              </Form.Select>
              {'orderId' === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError('orderId')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            {/* Información del Cliente */}
            <h6 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Información del Cliente</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={customerInfo.name} readOnly />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="text" value={customerInfo.address} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control type="text" value={customerInfo.city} readOnly />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Celular</Form.Label>
                  <Form.Control type="text" value={customerInfo.phone} readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Observación</Form.Label>
              <Form.Control type="text" value={customerInfo.observation} readOnly />
            </Form.Group>
          </Col>
        </Row>
        {/* Tabla de productos con cantidad por viaje */}
        {orderId > 0 && customerInfo.name && (
          <Row className="mt-2">
            <Col xs={12}>
              <h6>Productos del Pedido - Asignar Cantidad por Viaje</h6>
              <div style={{
                borderRadius: '0.375rem',
                boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                overflow: 'hidden'
              }}>
                <Table bordered hover className="mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}>PRODUCTO</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>CANTIDAD TOTAL</th>
                      <th style={{ width: '16%', textAlign: 'center' }}>CANTIDAD POR VIAJE</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>PRECIO</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>TOTAL</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{product.quantity}</td>
                        <td style={{ textAlign: 'center', padding: '10px' }}>
                          <Form.Control
                            type="number"
                            min={0}
                            max={product.quantity}
                            value={product.quantityPerTrip || ''}
                            onChange={(e) => handleQuantityPerTripChange(product.id, Number(e.target.value))}
                            style={{
                              width: '120px',
                              margin: '0 auto',
                              textAlign: 'center'
                            }}
                            isInvalid={product.quantityPerTrip > product.quantity || product.quantityPerTrip <= 0}
                          />
                          {product.quantityPerTrip > product.quantity && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '3px' }}>
                              Máx: {product.quantity}
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          ${product.price.toLocaleString('es-CO')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          ${product.total.toLocaleString('es-CO')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {errors['products'] && (
                <Alert variant="danger" className="mt-3 mb-0">
                  {errors['products']}
                </Alert>
              )}

              <div className="text-end">
              <strong className="text-error fs-2 fw-bold">
                Total: {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(customerInfo.totalPurchase)}
              </strong>
            </div>
            </Col>
          </Row>
        )}
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

    const fullDateTime = time ? `${date}T${time}:00` : date;

    const assignment: CompleteOrderHistoryTypes = {
      ...itemTemplate(),
      id: currentOperation === 'edit' ? selectedAssignment?.id || 0 : 0,
      userId,
      warehouseId,
      neighborhoodRateId,
      orderId,
      date: fullDateTime,
      observation,
      customerName: customerInfo.name,
      customerAddress: customerInfo.address,
      customerCity: customerInfo.city,
      customerPhone: customerInfo.phone,
      totalPurchase: customerInfo.totalPurchase,
      products: orderProducts,
    };

    try {
      if (currentOperation === 'add') {
        // await CreateCompleteOrderHistoryAssignment(assignment);
        console.log('Crear:', assignment);
      } else {
        // await UpdateCompleteOrderHistoryAssignment(assignment.id, assignment);
        console.log('Actualizar:', assignment);
      }
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const columns = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, },
    {key:"userId", label:"Transportador", hidden:true},
    { key: "userName", label: "Transportador", hiddenInCreate: true, hiddenInEdit: true },
    {key:"warehouseId", label:"Bodega", hidden:true},
    { key: "warehouseName", label: "Bodega", hiddenInCreate: true, hiddenInEdit: true },
    {key:"neighborhoodRateId", label:"Barrio", hidden:true},
    { key: "neighborhoodName", label: "Barrio", hiddenInCreate: true, hiddenInEdit: true },
    { key: "address", label: "Dirección", hiddenInCreate: true, hiddenInEdit: true },
    { key: "date", label: "Fecha", hiddenInCreate: true, hiddenInEdit: true },
     { key: "hour", label: "Hora", hiddenInCreate: true, hiddenInEdit: true },
    { key: "customerName", label: "Cliente", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "statusOrder",
      label: "Estado",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item: CompleteOrderHistoryTypes) => {
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
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
          Asignación de Pedidos
        </h3>
        <p>
          Asignación de pedidos a transportadores.
        </p>
         <div className="mb-1">
          <label className="form-label d-block mb-1">Rango de Fechas</label>

          <div className="d-flex gap-2 flex-nowrap">
            <input
              type="date"
              className="form-control w-auto"
              style={{ minWidth: 200 }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="Fecha desde"
            />
            <input
              type="date"
              className="form-control w-auto"
              style={{ minWidth: 200 }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="Fecha hasta"
            />
          </div>
        </div>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<CompleteOrderHistoryTypes>
              fetchItems={async () => []}
              searchItem={async () => []}
              createItem={async () => {}}
              updateItem={async () => {}}
              deleteItem={async () => {}}
              itemTemplate={itemTemplate}
              columns={columns as any}
              filterButtonOrder={1}
              pageTitle="Asignación de Pedidos"
              customModalClass="custom-modal-size"
              renderCustomAddModal={renderCustomAddModal}
              renderCustomValidation={renderCustomValidation}
              hiddenEditButton={false}
              hiddenDeleteButton={false}
              hiddenAddButton={false}
              customSave={customSave}
              onAddModalOpen={onAddModalOpen}
              onEditModalOpen={onEditModalOpen}
              onRowClick={handleRowSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderHistory;