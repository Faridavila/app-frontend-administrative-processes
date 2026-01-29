import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Table, Alert, Button } from "react-bootstrap";
import { AssignOrderTypes, OrderProduct } from "../Types/AssignOrderTypes";
import SuppliersSelect from "./SelectSupplier";
import NeighborhoodRatesSelect from "./SelectRateNeighborhood";
import { DeleteIcon } from "../Icons/Icons";
import SelectUser from "./SelectUser";
import PendingOrdersSelect from "./SelectPendingOrder";
import {
  CreateAssignOrder,
  DeleteAssignOrder,
  GetAssignOrder,
  GetSearchAssignOrder,
  UpdateAssignOrder,
} from "../API/AssignOrderAPI";
import { AssignOrderSortFieldMap } from "../Types/MapeoAssignOrder";

interface AssignOrderProps {
  onRowClick?: (item: AssignOrderTypes) => void;
}

const AssignOrder: React.FC<AssignOrderProps> = ({ onRowClick }) => {
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignOrderTypes | null>(null);
  const [chargeInvoice, setChargeInvoice] = useState<boolean>(false);

  // Estados del formulario
  const [userId, setUserId] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [neighborhoodRateId, setNeighborhoodRateId] = useState<number>(0);
  const [orderId, setOrderId] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [observation, setObservation] = useState<string>("");

  // Información del pedido seleccionado
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    observation: "",
    city: "",
    phone: "",
    neighborhood: "",
    totalPurchase: 0,
  });

  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentOperation, setCurrentOperation] = useState<"add" | "edit">(
    "add"
  );


  // Validación en tiempo real
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (userId === 0) newErrors["userId"] = "Transportador es obligatorio.";
    if (warehouseId === 0) newErrors["warehouseId"] = "Bodega es obligatoria.";
    if (neighborhoodRateId === 0)
      newErrors["neighborhoodRateId"] = "Barrio es obligatorio.";
    if (orderId === 0) newErrors["orderId"] = "Pedido es obligatorio.";
    if (!date) newErrors["date"] = "Fecha es obligatoria.";
    if (!time) newErrors["time"] = "Hora es obligatoria.";

    // Validar que al menos un producto tenga cantidad por viaje y que sea válida
    if (orderProducts.length > 0) {
      const productsWithQuantity = orderProducts.filter(
        (p) => p.quantityPerTrip > 0
      );

      // Verificar que al menos un producto tenga cantidad asignada
      if (productsWithQuantity.length === 0) {
        newErrors["products"] =
          "Debe asignar cantidad por viaje a al menos un producto.";
      } else {
        // Verificar que las cantidades asignadas sean válidas
        const hasInvalidQuantities = productsWithQuantity.some(
          (p) => p.quantityPerTrip > p.quantity
        );
        if (hasInvalidQuantities) {
          newErrors["products"] =
            "Verifique las cantidades por viaje de los productos.";
        }
      }
    }

    setErrors(newErrors);
  }, [
    userId,
    warehouseId,
    neighborhoodRateId,
    orderId,
    date,
    time,
    orderProducts,
  ]);

  const itemTemplate = (): AssignOrderTypes => ({
    id: 0,
    userId: 0,
    userName: "",
    warehouseId: 0,
    warehouseName: "",
    neighborhoodRateId: 0,
    neighborhoodName: "",
    paymentMethodId: 0,
    paymentMethodName: "",
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
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onAddModalOpen = () => {
    setCurrentOperation("add");
    setUserId(0);
    setWarehouseId(0);
    setNeighborhoodRateId(0);
    setOrderId(0);
    setDate(getLocalDate());
    setTime("");
    setObservation("");
    setChargeInvoice(false);
    setCustomerInfo({
      name: "",
      address: "",
      observation: "",
      city: "",
      phone: "",
      neighborhood: "",
      totalPurchase: 0,
    });
    setOrderProducts([]);
    setErrors({});
  };

  const onEditModalOpen = (item: AssignOrderTypes) => {
    setCurrentOperation("edit");
    setUserId(item.userId);
    setWarehouseId(item.warehouseId);
    setNeighborhoodRateId(item.neighborhoodRateId);
    setOrderId(item.orderId);
    setChargeInvoice(item.chargeInvoice || false);
    setDate(item.date.split("T")[0] || "");
    setTime(item.date.split("T")[1]?.slice(0, 5) || "");
    setObservation(item.observation);
    setCustomerInfo({
      name: item.customerName,
      address: item.customerAddress,
      observation: item.observation,
      city: item.customerCity,
      phone: item.customerPhone,
      neighborhood: "",
      totalPurchase: item.totalPurchase,
    });
    setOrderProducts(item.products || []);
    setErrors({});
  };

  const handleRowSelection = (assignment: AssignOrderTypes) => {
    setSelectedAssignment(assignment);
    if (onRowClick) {
      onRowClick(assignment);
    }
  };

  const handleFieldChange = (field: string, value: any, extraData?: any) => {
    switch (field) {
      case "userId":
        setUserId(value);
        break;
      case "warehouseId":
        setWarehouseId(value);
        break;
      case "neighborhoodRateId":
        setNeighborhoodRateId(value);
        break;
      case "chargeInvoice":
        setChargeInvoice(value);
        break;
      case "orderId":
        setOrderId(value);
        if (value > 0 && extraData) {
          loadOrderDetailsFromData(extraData);
        } else {
          setCustomerInfo({
            name: "",
            address: "",
            observation: "",
            city: "",
            phone: "",
            neighborhood: "",
            totalPurchase: 0,
          });
          setOrderProducts([]);
        }
        break;
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      case "observation":
        setObservation(value);
        break;
    }
  };

  const loadOrderDetailsFromData = (orderData: any) => {
    console.log("📦 Datos del pedido recibidos:", orderData);

    setCustomerInfo({
      name: orderData.customerName || "",
      address: orderData.address || "",
      observation: orderData.observations || "",
      city: orderData.cityName || "",
      phone: orderData.phone || "",
      neighborhood: orderData.neighborhood || "",
      totalPurchase: orderData.total || 0,
    });

    const products =
      orderData.pendingOrderDetails?.map((detail: any) => ({
        id: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        price: detail.unitPrice,
        total: detail.total,
        quantityPerTrip: 0,
        pendingOrderDetailId: detail.id,
      })) || [];

    console.log("✅ Productos procesados con pendingOrderDetailId:", products);
    setOrderProducts(products);
    setObservation(orderData.observations || "");
  };

  const handleQuantityPerTripChange = (
    productId: number,
    newQuantity: number
  ) => {
    setOrderProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantityPerTrip: newQuantity }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const getStatusColor = (statusOrder: string) => {
    switch (statusOrder) {
      case "EN PROCESO":
        return "#ffc107";
      case "RECHAZADO":
        return "#db2828";
      case "ASIGNADO":
        return "#28a745";
      default:
        return "transparent";
    }
  };

  const renderCustomAddModal = (
    onSave: () => Promise<void>,
    onCancel: () => void
  ) => {
    const fieldOrder = [
      "userId",
      "warehouseId",
      "neighborhoodRateId",
      "date",
      "time",
      "orderId",
    ] as const;
    const getFieldError = (key: string) => errors[key] || null;
    const firstInvalidKey =
      fieldOrder.find((key) => !!getFieldError(key)) || null;

    return (
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Transportador</Form.Label>
              <SelectUser
                selectedValue={userId}
                onChange={(newId: number) => handleFieldChange("userId", newId)}
              />
              {"userId" === firstInvalidKey && (
                <Form.Control.Feedback type="invalid">
                  {getFieldError("userId")}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mt-2">
              <Row>
                <Col md={6}>
                  <Form.Label>Bodega (Origen)</Form.Label>
                  <SuppliersSelect
                    selectedValue={warehouseId}
                    onChange={(newId: number) =>
                      handleFieldChange("warehouseId", newId)
                    }
                  />
                  {"warehouseId" === firstInvalidKey && (
                    <Form.Control.Feedback type="invalid">
                      {getFieldError("warehouseId")}
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Barrio (Destino)</Form.Label>
                  <NeighborhoodRatesSelect
                    selectedValue={neighborhoodRateId}
                    onChange={(newId: number) =>
                      handleFieldChange("neighborhoodRateId", newId)
                    }
                  />
                  {"neighborhoodRateId" === firstInvalidKey && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {getFieldError("neighborhoodRateId")}
                    </div>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mt-2">
              <Row>
                <Col md={6}>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    isInvalid={"date" === firstInvalidKey}
                  />
                  {"date" === firstInvalidKey && (
                    <Form.Control.Feedback type="invalid">
                      {getFieldError("date")}
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleFieldChange("time", e.target.value)}
                    isInvalid={"time" === firstInvalidKey}
                  />
                  {"time" === firstInvalidKey && (
                    <Form.Control.Feedback type="invalid">
                      {getFieldError("time")}
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mt-2">
              <Row>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    id="cobrar-factura"
                    label="Cobrar factura"
                    checked={chargeInvoice}
                    onChange={(e) =>
                      handleFieldChange("chargeInvoice", e.target.checked)
                    }
                    className="mt-2"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Pedido</Form.Label>
              <PendingOrdersSelect
                selectedValue={orderId}
                onChange={(newId: number, orderData?: any) =>
                  handleFieldChange("orderId", newId, orderData)
                }
              />
              {"orderId" === firstInvalidKey && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  {getFieldError("orderId")}
                </div>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerInfo.name}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${customerInfo.address}${
                      customerInfo.neighborhood
                        ? " - " + customerInfo.neighborhood
                        : ""
                    }`}
                    title={`${customerInfo.address}${
                      customerInfo.neighborhood
                        ? " - " + customerInfo.neighborhood
                        : ""
                    }`}
                    readOnly
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "help",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerInfo.city}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Celular</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerInfo.phone}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Observación</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={customerInfo.observation}
                    title={customerInfo.observation}
                    readOnly
                    style={{
                      resize: "none",
                      cursor: "help",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        {orderId > 0 && customerInfo.name && (
          <Row className="mt-2">
            <Col xs={12}>
              <h6>Productos del Pedido - Asignar Cantidad por Viaje</h6>
              <div
                style={{
                  borderRadius: "0.375rem",
                  boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                  overflow: "hidden",
                }}
              >
                <Table bordered hover className="mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>PRODUCTO</th>
                      <th style={{ width: "12%", textAlign: "center" }}>
                        CANTIDAD TOTAL
                      </th>
                      <th style={{ width: "16%", textAlign: "center" }}>
                        CANTIDAD POR VIAJE
                      </th>
                      <th style={{ width: "12%", textAlign: "center" }}>
                        PRECIO
                      </th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        TOTAL
                      </th>
                      <th style={{ width: "10%", textAlign: "center" }}>
                        ACCIÓN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {product.quantity}
                        </td>
                        <td style={{ textAlign: "center", padding: "10px" }}>
                          <Form.Control
                            type="number"
                            min={0}
                            max={product.quantity}
                            value={product.quantityPerTrip || ""}
                            onChange={(e) =>
                              handleQuantityPerTripChange(
                                product.id,
                                Number(e.target.value)
                              )
                            }
                            style={{
                              width: "120px",
                              margin: "0 auto",
                              textAlign: "center",
                            }}
                            isInvalid={
                              product.quantityPerTrip > product.quantity
                            }
                          />
                          {product.quantityPerTrip > product.quantity && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginTop: "3px",
                              }}
                            >
                              Máx: {product.quantity}
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          ${product.price.toLocaleString("es-CO")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          ${product.total.toLocaleString("es-CO")}
                        </td>
                        <td style={{ textAlign: "center" }}>
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
              {errors["products"] && (
                <Alert variant="danger" className="mt-3 mb-0">
                  {errors["products"]}
                </Alert>
              )}

              <div className="text-end mt-2">
                <strong className="text-error fs-5 fw-bold">
                  Total a cobrar:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
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

  const customSave = async (
    onSuccess: () => void,
    onError: (error: any) => void
  ) => {
    if (Object.keys(errors).length > 0) {
      onError(new Error("Corrija los errores en el formulario"));
      return;
    }

    // ✅ Construir la fecha y hora correctamente
    const fullDateTime = time ? `${date}T${time}:00` : date;

    const assignment: AssignOrderTypes = {
      ...itemTemplate(),
      id: currentOperation === "edit" ? selectedAssignment?.id || 0 : 0,
      userId,
      warehouseId,
      neighborhoodRateId,
      orderId,
      date: fullDateTime, // ← Esto envía fecha + hora juntos
      hour: time || "", // ← Hora separada para el backend
      observation,
      chargeInvoice: chargeInvoice,
      customerName: customerInfo.name,
      customerAddress: customerInfo.address,
      customerCity: customerInfo.city,
      customerPhone: customerInfo.phone,
      totalPurchase: customerInfo.totalPurchase,
      address: customerInfo.address, // ← AGREGAR ESTA LÍNEA
      products: orderProducts.filter((p) => p.quantityPerTrip > 0),
    };

    console.log("📤 Datos a enviar:", assignment);

    try {
      if (currentOperation === "add") {
        await CreateAssignOrder(assignment, null);
        console.log("✅ Creado exitosamente");
      } else {
        await UpdateAssignOrder(assignment.id, assignment, null);
        console.log("✅ Actualizado exitosamente");
      }
      onSuccess();
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      onError(error);
    }
  };

  const columns = [
    { key: "id", label: "N° Orden", hiddenInCreate: true, hiddenInEdit: true },
    { key: "userId", label: "Conductor", hidden: true },
    {
      key: "userName",
      label: "Conductor",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "warehouseId", label: "Bodega", hidden: true },
    {
      key: "warehouseName",
      label: "Bodega",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "neighborhoodRateId", label: "Barrio", hidden: true },
    {
      key: "neighborhoodName",
      label: "Barrio",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "address",
      label: "Dirección",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "paymentMethodName" as keyof AssignOrderTypes,
      label: "Método de pago",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item: AssignOrderTypes) => {
        return item.paymentMethodName || "Sin método de pago";
      },
    },
// Reemplaza las dos columnas separadas de "date" y "hour" por esta única columna:

{
  key: "date",
  label: "Fecha",
  type: "date",
  hiddenInCreate: true,
  hiddenInEdit: true,
  render: (item: AssignOrderTypes) => {
    // Formatear fecha
    let formattedDate = "Sin fecha";
    if (item.date) {
      // ✅ Usar split para evitar problemas de zona horaria
      const [year, month, day] = item.date.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    // Formatear hora
    let formattedHour = "Sin hora";
    if (item.hour) {
      const [hours, minutes] = item.hour.split(":");
      const hour24 = parseInt(hours, 10);
      const hour12 = hour24 % 12 || 12;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      formattedHour = `${hour12}:${minutes} ${ampm}`;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontWeight: '500' }}>
          {formattedDate}
        </span>
        <span style={{ fontSize: '0.9em', color: '#6c757d' }}>
          {formattedHour}
        </span>
      </div>
    );
  },
},
    {
      key: "customerName",
      label: "Cliente",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "statusOrder",
      label: "Estado",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item: AssignOrderTypes) => {
        const statusColor = getStatusColor(item.statusOrder);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                backgroundColor: statusColor,
                padding: "6px 13px",
                borderRadius: "80px",
                color: "#fff",
                fontWeight: "500",
                display: "inline-block",
                textAlign: "center",
                minWidth: "80px",
              }}
            >
              {item.statusOrder}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
          Asignación de Pedidos
        </h3>
        <p>Asignación de pedidos a transportadores.</p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<AssignOrderTypes>
              fetchItems={GetAssignOrder}
              searchItem={GetSearchAssignOrder}
              createItem={CreateAssignOrder}
              updateItem={UpdateAssignOrder}
              deleteItem={DeleteAssignOrder}
              itemTemplate={itemTemplate}
              columns={columns as any}
              filterButtonOrder={1}
              sortFieldMap={AssignOrderSortFieldMap}
              pageTitle="Asignación de Pedidos"
              customModalClass="custom-modal-size"
              renderCustomAddModal={renderCustomAddModal}
              renderCustomValidation={renderCustomValidation}
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

export default AssignOrder;
