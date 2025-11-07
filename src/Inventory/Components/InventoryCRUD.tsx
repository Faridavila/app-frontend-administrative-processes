import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProductTypes } from "../Types/InventoryTypes";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap';
import { ProductSortFieldMap } from "../Types/MapeoInventoryTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import ProductSelect from "./SelectProduct";
import {
  GetProduct,
  UpdateIntorySubtract,
  DeleteProduct,
  CreateProduct,
  UpdateProduct,
  GetSearchProduct,
  UpdateIntoryAdd
} from "../API/InventoryAPI";
import { AddIcon, DeleteIcon } from '../Icons/Icons';

interface ProductLine {
  tempId: string;
  productId: number;
  productName: string;
  purchasePrice: number;
  quantity: number;
  total: number;
}

const InventoryCRUD = () => {
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [date, setDate] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [currentAction, setCurrentAction] = useState<'add' | 'subtract' | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId, 10));
    }
  }, []);


  const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const itemTemplate = (): ProductTypes => ({
    id: 0,
    productName: "",
    price: 0,
    description: "",
    quantity: 0,
    categoryId: 0,
    userId: currentUserId,
    categoryName: "",
    observation: "",
    purchasePrice: 0,
    total: 0,
    transactionTotal: 0,
    date: getLocalDate(),
    image: "",
    productStatus: "",
    status: "",
  });

  const getStatusColor = (productStatus: string) => {
    switch (productStatus) {
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
    key: keyof ProductTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof ProductTypes;
    validationMessage?: string;
    render?: (item: ProductTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
      { key: "productName", label: "Nombre del producto", hiddenInCreate: true, hiddenInEdit: true },
      { key: "price", label: "Precio de venta", hiddenInCreate: true, hiddenInEdit: true },
      { key: "description", label: "Medidas", hiddenInCreate: true, hiddenInEdit: true },
      { key: "id", label: "Producto", hidden: true, required: true },
      { key: "quantity", label: "Cantidad", required: true, regex: /^\d+$/ },
      { key: "categoryName", label: "Categoria", hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "date",
        label: "Fecha",
        hidden: true,
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
        key: "productStatus",
        label: "Estado",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => {
          const statusColor = getStatusColor(item.productStatus);
          return (
            <span
              style={{
                backgroundColor: statusColor,
                padding: '5px',
                borderRadius: '5px',
                color: '#fff',
              }}
            >
              {item.productStatus}
            </span>
          );
        }
      },
      {
        key: "image",
        label: "Imagen",
        required: false,
        imageOptions: {
          maxSize: 2 * 1024 * 1024,
          acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
        },
        render: (item) =>
          item.image ? (
            <img
              src={item.image}
              alt="Imagen"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          ) : (
            "N/A"
          ),
        editable: true,
        hiddenInCreate: true, hiddenInEdit: true
      }
    ];

  const renderCustomFormField = (
    colKey: keyof ProductTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "id") {
      return (
        <ProductSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newProductId: number) => onChange(newProductId.toString())}
        />
      );
    }
    if (colKey === "date") {
      return (
        <input
          type="date"
          className="form-control"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Fecha"
        />
      );
    }
    return null;
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
    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId
          ? {
            ...line,
            productId,
            productName: "",
          }
          : line
      )
    );
  };

  const renderCustomActionModal = (onSave: () => Promise<void>, onCancel: () => void, actionKey: 'add' | 'subtract') => {
    const allLinesValid = productLines.length > 0 && productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0);
    const totalGeneral = productLines.reduce((sum, line) => sum + (line.quantity * line.purchasePrice), 0);

    return (
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{actionKey === 'add' ? 'Observación' : 'Motivo de la pérdida'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder={`Ingrese ${actionKey === 'add' ? 'observación' : 'motivo'}`}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="p-0">
            <div className="mb-3" style={{
              borderRadius: '0.375rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              maxWidth: '100%',
              width: '100%',
              overflow: 'visible'
            }}>
              <div >
                <Table>
                  <thead>
                    <tr>
                      <th style={{ width: '25%', padding: '12px', textAlign: 'left' }}>PRODUCTO</th>
                      <th style={{ width: '20%', padding: '12px', textAlign: 'center' }}>PRECIO DE COMPRA</th>
                      <th style={{ width: '20%', padding: '12px', textAlign: 'center' }}>CANTIDAD</th>
                      <th style={{ width: '20%', padding: '12px', textAlign: 'center' }}>TOTAL</th>
                      <th style={{ width: '15%', padding: '12px', textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLines.map((line) => (
                      <tr key={line.tempId}>
                        <td style={{ overflow: 'visible', }}>
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
                          <Form.Control
                            type="number"
                            placeholder="Cantidad"
                            value={line.quantity || ''}
                            onChange={(e) => {
                              const q = parseFloat(e.target.value) || 0;
                              handleLineChange(line.tempId, 'quantity', q);
                            }}
                            min={1}
                            className="form-control form-control-sm text-center"
                            style={{ borderRadius: '0.375rem', maxWidth: '120px', margin: '0 auto', border: '1px solid #ced4da' }}
                          />
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                           <span
                            className="form-control form-control-sm text-center bg-light"
                            style={{
                              borderRadius: '0.375rem',
                              maxWidth: '120px',
                              margin: '0 auto',
                              border: '1px solid #ced4da',
                              display: 'block',
                              padding: '0.375rem 0.75rem',  
                              lineHeight: '1.5',
                              fontWeight: 'bold',  
                            }}
                          >
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(line.total)}
                          </span>
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
                        <td colSpan={5} className="text-center text-muted py-4">
                          No hay productos agregados. Haz clic en "Añadir Producto".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
            {(productLines.length === 0 || !productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0)) && (
              <Alert variant="danger" >
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
                     <div className="text-end">
              <strong className="text-error fs-2 fw-bold">
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

  const customSave = async (onSuccess: () => void, onError: (error: any) => void) => {
    if (!currentAction || productLines.length === 0 || !productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0)) {
      onError(new Error('Ingrese todos los campos requeridos en las líneas de productos'));
      return;
    }

    try {
      const productQuantity: Array<{
        id: number;
        quantity: number;
        date: string;
        observation: string;
        purchasePrice: number;
        total: number;
        transactionTotal: number;
        userId: number;
      }> = [];

      let runningTotal = 0;

      productLines.forEach((line, index) => {
        const lineTotal = line.quantity * line.purchasePrice;
        runningTotal += lineTotal;

        productQuantity.push({
          id: line.productId,
          quantity: line.quantity,
          date: date || getLocalDate(),
          observation: observation || '',
          purchasePrice: line.purchasePrice,
          total: lineTotal,
          transactionTotal: runningTotal,
          userId: currentUserId,
        });
      });

      const batchData = {
        productQuantity,
      };

      if (currentAction === 'add') {
        await UpdateIntoryAdd(batchData);
      } else {
        await UpdateIntorySubtract(batchData);
      }

      setProductLines([]);
      setDate('');
      setObservation('');
      setCurrentAction(null);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const renderCustomActionValidation = () => {
    return productLines.length > 0 && productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0);
  };

  const onActionModalOpen = (key: 'add' | 'subtract') => {
    setDate(getLocalDate());
    setObservation('');
    setProductLines([{
      tempId: Date.now().toString(),
      productId: 0,
      productName: '',
      purchasePrice: 0,
      quantity: 0,
      total: 0,
    }]);
    setCurrentAction(key);
  };

  const onActionModalClose = () => {
    setProductLines([]);
    setDate('');
    setObservation('');
    setCurrentAction(null);
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de Inventarios
          </h3>
          <FavoritoButton path="/product" label="Productos" />
        </div>
        <p>
          Administre el inventario, controle el stock y registre entradas o pérdidas de productos.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<ProductTypes>
              fetchItems={GetProduct}
              searchItem={GetSearchProduct}
              createItem={CreateProduct}
              updateItem={UpdateProduct}
              deleteItem={DeleteProduct}
              generalItems={{ add: UpdateIntoryAdd, subtract: UpdateIntorySubtract }}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              addPlusButtonOrder={10}
              hiddenAddPlusButton={true}
              hiddenSubtractButton={true}
              hiddenEditButton={false}
              hiddenDeleteButton={false}
              sortFieldMap={ProductSortFieldMap}
              pageTitle="Inventario"
              renderCustomFormField={renderCustomFormField}
              renderCustomActionModal={renderCustomActionModal}
              renderCustomActionValidation={renderCustomActionValidation}
              customSave={customSave}
              onActionModalOpen={onActionModalOpen}
              onModalClose={onActionModalClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCRUD;