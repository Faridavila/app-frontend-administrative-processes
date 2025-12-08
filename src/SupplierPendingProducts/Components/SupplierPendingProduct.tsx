import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { SupplierPendingProductTypes } from "../Types/SupplierPendingProductTypes";
import { SupplierPendingProductSortFieldMap } from "../Types/MapeoSupplierPendingProduct";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import {GetSupplierPendingProduct,GetSearchSupplierPendingProduct} from "../API/SupplierPendingProductAPI";
import React, { useState } from 'react';
import ProductPendingDetailSupplierCRUD from "../../ProductPendingDetailSupplier/Components/ProductPendingDetailSupplier";

interface SupplierPendingProductCRUDProps {
  onRowClick?: (item: SupplierPendingProductTypes) => void;
}


const SupplierPendingProduct: React.FC<SupplierPendingProductCRUDProps> = ({ onRowClick }) => {
  const [selectedSupplierPendingProduct, setSelectedSupplierPendingProduct] = useState<SupplierPendingProductTypes | null>(null);
  const [selectedSupplierPendingProductId, setSelectedSupplierPendingProductId] = useState<number | null>(null);

  const itemTemplate = (): SupplierPendingProductTypes => ({
    id: 0,
    supplierId: 0,
    supplierName: "",
    productId: 0,
    productName: "",
    purchasePrice: 0,
    purchaseStatus: "",
    remainingAmount:0,
    warehouseId:0,
    warehouseName: "",
    quantity:0,
    observation: "",
    date: new Date().toISOString().split("T")[0],
    total:0,
    status: "",
  });

  const getStatusColor = (SupplierPendingProductStatus: string) => {
    console.log("SupplierPendingProduct Status:", SupplierPendingProductStatus);
    switch (SupplierPendingProductStatus) {
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

    const handleRowSelection = (supplierPendingProduct: SupplierPendingProductTypes) => {
      setSelectedSupplierPendingProduct(supplierPendingProduct);
      setSelectedSupplierPendingProductId(supplierPendingProduct.id);
      if (onRowClick) {
        onRowClick(supplierPendingProduct);
      }
    };

  const columns: {
    key: keyof SupplierPendingProductTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof SupplierPendingProductTypes;
    validationMessage?: string;
    render?: (item: SupplierPendingProductTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
      { key: "id", label: "Proveedor",hidden: true, required:true },
      { key: "supplierName", label: "Proveedor", hiddenInCreate: true, hiddenInEdit: true,},
       { key: "warehouseId", label: "Bodega",hidden: true, required:true },
      { key: "warehouseName", label: "Bodega", hiddenInCreate: true, hiddenInEdit: true,},
      { key: "remainingAmount", label: "cantidad restante", hiddenInCreate: true, hiddenInEdit: true, hidden: true},
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
      },
      {
        key: "purchaseStatus",
        label: "Estado",
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => {
          console.log("Rendering SupplierPendingProductStatus:", item.purchaseStatus);
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
      { key: "productId", label: "Producto", hidden: true, required:true},
      { key: "productName", label: "Producto", hiddenInCreate: true, hiddenInEdit: true,hidden: true,},
      { key: "purchasePrice", label: "Precio de compra", hidden:true},
      { key: "quantity", label: "Cantidad",required: true, hidden: true,regex: /^\d+$/ },
      { key: "total", label: "Total",required: true, hidden: true, regex: /^\d+$/ },
    ];


  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Materiales pendientes de proveedores
          </h3>
          <FavoritoButton path="/SupplierPendingProduct" label="SupplierPendingProductos" />
        </div>
        <p>
          Administre el control de materiales pentientes de proveedores.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<SupplierPendingProductTypes>
              fetchItems={GetSupplierPendingProduct}
              searchItem={GetSearchSupplierPendingProduct}
              createItem={async () => {}}
              updateItem={async () => {}}
              deleteItem={async () => {}}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              hiddenAddButton={false}
              hiddenEditButton={false}
              hiddenDeleteButton={false}
              onRowClick={handleRowSelection}
              sortFieldMap={SupplierPendingProductSortFieldMap}
              pageTitle="Compras"
            />
          </div>
        </div>
      </div>
      <style>{`.selected-row { background-color: #cc322d !important; color: white; }`}</style>

      <div className="card mt-1">
        <ProductPendingDetailSupplierCRUD
          extraParams={{ pendingDetailSupplierId: selectedSupplierPendingProductId ?? 0 }}
          setSelectedPendingDetailSupplierId={setSelectedSupplierPendingProductId}
        />
      </div>
    </div>
  );
};
export default SupplierPendingProduct;