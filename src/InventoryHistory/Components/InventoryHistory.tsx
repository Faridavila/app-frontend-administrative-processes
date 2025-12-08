import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState, useEffect } from "react";
import { InventoryHistoryTypes } from "../Types/InventoryHistoryTypes";
import { InventoryHistorySortFieldMap } from "../Types/MapeoInventoryHistoryTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import { GetInventoryHistory, GetSearchInventoryHistory } from "../API/InventoryHistoryAPI";
import ProductDetailsCRUD from "../../ProductDetails/Components/ProductDetails";
import { GetProductDetails } from "../../ProductDetails/API/ProductDetailsAPI";
import { Button } from 'react-bootstrap';
import { PDFIcon } from "../Icons/Icons";
import { generatePDF, PDFConfig } from '../../Hooks/usePDFGeneratorTable';
import { GetCompanyById } from "../../Company/API/CompanyAPI";
import { CompanyType } from "../../Company/Types/Company";

interface InventoryHistoryCRUDProps {
  onRowClick?: (item: InventoryHistoryTypes) => void;
}

const InventoryHistory: React.FC<InventoryHistoryCRUDProps> = ({ onRowClick }) => {
  const [selectedhistoryInventory, setSelectedHistoryInventory] = useState<InventoryHistoryTypes | null>(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  const itemTemplate = (): InventoryHistoryTypes => ({
    id: 0,
    productName: "",
    transactionType: "",
    quantity: 0,
    date: "",
    typeUser: "",
    userName: "",
    observation: "",
    value: 0,
    status: "",
  });


  const columns: {
    key: keyof InventoryHistoryTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof InventoryHistoryTypes;
    validationMessage?: string;
    render?: (item: InventoryHistoryTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "productName", label: "Nombre del producto", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "typeUser", label: "Tipo de usuario", hiddenInCreate: true, hiddenInEdit: true },
      { key: "userName", label: "Nombre de usuario", hiddenInCreate: true, hiddenInEdit: true },
      { key: "date", label: "Fecha", hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "transactionType",
        label: "Tipo de transacción",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => {
          const statusColor = getTransactionTypeColor(item.transactionType);
          return (
            <span
              style={{
                backgroundColor: statusColor,
                padding: '5px',
                borderRadius: '5px',
                color: '#fff',
              }}
            >
              {item.transactionType}
            </span>
          );
        }
      },
      { key: "quantity", label: "Cantidad", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "value", label: "Valor", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      {
        key: "observation",
        label: "Observación",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => {
          const observation = item.observation || "Sin observación";
          return <span>{observation}</span>;
        }
      }
    ];

  const getTransactionTypeColor = (transactionType: string) => {
    switch (transactionType) {
      case "SALIDA":
      case "PERDIDA":
        return "red";
      case "ENTRADA":
      case "ENTRADA PROVEEDOR":
        return "green";
      default:
        return "transparent";
    }
  };


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
    if (selectedInventoryId) {
      loadProductDetails(selectedInventoryId);
    } else {
      setProductDetails([]);
    }
  }, [selectedInventoryId]);

  const loadProductDetails = async (inventoryId: number) => {
    try {
      const details = await GetProductDetails(0, 100000, {}, 'ASC', undefined, { inventoryId });
      setProductDetails(details || []);
    } catch (error) {
      console.error('Error al cargar detalles de productos:', error);
      setProductDetails([]);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedhistoryInventory) {
      alert('Por favor, seleccione un registro de historial primero');
      return;
    }

    if (productDetails.length === 0) {
      alert('El registro seleccionado no tiene detalles de productos');
      return;
    }

    if (!companyData) {
      alert('No se pudieron cargar los datos de la empresa');
      return;
    }

    const total = productDetails.reduce((sum, detail) => {
      return sum + (parseFloat(detail.total || '0'));
    }, 0);

    const pdfConfig: PDFConfig = {
      header: {
        title: 'REPORTE DE HISTORIAL DE INVENTARIO',
        subtitle: 'Detalle de Movimientos',
        showDate: true,
      },
      companyInfo: {
        nit: companyData.nit,
        direccion: companyData.address,
        celular: companyData.phone,
        email: companyData.email,
      },
      mainInfo: [
        { label: 'Fecha', value: new Date().toLocaleDateString('es-CO') },
        { label: 'Tipo de Transacción', value: selectedhistoryInventory.transactionType || 'N/A' },
        { label: 'Tipo de Usuario', value: selectedhistoryInventory.typeUser || 'N/A' },
        { label: 'Usuario', value: selectedhistoryInventory.userName || 'N/A' },
        { label: 'Fecha de Movimiento', value: selectedhistoryInventory.date || 'N/A' },
        { label: 'Observación', value: selectedhistoryInventory.observation || 'Sin observación' },
      ],
      table: {
        columns: [
          { header: 'PRODUCTO', dataKey: 'productName', width: 50 },
          { header: 'PRECIO DE COMPRA', dataKey: 'purchasePrice', width: 45 },
          { header: 'CANTIDAD', dataKey: 'quantity', width: 30 },
          { header: 'TOTAL', dataKey: 'total', width: 45 },
        ],
        data: productDetails.map(detail => ({
          id: detail.id,
          productName: detail.productName || 'N/A',
          purchasePrice: `${parseFloat(detail.purchasePrice || 0).toLocaleString('es-CO')}`,
          quantity: detail.quantity || 0,
          total: `${parseFloat(detail.total || 0).toLocaleString('es-CO')}`,
        })),
        showTotal: true,
        totalLabel: 'TOTAL ',
        totalValue: `${total.toLocaleString('es-CO')}`,
      },
      footer: {
        showPageNumber: true,
        showGeneratedBy: true,
        generatedByText: `Hecho por ${companyData.companyName}`,
      },
      fileName: `Historial_Inventario_${(selectedhistoryInventory.productName || 'reporte').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    };

    generatePDF(pdfConfig);
  };

  const handleRowSelection = (inventoryHistory: InventoryHistoryTypes) => {
    setSelectedHistoryInventory(inventoryHistory);
    setSelectedInventoryId(inventoryHistory.id);
    if (onRowClick) {
      onRowClick(inventoryHistory);
    }
  };


  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Historial de Inventarios
          </h3>
          <FavoritoButton path="/inventoryHistory" label="Historial de inventario" />
        </div>
        <p>
          Consulte el historial de movimientos de inventario filtrados por rango de fechas.
        </p>
        <div className="mb-1">
          <label className="form-label d-block mb-1">Rango de Fechas</label>

          <div className="date-range-container d-flex gap-2">
            <input
              type="date"
              className="form-control date-input-responsive"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="Fecha desde"
            />
            <input
              type="date"
              className="form-control date-input-responsive"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="Fecha hasta"
            />
          </div>
        </div>
        <div className="card">
         <div style={{ position: 'relative', marginBottom: '1rem' }}>
             <div className="pdf-button-wrapper2" style={{
              position: 'absolute',
              top: '30px',
              right: '83px',
              zIndex: 10
            }}>
              <Button
                variant="danger"
                onClick={handleDownloadPDF}
                disabled={!selectedhistoryInventory || productDetails.length === 0}
                style={{
                  width: '33px',
                  height: '33px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: !selectedhistoryInventory || productDetails.length === 0 ? '#6c757d' : '#dc3545',
                  color: 'white'
                }}
                title="Descargar PDF del historial seleccionado"
              >
                <PDFIcon />
              </Button>
            </div>

            <CRUDForm<InventoryHistoryTypes>
              fetchItems={GetInventoryHistory}
              searchItem={GetSearchInventoryHistory}
              createItem={async () => { }}
              updateItem={async () => { }}
              deleteItem={async () => { }}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={2}
              hiddenAddButton={false}
              hiddenAddPlusButton={false}
              hiddenSubtractButton={false}
              hiddenEditButton={false}
              hiddenDeleteButton={false}
              hiddenDownloadButton={false}
              onRowClick={handleRowSelection}
              sortFieldMap={InventoryHistorySortFieldMap}
              pageTitle="historial de inventarios"
              rowClassName={(item: InventoryHistoryTypes) => selectedInventoryId === item.id ? 'selected-row' : ''}
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
        <ProductDetailsCRUD
          extraParams={{ inventoryId: selectedInventoryId ?? 0 }}
          setSelectedInventory={setSelectedInventoryId}
        />
      </div>
    </div>
  );
};

export default InventoryHistory;