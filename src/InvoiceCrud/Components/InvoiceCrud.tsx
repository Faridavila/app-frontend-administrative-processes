import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { InvoiceCrudTypes } from "../Types/InvoiceCrudTypes";
import { GetInvoiceCrud, GetGenerateInvoiceById } from "../API/InvoiceCrudAPI";
import { AddIcon, SeeIcon } from '../Icons/Icons';
import { Button, Spinner } from 'react-bootstrap';
import { InvoiceCrudSortFieldMap } from "../Types/MapeoInvoiceCrud";
import { useNavigate } from 'react-router-dom';

const InvoiceCrud = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const MySwal = withReactContent(Swal);

  const itemTemplate = (): InvoiceCrudTypes => ({
    id: 0,
    customerId: 0,
    customerName: "",
    cashierName: "",
    paymentMethodName: "",
    totalPurchase: 0,
    date: "",
    statusOrder: "",
    status: "",
  });

  const columns: {
    key: keyof InvoiceCrudTypes;
    label: string;
    hidden?: boolean;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: InvoiceCrudTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "N° Factura", hiddenInCreate: true, hiddenInEdit: true },
      { key: "customerId", label: "Cliente", hidden: true },
      { key: "customerName", label: "Cliente", hiddenInCreate: true, hiddenInEdit: true },
      { key: "cashierName", label: "Cajero", hiddenInCreate: true, hiddenInEdit: true },
      { key: "paymentMethodName", label: "Método de pago", hiddenInCreate: true, hiddenInEdit: true },
      { key: "date", label: "Fecha", hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "statusOrder",
        label: "Estado",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item: InvoiceCrudTypes) => {
          const statusColor = getStatusColor(item.status);
          return (
            <span
              style={{
                backgroundColor: statusColor,
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              {item.status}
            </span>
          );
        }
      },
      { key: "totalPurchase", label: "Total", hiddenInCreate: true, hiddenInEdit: true },
    ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "#ffc107";
      case "Inicio": return "#17a2b8";
      case "Cargado": return "#28a745";
      default: return "#6c757d";
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
      localStorage.setItem('currentInvoiceDetail', JSON.stringify(invoiceData));
      navigate(`/invoice-detail/${selectedInvoiceId}`);
    } catch (error) {
      MySwal.fire('Error', 'No se pudo cargar la factura', 'error');
    } finally {
      setLoadingDetail(false);
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
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
             <div className="add-invoice-button-wrapper" 
             style={{ position: 'absolute', top: '30px', right: '120px', zIndex: 10 }}>
              <Button
                variant="primary"
                onClick={handleNuevaFactura}
                style={{
                  width: '32px', height: '32px', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', borderRadius: '8px', color: 'white'
                }}
                title="Crear nueva factura"
              >
                <AddIcon />
              </Button>
            </div>

            {/* Botón Ver Detalle */}
            <div className="see-invoice-button-wrapper" style={{ position: 'absolute', top: '30px', right: '200px', zIndex: 10 }}>
              <Button
                variant={selectedInvoiceId ? "info" : "secondary"}
                onClick={handleVerDetalle}
                disabled={!selectedInvoiceId || loadingDetail}
                style={{
                  width: '32px', height: '32px', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', borderRadius: '8px', color: 'white',
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

            {/* Tabla con selección de fila */}
            <CRUDForm<InvoiceCrudTypes>
              fetchItems={GetInvoiceCrud}
              searchItem={async () => []}
              createItem={async () => { }}
              updateItem={async () => { }}
              deleteItem={async () => { }}
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