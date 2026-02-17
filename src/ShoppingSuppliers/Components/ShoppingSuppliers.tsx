import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ShoppingSuppliersTypes } from "../Types/ShoppingSuppliersTypes";
import { ShoppingSuppliersSortFieldMap } from "../Types/MapeoShoppingSuppliers";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import SelectProduct from "./SelectProduct";
import {
  GetShoppingSuppliers,
  CreateShoppingSuppliers,
  DeleteShoppingSuppliers,
  GetSearchShoppingSuppliers,
  GetPurchasePrice,
} from "../API/ShoppingSuppliersAPI";
import { GetProductDetailSupplier } from "../../ProductDetailSupplier/API/ProductDetailSupplierAPI";
import SuppliersSelect from "./SelectSupplier";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Table, Alert } from "react-bootstrap";
import { AddIcon, DeleteIcon, PDFIcon } from "../Icons/Icons";
import ProductDetailSupplierCRUD from "../../ProductDetailSupplier/Components/ProductDetailSupplier";
import {
  generateTicketPDF,
  PDFTicketConfig,
} from "../../Hooks/usePDFGeneradorTicket";
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
  extraParams?: { shoppingSupplierId: number };
  onRowClick?: (item: ShoppingSuppliersTypes) => void;
}

const ShoppingSuppliers: React.FC<ShoppingSuppliersCRUDProps> = ({
  onRowClick,
}) => {
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [selectedShoppingSupplier, setSelectedShoppingSupplier] =
    useState<ShoppingSuppliersTypes | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const [supplierId, setSupplierId] = useState<number>(0);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [date, setDate] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);
  const [shoppingSuppliersList, setShoppingSuppliersList] = useState<
    ShoppingSuppliersTypes[]
  >([]);

  const itemTemplate = (): ShoppingSuppliersTypes => ({
    id: 0,
    supplierId: 0,
    supplierName: "",
    productId: 0,
    productName: "",
    purchasePrice: 0,
    purchaseStatus: "DEBE",
    remainingAmount: 0,
    warehouseId: 0,
    warehouseName: "",
    quantity: 0,
    observation: "",
    date: getLocalDate(),
    total: 0,
    transactionTotal: 0,
    userId: currentUserId,
    status: "",
    products: [],
  });

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
    type?: "text" | "number" | "image" | "password" | "date";
    render?: (item: ShoppingSuppliersTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
    { key: "id", label: "N° Compra", required: true },
    {
      key: "supplierName",
      label: "Proveedor",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "warehouseId", label: "Bodega", hidden: true, required: true },
    {
      key: "warehouseName",
      label: "Bodega",
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
    {
      key: "remainingAmount",
      label: "cantidad restante",
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
    { key: "date", label: "Fecha" , type: "date"},

    {
      key: "purchaseStatus",
      label: "Estado",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item) => {
        console.log("Rendering PurchaseStatus:", item.purchaseStatus);
        const statusColor = getStatusColor(item.purchaseStatus);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <span
              style={{
                backgroundColor: statusColor,
                padding: "5px 16px",
                borderRadius: "80px",
                color: "#fff",
                fontWeight: "500",
                display: "inline-block",
                textAlign: "center",
                minWidth: "100px",
              }}
            >
              {item.purchaseStatus}
            </span>
          </div>
        );
      },
    },
    {
      key: "observation",
      label: "Observacion",
      render: (item) => {
        const observation = item.observation || "Sin observación";
        return <span>{observation}</span>;
      },
    },

    { key: "productId", label: "Producto", hidden: true, required: true },
    {
      key: "productName",
      label: "Producto",
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
    { key: "purchasePrice", label: "Precio de compra", hidden: true },
    {
      key: "quantity",
      label: "Cantidad",
      required: true,
      hidden: true,
      regex: /^\d+$/,
    },
    {
      key: "total",
      label: "Total",
      required: true,
      hidden: true,
      regex: /^\d+$/,
    },
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

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await GetCompanyById(1);
        if (data) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error("Error al cargar datos de la empresa:", error);
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const handleRowSelection = (shopping: ShoppingSuppliersTypes) => {
    setSelectedShoppingSupplier(shopping);
    setSelectedSupplierId(shopping.id);
    if (onRowClick) {
      onRowClick(shopping);
    }
  };

  const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadRelatedPurchases = async (shoppingSupplierId: number) => {
    try {
      const products = await GetProductDetailSupplier(
        0,
        10000000,
        {},
        "",
        undefined,
        { shoppingSupplierId }
      );
      return products;
    } catch (error) {
      console.error("Error al cargar productos relacionados:", error);
      return [];
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedShoppingSupplier) {
      alert("Por favor, seleccione una compra primero");
      return;
    }

    if (!companyData) {
      alert("No se pudieron cargar los datos de la empresa");
      return;
    }

    const relatedPurchases = await loadRelatedPurchases(
      selectedShoppingSupplier.id
    );

    if (relatedPurchases.length === 0) {
      alert("No se encontraron productos para esta compra");
      return;
    }

    const total = relatedPurchases.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    const numeroCompra = `${selectedShoppingSupplier.id}`;

    const ticketConfig: PDFTicketConfig = {
      companyInfo: {
        logo: "https://res.cloudinary.com/dfotyo6jc/image/upload/v1761872392/Captura_de_pantalla_2025-10-30_195850_kwda8d.png",
        logoWidth: 25,
        logoHeight: 25,
        nit: companyData.nit,
        direccion: companyData.address,
        celular: companyData.phone,
        email: companyData.email,
      },
      mainInfo: {
        fecha: selectedShoppingSupplier.date || getLocalDate(),
        numeroPago: numeroCompra,
        proveedor: selectedShoppingSupplier.supplierName,
      },
      products: relatedPurchases.map((item) => ({
        producto: item.productName,
        cantidad: item.quantity,
        valor: item.total || 0,
      })),
      total: total,
      footer: {
        showGeneratedBy: true,
        generatedByText: `Hecho en Colombia por BizManage  Cel:3172116796`,
        showPageNumber: true,
      },
      fileName: `Compra_${selectedShoppingSupplier.supplierName.replace(
        /\s+/g,
        "_"
      )}_${selectedShoppingSupplier.date || getLocalDate()}.pdf`,
      ticketType: "compra",
    };

    generateTicketPDF(ticketConfig);
  };

  const getStatusColor = (purchaseStatus: string) => {
    console.log("Purchase Status:", purchaseStatus);
    switch (purchaseStatus) {
      case "DEBE":
        return "#dc3545";
      case "CANCELADO":
        return "#28a745";
      default:
        return "transparent";
    }
  };

  const handleSupplierChange = async (newId: number) => {
    setSupplierId(newId);
    setProductLines((prevLines) =>
      prevLines.map((line) => ({
        ...line,
        purchasePrice: 0,
        total: 0,
      }))
    );

    if (newId > 0 && productLines.some((line) => line.productId > 0)) {
      for (const line of productLines) {
        if (line.productId > 0) {
          try {
            const price = await GetPurchasePrice(newId, line.productId);
            setProductLines((prevLines) =>
              prevLines.map((l) =>
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
            console.error(
              "Error al actualizar el precio de compra para la línea:",
              error
            );
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
    setProductLines(productLines.filter((line) => line.tempId !== tempId));
  };

  const handleLineChange = (
    tempId: string,
    field: "purchasePrice" | "quantity",
    value: number
  ) => {
    setProductLines((prevLines) =>
      prevLines.map((line) =>
        line.tempId === tempId
          ? {
              ...line,
              [field]: value,
              total:
                field === "purchasePrice"
                  ? line.quantity * value
                  : value * line.purchasePrice,
            }
          : line
      )
    );
  };

  const handleProductChange = async (tempId: string, productId: number) => {
    setProductLines((prevLines) =>
      prevLines.map((line) =>
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
        setProductLines((prevLines) =>
          prevLines.map((line) =>
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
        console.error("Error al obtener el precio de compra:", error);
      }
    }
  };

  const renderCustomAddModal = (
    onSave: () => Promise<void>,
    onCancel: () => void
  ) => {
    const allLinesValid =
      productLines.length > 0 &&
      productLines.every(
        (line) =>
          line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0
      );
    const supplierValid = supplierId > 0;
    const totalGeneral = productLines.reduce(
      (sum, line) => sum + line.quantity * line.purchasePrice,
      0
    );

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
              {!supplierValid && (
                <div className="text-danger">Proveedor es obligatorio.</div>
              )}
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
            <div
              style={{
                borderRadius: "0.375rem",
                boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "visible",
                }}
              >
                <Table
                  style={{
                    tableLayout: "auto",
                    width: "100%",
                    minWidth: "600px",
                    marginBottom: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "25%",
                          padding: "12px",
                          textAlign: "left",
                        }}
                      >
                        PRODUCTO
                      </th>
                      <th
                        style={{
                          width: "20%",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        PRECIO DE COMPRA
                      </th>
                      <th
                        style={{
                          width: "20%",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        CANTIDAD
                      </th>
                      <th
                        style={{
                          width: "20%",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        TOTAL
                      </th>
                      <th
                        style={{
                          width: "15%",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLines.map((line) => (
                      <tr key={line.tempId}>
                        <td style={{ overflow: "visible" }}>
                          <SelectProduct
                            selectedValue={line.productId}
                            onChange={(newId: number) =>
                              handleProductChange(line.tempId, newId)
                            }
                          />
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Form.Control
                            type="number"
                            placeholder="Precio de compra"
                            value={line.purchasePrice || ""}
                            onChange={(e) =>
                              handleLineChange(
                                line.tempId,
                                "purchasePrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min={0}
                            step={0.01}
                            className="form-control form-control-sm text-center"
                            style={{
                              borderRadius: "0.375rem",
                              maxWidth: "120px",
                              margin: "0 auto",
                              border: "1px solid #ced4da",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Form.Control
                            type="number"
                            placeholder="Cantidad"
                            value={line.quantity || ""}
                            onChange={(e) => {
                              const q = parseFloat(e.target.value) || 0;
                              handleLineChange(line.tempId, "quantity", q);
                            }}
                            min={1}
                            className="form-control form-control-sm text-center"
                            style={{
                              borderRadius: "0.375rem",
                              maxWidth: "120px",
                              margin: "0 auto",
                              border: "1px solid #ced4da",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          ${line.total.toLocaleString("es-CO")}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Button
                            className="btn btn-danger p-0"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto",
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
                          No hay productos agregados. Haz clic en "Añadir
                          Producto".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
            {!allLinesValid && (
              <Alert variant="danger" className="mt-1">
                Ingrese todos los campos requeridos en los productos agregados.
              </Alert>
            )}
            <Button
              variant="outline-secondary"
              onClick={handleAddLine}
              className="btn-sm px-1 mt-1"
            >
              <span className="me-1">
                <AddIcon />
              </span>
              Añadir Producto
            </Button>
            <div className="text-end">
              <strong className="text-error fs-2 fw-bold">
                Total:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
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

  const customSave = async (
    onSuccess: () => void,
    onError: (error: any) => void
  ) => {
    if (supplierId <= 0 || productLines.length === 0) {
      onError(new Error("Seleccione un proveedor y al menos un producto."));
      return;
    }

    const invalidLine = productLines.find(
      (line) =>
        line.productId <= 0 || line.quantity <= 0 || line.purchasePrice < 0
    );
    if (invalidLine) {
      onError(new Error("Todos los productos deben tener datos válidos."));
      return;
    }

    try {
      const purchaseData = {
        supplierId,
        userId: currentUserId,
        date: date || getLocalDate(),
        observation: observation.trim(),
        transactionTotal: productLines.reduce(
          (sum, line) => sum + line.total,
          0
        ),
        purchaseStatus: "DEBE",
        products: productLines.map((line) => ({
          productId: line.productId,
          purchasePrice: line.purchasePrice,
          quantity: line.quantity,
          total: line.total,
        })),
      };
      await CreateShoppingSuppliers(purchaseData);

      setProductLines([]);
      setDate("");
      setObservation("");
      setSupplierId(0);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const renderCustomValidation = () => {
    return (
      supplierId > 0 &&
      productLines.length > 0 &&
      productLines.every(
        (line) =>
          line.productId > 0 && line.quantity > 0 && line.purchasePrice >= 0
      )
    );
  };

  const onAddModalOpen = () => {
    setDate(getLocalDate());
    setObservation("");
    setSupplierId(0);
    setProductLines([
      {
        tempId: Date.now().toString(),
        productId: 0,
        productName: "",
        purchasePrice: 0,
        quantity: 0,
        total: 0,
      },
    ]);
  };

  const onAddModalClose = () => {
    setProductLines([]);
    setDate("");
    setObservation("");
    setSupplierId(0);
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de compras a proveedores
          </h3>
          <FavoritoButton
            path="/purchaseSupplier"
            label="Compras de proveedores"
          />
        </div>
        <p>
          Administre las compras de proveedores, lleva control del registro de
          compras a cada proveedor.
        </p>
        <div className="card">
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <div
              className="pdf-button-wrapper4"
              style={{
                position: "absolute",
                top: "30px",
                right: "205px",
                zIndex: 10,
              }}
            >
              <Button
                variant="danger"
                onClick={handleDownloadPDF}
                disabled={!selectedShoppingSupplier}
                style={{
                  width: "33px",
                  height: "33px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: !selectedShoppingSupplier
                    ? "#6c757d"
                    : "#dc3545",
                  color: "white",
                }}
                title="Descargar ticket PDF de la compra seleccionada"
              >
                <PDFIcon />
              </Button>
            </div>

            <CRUDForm<ShoppingSuppliersTypes>
              fetchItems={(page, pageSize, filters, sortField, sortOrder) => {
                return GetShoppingSuppliers(
                  page,
                  pageSize,
                  filters,
                  sortField,
                  sortOrder
                ).then((data) => {
                  setShoppingSuppliersList(data);
                  return data;
                });
              }}
              searchItem={GetSearchShoppingSuppliers}
              createItem={CreateShoppingSuppliers}
              updateItem={async () => {}}
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
                selectedShoppingSupplier?.id === item.id ? "selected-row" : ""
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
          extraParams={{ shoppingSupplierId: selectedSupplierId ?? 0 }}
          setSelectedSupplierId={setSelectedSupplierId}
        />
      </div>
    </div>
  );
};

export default ShoppingSuppliers;
