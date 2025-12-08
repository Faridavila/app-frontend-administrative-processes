import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { ProductDetailSupplierTypes } from "../Types/ProductDetailSupplierTypes";
import { ProductDetailSupplierSortFieldMap } from "../Types/MapeoProductDetailSupplier";
import {GetProductDetailSupplier,GetSearchProductDetailSupplier,} from "../API/ProductDetailSupplierAPI";


interface ProductDetailSupplierCRUDProps {
  extraParams: { shoppingSupplierId: number };
  onRowClick?: (item: ProductDetailSupplierTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const ProductDetailSupplierCRUD: React.FC<ProductDetailSupplierCRUDProps> = ({ extraParams, onRowClick }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<ProductDetailSupplierTypes | null>(null);

  const itemTemplate = (): ProductDetailSupplierTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    purchasePrice: 0,
    quantity: 0,
    total: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductDetailSupplierTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: ProductDetailSupplierTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      { key: "purchasePrice", label: "Precio de compra",
        render: (item) => item.purchasePrice.toLocaleString('es-ES')},
      {
        key: "quantity",
        label: "Cantidad",
        required: true,
        render: (item) => item.quantity.toLocaleString('es-ES')
      },
      {
        key: "total",
        label: "Total",
        required: true,
        hiddenInCreate: true,
        hiddenInEdit: true,
        render: (item) => item.total.toLocaleString('es-ES')
      },
    ];


  const handleRowSelection = (supplier: ProductDetailSupplierTypes) => {
    setSelectedSupplierId(supplier);
    if (onRowClick) {
      onRowClick(supplier);
    }
  };


  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{ padding: '0' }}>
              <h2 className="product-details-title" style={{ fontWeight: 'bold', fontSize: '22px' }}>Detalles del productos</h2>
              <CRUDForm<ProductDetailSupplierTypes>
                fetchItems={GetProductDetailSupplier as any}
                searchItem={GetSearchProductDetailSupplier}
                createItem={async () => {}}
                updateItem={async () => {}}
                deleteItem={async () => {}}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={2}
                hiddenDownloadButton={false}
                hiddenAddButton={false}
                hiddenEditButton={false}
                hiddenDeleteButton={false}
                sortFieldMap={ProductDetailSupplierSortFieldMap}
                pageTitle="Productos detalle historial inventario"
                extraParams={extraParams}
                onRowClick={handleRowSelection}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailSupplierCRUD;