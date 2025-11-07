import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ShoppingSuppliersTypes } from "../Types/ShoppingSuppliersTypes";
import { ShoppingSuppliersSortFieldMap } from "../Types/MapeoShoppingSuppliers";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import SelectProduct from "./SelectProduct";
import {
  GetShoppingSuppliers,
  CreateShoppingSuppliers,
  UpdateShoppingSuppliers,
  DeleteShoppingSuppliers,
  GetSearchShoppingSuppliers,
  GetPurchasePrice,
} from "../API/ShoppingSuppliersAPI";
import SuppliersSelect from "./SelectSupplier";
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap';
import { AddIcon, DeleteIcon, PDFIcon } from '../Icons/Icons';
import ProductDetailSupplierCRUD from "../../ProductDetailSupplier/Components/ProductDetailSupplier";
import { generateTicketPDF, PDFTicketConfig } from '../../Hooks/usePDFGeneradorTicket';
import { GetCompanyById } from "../../Company/API/CompanyAPI";
import { CompanyType } from "../../Company/Types/Company";

interface ProductLine {
  tempId: string;
  productId: number;
  productName: string;
  purchasePrice: number;
  quantity: number;
  total: number;
}

interface ShoppingSuppliersCRUDProps {
  extraParams?: { SupplierId: number };
  onRowClick?: (item: ShoppingSuppliersTypes) => void;
}

const ShoppingSuppliers: React.FC<ShoppingSuppliersCRUDProps> = ({ onRowClick }) => {
  const [selectedShoppingSupplier, setSelectedShoppingSupplier] = useState<ShoppingSuppliersTypes | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [date, setDate] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);
  const [shoppingSuppliersList, setShoppingSuppliersList] = useState<ShoppingSuppliersTypes[]>([]);


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

  const itemTemplate = (): ShoppingSuppliersTypes => ({
    id: 0,
    supplierId: 0,
    supplierName: "",
    productId: 0,
    productName: "",
    purchasePrice: 0,
    purchaseStatus: "",
    remainingAmount: 0,
    warehouseId: 0,
    warehouseName: "",
    quantity: 0,
    observation: "",
    date: getLocalDate(),
    total: 0,
    transactionTotal: 0,
    status: "",
  });

  const handleRowSelection = (shopping: ShoppingSuppliersTypes) => {
    setSelectedShoppingSupplier(shopping);
    setSelectedSupplierId(shopping.supplierId);
    if (onRowClick) {
      onRowClick(shopping);
    }
  };


const getLocalDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


  const handleDownloadPDF = () => {
    if (!selectedShoppingSupplier) {
      alert('Por favor, seleccione una compra primero');
      return;
    }

    if (!companyData) {
      alert('No se pudieron cargar los datos de la empresa');
      return;
    }

    const relatedPurchases = shoppingSuppliersList.filter(
      item =>
        item.supplierId === selectedShoppingSupplier.supplierId &&
        item.date === selectedShoppingSupplier.date
    );

    if (relatedPurchases.length === 0) {
      alert('No se encontraron productos para esta compra');
      return;
    }

    const total = relatedPurchases.reduce((sum, item) => sum + (item.total || 0), 0);

    const numeroCompra = `${selectedShoppingSupplier.supplierId}-${selectedShoppingSupplier.id}`;

    const ticketConfig: PDFTicketConfig = {
      companyInfo: {
        logo: 'https://res.cloudinary.com/dfotyo6jc/image/upload/v1761872392/Captura_de_pantalla_2025-10-30_195850_kwda8d.png',
        logoWidth: 25,
        logoHeight: 25,
        nit: companyData.nit,
        direccion: companyData.address,
        celular: companyData.phone,
        email: companyData.email,
      },
      mainInfo: {
        fecha: selectedShoppingSupplier.date
          ? new Date(selectedShoppingSupplier.date).toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          : new Date().toLocaleString('es-CO'),
        numeroPago: numeroCompra,
        proveedor: selectedShoppingSupplier.supplierName,
      },
      products: relatedPurchases.map(item => ({
        producto: item.productName,
        cantidad: item.quantity,
        valor: item.total || 0,
      })),
      total: total,
      footer: {
        showGeneratedBy: true,
        generatedByText: `Hecho en Colombia por ${companyData.companyName}`,
        showPageNumber: true,
      },
      fileName: `Compra_${selectedShoppingSupplier.supplierName.replace(/\s+/g, '_')}_${selectedShoppingSupplier.date || getLocalDate()}.pdf`,  
      ticketType: 'compra',
    };

    generateTicketPDF(ticketConfig);
  };

  const getStatusColor = (ShoppingSuppliersStatus: string) => {
    console.log("ShoppingSuppliers Status:", ShoppingSuppliersStatus);
    switch (ShoppingSuppliersStatus) {
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
    key: keyof ShoppingSuppliersTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof ShoppingSuppliersTypes;
    validationMessage?: string;
    render?: (item: ShoppingSuppliersTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
      { key: "id", label: "Proveedor", hidden: true, required: true },
      { key: "supplierName", label: "Proveedor", hiddenInCreate: true, hiddenInEdit: true, },
      { key: "warehouseId", label: "Bodega", hidden: true, required: true },
      { key: "warehouseName", label: "Bodega", hiddenInCreate: true, hiddenInEdit: true, hidden: true, },
      { key: "remainingAmount", label: "cantidad restante", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      {
        key: "date",
        label: "Fecha",
        render: (item) => {
          const date = item.date ? new Date(item.date).toLocaleDateString() : "No disponible";
          return <span>{date}</span>;
        }
      },
      {
        key: "purchaseStatus",
        label: "Estado",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => {
          console.log("Rendering ShoppingSuppliersStatus:", item.purchaseStatus);
          const statusColor = getStatusColor(item.purchaseStatus);
          return (
            <span
              style={{
                backgroundColor: statusColor,
                padding: '5px',
                borderRadius: '5px',
                color: '#fff',
              }}
            >
              {item.purchaseStatus}
            </span>
          );
        }
      },
      {
        key: "observation",
        label: "Observacion",
      },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", hiddenInCreate: true, hiddenInEdit: true, hidden: true, },
      { key: "purchasePrice", label: "Precio de compra", hidden: true },
      { key: "quantity", label: "Cantidad", required: true, hidden: true, regex: /^\d+$/ },
      { key: "total", label: "Total", required: true, hidden: true, regex: /^\d+$/ },
    ];

  const renderCustomFormField = (
    colKey: keyof ShoppingSuppliersTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "id") {
      return (
        <SuppliersSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newSupplierId: number) => {
            handleSupplierChange(newSupplierId);
            onChange(newSupplierId.toString());
          }}
        />
      );
    }
    if (colKey === "productId") {
      return (
        <SelectProduct
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

  const handleSupplierChange = async (newId: number) => {
    setSupplierId(newId);

    // Reinicio explícito de todos los precios y totales al cambiar el proveedor
    setProductLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        purchasePrice: 0,
        total: 0,
      }))
    );

    // Si hay líneas existentes con productos seleccionados, actualizar sus precios con el nuevo proveedor
    if (newId > 0 && productLines.some(line => line.productId > 0)) {
      for (const line of productLines) {
        if (line.productId > 0) {
          try {
            const price = await GetPurchasePrice(newId, line.productId);
            setProductLines(prevLines =>
              prevLines.map(l =>
                l.tempId === line.tempId
                  ? {
                      ...l,
                      purchasePrice: price,
                      total: l.quantity * price,
                    }
                  : l
              )
            );
          } catch (error) {
            console.error('Error al actualizar el precio de compra para la línea:', error);
            // Opcional: No revertir el reinicio; el precio permanece en 0 si la API falla
          }
        }
      }
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

  const handleProductChange = async (tempId: string, productId: number) => {
    setProductLines(prevLines =>
      prevLines.map(line =>
        line.tempId === tempId
          ? {
            ...line,
            productId,
            productName: "",
            purchasePrice: 0,
          }
          : line
      )
    );

    if (supplierId > 0 && productId > 0) {
      try {
        const price = await GetPurchasePrice(supplierId, productId);
        setProductLines(prevLines =>
          prevLines.map(line =>
            line.tempId === tempId
              ? {
                ...line,
                purchasePrice: price,
                total: line.quantity * price,
              }
              : line
          )
        );
      } catch (error) {
        console.error('Error al obtener el precio de compra:', error);
      }
    }
  };

  const renderCustomAddModal = (onSave: () => Promise<void>, onCancel: () => void) => {
    const allLinesValid = productLines.length > 0 && productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0);
    const supplierValid = supplierId > 0;
    const totalGeneral = productLines.reduce((sum, line) => sum + (line.quantity * line.purchasePrice), 0);

    return (
      <Form>
        <Row className="mb-1">
          <Col md={6}>
            <Form.Group className="mb-1">
              <Form.Label>Proveedor</Form.Label>
              <SuppliersSelect
                selectedValue={supplierId}
                onChange={handleSupplierChange}
              />
              {!supplierValid && <div className="text-danger">Proveedor es obligatorio.</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-1">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col md={12}>
            <Form.Group className="mb-1">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ingrese observación"
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
              <div>
                <Table bordered hover className="mb-0" style={{ tableLayout: 'auto', width: '100%' }}>
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
                        <td style={{ overflow: 'visible' }}>
                          <SelectProduct
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
            {!allLinesValid && (
              <Alert variant="danger" >
                Ingrese todos los campos requeridos en los productos agregados.
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
    if (supplierId === 0 || productLines.length === 0 || !productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0)) {
      onError(new Error('Ingrese todos los campos requeridos'));
      return;
    }
    try {
      for (const line of productLines) {
        if (line.productId > 0 && line.quantity > 0) {
          const itemData: Partial<ShoppingSuppliersTypes> = {
            supplierId,
            productId: line.productId,
            purchasePrice: line.purchasePrice,
            quantity: line.quantity,
            date: date || getLocalDate(),
            observation,
            total: line.total,
          };
          const item: ShoppingSuppliersTypes = { ...itemTemplate(), ...itemData };
          await CreateShoppingSuppliers(item, null);
        }
      }
      setProductLines([]);
      setDate('');
      setObservation('');
      setSupplierId(0);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const renderCustomValidation = () => {
    return supplierId > 0 && productLines.length > 0 && productLines.every(line => line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0);
  };

  const onAddModalOpen = () => {
    setDate(getLocalDate());
    setObservation('');
    setSupplierId(0);
    setProductLines([{
      tempId: Date.now().toString(),
      productId: 0,
      productName: '',
      purchasePrice: 0,
      quantity: 0,
      total: 0,
    }]);
  };

  const onAddModalClose = () => {
    setProductLines([]);
    setDate('');
    setObservation('');
    setSupplierId(0);
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de compras a proveedores
          </h3>
          <FavoritoButton path="/ShoppingSuppliers" label="ShoppingSuppliersos" />
        </div>
        <p>
          Administre las compras de proveedores, lleva control del registro de compras a cada proveedor.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '205px',
              zIndex: 10
            }}>
              <Button
                variant="danger"
                onClick={handleDownloadPDF}
                disabled={!selectedShoppingSupplier}
                style={{
                  width: '33px',
                  height: '33px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: !selectedShoppingSupplier ? '#6c757d' : '#dc3545',
                  color: 'white'
                }}
                title="Descargar ticket PDF de la compra seleccionada"
              >
                <PDFIcon />
              </Button>
            </div>

            <CRUDForm<ShoppingSuppliersTypes>
              fetchItems={(page, pageSize, filters, sortField, sortOrder) => {
                return GetShoppingSuppliers(page, pageSize, filters, sortField, sortOrder).then(data => {
                  setShoppingSuppliersList(data);
                  return data;
                });
              }}
              searchItem={GetSearchShoppingSuppliers}
              createItem={CreateShoppingSuppliers}
              updateItem={UpdateShoppingSuppliers}
              deleteItem={DeleteShoppingSuppliers}
              itemTemplate={itemTemplate}
              columns={columns}
              hiddenAddButton={true}
              hiddenDeleteButton={true}
              hiddenEditButton={false}
              sortFieldMap={ShoppingSuppliersSortFieldMap}
              pageTitle="Compras"
              renderCustomFormField={renderCustomFormField}
              renderCustomAddModal={renderCustomAddModal}
              renderCustomValidation={renderCustomValidation}
              customSave={customSave}
              onAddModalOpen={onAddModalOpen}
              onAddModalClose={onAddModalClose}
              onRowClick={handleRowSelection}
              rowClassName={(item: ShoppingSuppliersTypes) =>
                selectedShoppingSupplier?.id === item.id ? 'selected-row' : ''
              }
              filterButtonOrder={1}
              downloadButtonOrder={2}
              addButtonOrder={3}
              deleteButtonOrder={4}
            />
          </div>
        </div>
      </div>
      <style>{`.selected-row { background-color: #cc322d !important; color: white; }`}</style>

      <div className="card mt-1">
        <ProductDetailSupplierCRUD
          extraParams={{ supplierId: selectedSupplierId ?? 0 }}
          setSelectedSupplierId={setSelectedSupplierId}
        />
      </div>
    </div>
  );
};

export default ShoppingSuppliers;