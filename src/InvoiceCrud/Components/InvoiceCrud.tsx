import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  InvoiceCrudTypes,
  InvoiceDetailResponse,
} from "../Types/InvoiceCrudTypes";
import {
  GetInvoice,
  DeleteInvoice,
  GetGenerateInvoiceById,
  GetSearchInvoiceCrud,
} from "../API/InvoiceCrudAPI";
import { AddIcon, SeeIcon, PDFIcon } from "../Icons/Icons";
import { Button, Spinner } from "react-bootstrap";
import { InvoiceCrudSortFieldMap } from "../Types/MapeoInvoiceCrud";
import { useNavigate } from "react-router-dom";
import {
  generateInvoicePDF,
  PDFInvoiceConfig,
} from "../../Hooks/useInvoicePDF";
import { GetCompanyById } from "../../Company/API/CompanyAPI";

const InvoiceCrud = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const MySwal = withReactContent(Swal);

  const formatDateTimeColombia = (dateString: string) => {
    if (!dateString) return { date: "", time: "" };

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const itemTemplate = (): InvoiceCrudTypes => ({
    id: 0,
    invoiceNumber: 0,
    customerId: 0,
    customerName: "",
    userName: "",
    paymentMethodId: 0,
    paymentMethodName: "",
    total: 0,
    invoiceDate: "",
    statusBill: "",
    status: "",
  });

  const columns: {
    key: keyof InvoiceCrudTypes;
    label: string;
    hidden?: boolean;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    type?: "text" | "number" | "image" | "password" | "date";
    render?: (item: InvoiceCrudTypes) => React.ReactNode;
  }[] = [
    {
      key: "id",
      label: "N° Factura",
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
    {
      key: "invoiceNumber",
      label: "N° Factura",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    { key: "customerId", label: "Cliente", hidden: true },
    {
      key: "customerName",
      label: "Cliente",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "userName",
      label: "Cajero",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "paymentMethodName",
      label: "Método de pago",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "invoiceDate",
      label: "Fecha",
      hiddenInCreate: true,
      hiddenInEdit: true,
      type: "date",
      render: (item) => {
        const { date, time } = formatDateTimeColombia(item.invoiceDate);
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontWeight: "500", fontSize: "14px" }}>{date}</span>
            <span style={{ fontSize: "12px", color: "#6c757d" }}>{time}</span>
          </div>
        );
      },
    },
    {
      key: "statusBill",
      label: "Estado",
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (item) => {
        const statusColor = getStatusColor(item.statusBill);
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
              {item.statusBill}
            </span>
          </div>
        );
      },
    },
    { key: "total", label: "Total", hiddenInCreate: true, hiddenInEdit: true },
  ];

  const getStatusColor = (statusBill: string) => {
    switch (statusBill) {
      case "PAGADO":
        return "#dc3545";
      case "ABONO":
        return "#14d2f9";
      case "PENDIENTE":
        return "#28a745";
      case "INACTIVO":
        return "#ecaa03";
      default:
        return "#6c757d";
    }
  };

  const handleNuevaFactura = () => {
    navigate("/new-invoice");
  };

  const handleVerDetalle = async () => {
    if (!selectedInvoiceId) return;

    setLoadingDetail(true);
    try {
      const invoiceData = await GetGenerateInvoiceById(selectedInvoiceId);
      localStorage.setItem("currentInvoiceDetail", JSON.stringify(invoiceData));
      navigate(`/invoice-detail/${selectedInvoiceId}`);
    } catch (error) {
      MySwal.fire("Error", "No se pudo cargar la factura", "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDescargarPDF = async () => {
    if (!selectedInvoiceId || loadingPDF) return;

    setLoadingPDF(true);

    // ✅ Esperar antes de empezar
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      console.log("=== INICIANDO GENERACIÓN DE PDF ===");
      console.log("Invoice ID:", selectedInvoiceId);

      const response = await GetGenerateInvoiceById(selectedInvoiceId);
      const invoiceData = response as unknown as InvoiceDetailResponse;
      const companyData = await GetCompanyById(1);

      const valorBruto = invoiceData.subtotal || 0;
      const descuentoTotal = invoiceData.totalDiscount || 0;
      const costoTransporte = invoiceData.deliveryCost || 0;
      const total = invoiceData.total || 0;

      let tipoPago = "contado";
      if (invoiceData.statusBill === "ABONO") tipoPago = "abono";
      else if (invoiceData.statusBill === "PENDIENTE") tipoPago = "credito";

      const config: PDFInvoiceConfig = {
        companyInfo: {
          logo:
            companyData?.image ||
            "https://res.cloudinary.com/dgtdyrtss/image/upload/v1779911682/empresas/Logo_nuevo_dv0ufw.png",
          logoWidth: 40,
          logoHeight: 40,
          name: invoiceData.statusBill === "COTIZACION" ? "COTIZACION" : "",
          title: "DOCUMENTO NO VALIDO COMO FACTURA DE VENTA",
          direccion: companyData?.address || "",
          celular: companyData?.phone || "",
          email: companyData?.email || "",
        },
        mainInfo: {
          fecha: invoiceData.invoiceDate
            ? new Date(invoiceData.invoiceDate).toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              })
            : new Date().toLocaleString("es-CO", {
                timeZone: "America/Bogota",
              }),
          invoiceNumber: invoiceData.invoiceNumber || "",
          cashier: invoiceData.userName || "Administrador",
          clientIdentification:
            invoiceData.identification || "Sin identificación",
          cliente: invoiceData.customerName || "",
          ...( invoiceData.deliveryType?.toLowerCase() === "llevar" && {
            direccion: invoiceData.address || "Sin dirección",
            barrio: invoiceData.neighborhood || "Sin barrio",
            celular: invoiceData.phone || "Sin celular",
          }),
        },
        products: (invoiceData.invoiceDetails || []).map((detail) => ({
          nombre: detail.productName || "Producto",
          cantidad: detail.quantity || 0,
          precio: detail.unitPrice || 0,
          total: detail.total || 0,
        })),
        summary: {
          valorBruto,
          descuentoTotal,
          costoTransporte,
          ibua: 0,
          total,
        },
        payment: {
          metodoPago: invoiceData.paymentMethodName || "Efectivo",
          efectivoRecibido: invoiceData.cashReceived || undefined,

          tipoPago,
          abono: invoiceData.initialPayment || 0,
          restante: invoiceData.remainingBalance || 0,
          fechaVencimiento: invoiceData.dueDate || undefined,
        },
        entrega:
          invoiceData.deliveryType?.toLowerCase() === "llevar"
            ? "llevar"
            : "recoger",
        observacion: invoiceData.observations || "",
        footer: {
          showGeneratedBy: true,
          generatedByText: `Hecho en Colombia por BizManage - Cel:3172116796`,
          showPageNumber: false,
        },
        fileName: `Factura_${invoiceData.invoiceNumber || selectedInvoiceId}.pdf`,
      };

      console.log("Config del PDF:", config);
      await generateInvoicePDF(config);
      console.log("=== PDF GENERADO EXITOSAMENTE ===");

      setTimeout(() => {
        MySwal.fire({
          icon: "success",
          title: "PDF Generado",
          text: "El PDF se ha abierto para imprimir",
          timer: 1000,
          showConfirmButton: false,
        });
      }, 500);
    } catch (error: any) {
      console.error("=== ERROR AL GENERAR PDF ===", error);
      MySwal.fire(
        "Error",
        error?.message || "No se pudo generar el PDF de la factura",
        "error",
      );
    } finally {
      setTimeout(() => setLoadingPDF(false), 1500);
    }
  };
  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
          Facturas
        </h3>
        <p>
          Administre las facturas mediante la creación o anulación de registros.
        </p>

        <div className="card">
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <div
              className="add-invoice-button-wrapper"
              style={{
                position: "absolute",
                top: "30px",
                right: "120px",
                zIndex: 10,
              }}
            >
              <Button
                variant="primary"
                onClick={handleNuevaFactura}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                title="Crear nueva factura"
              >
                <AddIcon />
              </Button>
            </div>

            <div
              className="see-invoice-button-wrapper"
              style={{
                position: "absolute",
                top: "30px",
                right: "200px",
                zIndex: 10,
              }}
            >
              <Button
                variant={selectedInvoiceId ? "info" : "secondary"}
                onClick={handleVerDetalle}
                disabled={!selectedInvoiceId || loadingDetail}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  opacity: selectedInvoiceId ? 1 : 0.5,
                }}
                title="Ver detalle de factura"
              >
                {loadingDetail ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <SeeIcon />
                )}
              </Button>
            </div>

            <div
              className="pdf-button-wrapper3"
              style={{
                position: "absolute",
                top: "30px",
                right: "240px",
                zIndex: 10,
              }}
            >
              <Button
                variant="danger"
                onClick={handleDescargarPDF}
                disabled={!selectedInvoiceId || loadingPDF}
                style={{
                  width: "33px",
                  height: "33px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  opacity: selectedInvoiceId ? 1 : 0.5,
                }}
                title="Descargar factura"
              >
                {loadingPDF ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <PDFIcon />
                )}
              </Button>
            </div>

            <CRUDForm<InvoiceCrudTypes>
              fetchItems={GetInvoice}
              searchItem={GetSearchInvoiceCrud}
              createItem={async () => {}}
              updateItem={async () => {}}
              deleteItem={DeleteInvoice}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              hiddenAddButton={false}
              hiddenEditButton={false}
              deleteButtonOrder={4}
              sortFieldMap={InvoiceCrudSortFieldMap}
              pageTitle="Facturas"
              onRowClick={(item) => setSelectedInvoiceId(item.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCrud;
