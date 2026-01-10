import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProductTypes } from "../Types/InventoryTypes";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Table, Alert } from "react-bootstrap";
import { ProductSortFieldMap } from "../Types/MapeoInventoryTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import { AddIcon, DeleteIcon, PDFIcon } from "../Icons/Icons";
import { generatePDF, PDFConfig } from "../../Hooks/usePDFGeneratorTable";
import { GetCompanyById } from "../../Company/API/CompanyAPI";
import { CompanyType } from "../../Company/Types/Company";
import ProductSelect from "./SelectProduct";
import {
  GetProduct,
  UpdateIntorySubtract,
  GetSearchProduct,
  UpdateIntoryAdd,
  GetAllProductNoPage,
} from "../API/InventoryAPI";

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
  const [date, setDate] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [currentAction, setCurrentAction] = useState<"add" | "subtract" | null>(
    null
  );
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [lastSavedMovement, setLastSavedMovement] = useState<any>(null);

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
    {
      key: "productName",
      label: "Nombre del producto",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "price",
      label: "Precio de venta",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "description",
      label: "Medidas",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "id", label: "Producto", hidden: true, required: true },
    { key: "quantity", label: "Cantidad", required: true, regex: /^\d+$/ },
    {
      key: "categoryName",
      label: "Categoria",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "date",
      label: "Fecha",
      hidden: true,
      render: (item) => {
        const date = item.date
          ? new Date(item.date).toLocaleDateString()
          : "No disponible";
        return <span>{date}</span>;
      },
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
                padding: "6px 16px",
                borderRadius: "80px",
                color: "#fff",
                fontWeight: "500",
                display: "inline-block",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              {item.productStatus}
            </span>
          </div>
        );
      },
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
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
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

  const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStatusColor = (productStatus: string) => {
    switch (productStatus) {
      case "agotado":
         return "#dc3545";
      case "pocas unidades":
        return "#ffbf00";
      case "disponible":
         return "#28a745";
      default:
        return "transparent";
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(parseInt(storedUserId, 10));
    }
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await GetCompanyById(1);
        if (data) setCompanyData(data);
      } catch (error) {
        console.error("Error al cargar datos de la empresa:", error);
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const items = await GetAllProductNoPage();
        setInventoryData(items || []);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      }
    };
    loadInventory();
  }, []);

  const generarReporteGeneralInventario = () => {
    if (!companyData) {
      alert("Cargando datos de la empresa...");
      return;
    }

    if (inventoryData.length === 0) {
      alert("No hay productos en el inventario.");
      return;
    }

    const valorTotalInventario = inventoryData.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const config: PDFConfig = {
      header: {
        title: "INVENTARIO",
        showDate: true,
      },
      companyInfo: {
        nit: companyData.nit,
        direccion: companyData.address,
        celular: companyData.phone,
        email: companyData.email,
      },
      mainInfo: [
        { label: "Total de productos", value: inventoryData.length },
        {
          label: "Fecha del reporte",
          value: new Date().toLocaleString("es-CO"),
        },
      ],
      table: {
        columns: [
          { header: "PRODUCTO", dataKey: "productName", width: 50 },
          { header: "MEDIDAS", dataKey: "description", width: 40 },
          { header: "PRECIO VENTA", dataKey: "price", width: 40 },
          { header: "CANTIDAD", dataKey: "quantity", width: 40 },
        ],
        data: inventoryData.map((item) => ({
          productName: item.productName || "Sin nombre",
          description: item.description || "Sin descripcion",
          price: new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(item.price || 0),
          quantity: (item.quantity || 0).toLocaleString("es-CO"),
          totalValue: new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format((item.price || 0) * (item.quantity || 0)),
          productStatus: item.productStatus || "desconocido",
        })),
        showTotal: false,
        totalLabel: "VALOR TOTAL INVENTARIO",
        totalValue: new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(valorTotalInventario),
      },
      footer: {
        showGeneratedBy: true,
        generatedByText: `Generado por ${companyData.companyName}`,
        showPageNumber: true,
      },
      fileName: `Inventario_${new Date().toISOString().split("T")[0]}.pdf`,
    };

    generatePDF(config);
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

  const handleProductChange = (tempId: string, productId: number) => {
    setProductLines((prevLines) =>
      prevLines.map((line) =>
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

  const renderCustomActionModal = (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: ProductTypes | null,
    onFieldUpdate: (update: Partial<ProductTypes>) => void
  ) => {
    const actionKey = generalActionKey as "add" | "subtract";
    const totalGeneral = productLines.reduce(
      (sum, line) => sum + line.quantity * line.purchasePrice,
      0
    );

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
              <Form.Label>
                {actionKey === "add" ? "Observación" : "Motivo de la pérdida"}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder={`Ingrese ${
                  actionKey === "add" ? "observación" : "motivo"
                }`}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="flex-grow-1">
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
                        <td
                          style={{
                            padding: "12px",
                            verticalAlign: "middle",
                            overflow: "visible",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <div style={{ position: "relative", zIndex: 100 }}>
                            <ProductSelect
                              selectedValue={line.productId}
                              onChange={(newId: number) =>
                                handleProductChange(line.tempId, newId)
                              }
                            />
                          </div>
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

            {(productLines.length === 0 ||
              !productLines.every(
                (line) =>
                  line.productId > 0 &&
                  line.quantity > 0 &&
                  line.purchasePrice > 0
              )) && (
              <Alert variant="danger" className="mt-1">
                Ingrese todos los campos requeridos, en los productos agregados.
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

            <div className="text-end mt-3">
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
  if (
    !currentAction ||
    productLines.length === 0 ||
    !productLines.every(
      (line) =>
        line.productId > 0 && 
        line.quantity > 0 && 
        line.purchasePrice > 0  
    )
  ) {
    onError(
      new Error(
        "Ingrese todos los campos requeridos en las líneas de productos"
      )
    );
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

    productLines.forEach((line) => {
      const lineTotal = line.quantity * line.purchasePrice;
      runningTotal += lineTotal;

      productQuantity.push({
        id: line.productId,
        quantity: line.quantity,
        date: date || getLocalDate(),
        observation: observation || "",
        purchasePrice: line.purchasePrice,
        total: lineTotal,
        transactionTotal: runningTotal,
        userId: currentUserId,
      });
    });

    if (currentAction === "add") {
      await (UpdateIntoryAdd as any)({ productQuantity });
    } else if (currentAction === "subtract") {
      await (UpdateIntorySubtract as any)({ productQuantity });
    }

    setProductLines([]);
    setDate("");
    setObservation("");
    setCurrentAction(null);
    onSuccess();
    setLastSavedMovement({
      type: currentAction,
      date,
      observation,
    });
  } catch (error) {
    onError(error);
  }
};

const renderCustomActionValidation = () => {
  return (
    productLines.length > 0 &&
    productLines.every(
      (line) =>
        line.productId > 0 && 
        line.quantity > 0 && 
        line.purchasePrice > 0  
    )
  );
};
  const onActionModalOpen = (key: string) => {
    const actionKey = key as "add" | "subtract";
    setDate(getLocalDate());
    setObservation("");
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
    setCurrentAction(actionKey);
  };

  const onActionModalClose = () => {
    setProductLines([]);
    setDate("");
    setObservation("");
    setCurrentAction(null);
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de Inventarios
          </h3>
          <FavoritoButton path="/inventory" label="Inventario" />
        </div>
        <p>
          Administre el inventario, controle el stock y registre entradas o
          pérdidas de productos.
        </p>
        <div className="card">
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <div
              className="pdf-button-wrapper"
              style={{
                position: "absolute",
                top: "30px",
                right: "333px",
                zIndex: 10,
              }}
            >
              <Button
                variant="danger"
                onClick={generarReporteGeneralInventario}
                style={{
                  width: "33px",
                  height: "33px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  backgroundColor: "#dc3545",
                  border: "none",
                }}
                title="Descargar Inventario"
              >
                <PDFIcon />
              </Button>
            </div>
          </div>
          <div className="card-datatable table-responsive">
            <CRUDForm<ProductTypes>
              fetchItems={GetProduct}
              searchItem={GetSearchProduct}
              createItem={async () => {}}
              updateItem={async () => {}}
              deleteItem={async () => {}}
              generalItems={{
                add: UpdateIntoryAdd,
                subtract: UpdateIntorySubtract,
              }}
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
