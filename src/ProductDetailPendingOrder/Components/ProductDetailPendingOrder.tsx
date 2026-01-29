import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { ProductDetailPendingOrderTypes } from "../Types/ProductDetailPendingOrderTypes";
import { ProductDetailPendingOrderSortFieldMap } from "../Types/MapeoProductDetailPendingOrder";
import {GetProductDetailPendingOrder,GetSearchProductDetailPendingOrder,} from "../API/ProductDetailPendingOrderAPI";


interface ProductDetailPendingOrderCRUDProps {
  extraParams: { pendingOrderId: number };
  onRowClick?: (item: ProductDetailPendingOrderTypes) => void;
  setSelectedPendingOrderId: (id: number) => void;
}

const ProductDetailPendingOrderCRUD: React.FC<ProductDetailPendingOrderCRUDProps> = ({ extraParams, onRowClick }) => {
  const [selectedPendingOrderId, setSelectedPendingOrderId] = useState<ProductDetailPendingOrderTypes | null>(null);

  const itemTemplate = (): ProductDetailPendingOrderTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    salePrice: 0,
    quantity: 0,
    discount: 0,
    total: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductDetailPendingOrderTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: ProductDetailPendingOrderTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      { key: "salePrice", label: "Precio de venta",
        render: (item) => item.salePrice.toLocaleString('es-ES')},
      {
        key: "quantity",
        label: "Cantidad",
        required: true,
        render: (item) => item.quantity.toLocaleString('es-ES')
      },
       {
        key: "discount",
        label: "Descuento",
        required: true,
         render: (item: ProductDetailPendingOrderTypes) => {
        return item.discount || "No aplica";
      },
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


  const handleRowSelection = (pendingOrder: ProductDetailPendingOrderTypes) => {
    setSelectedPendingOrderId(pendingOrder);
    if (onRowClick) {
      onRowClick(pendingOrder);
    }
  };


  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{ padding: '0' }}>
              <h2 className="product-details-title" style={{ fontWeight: 'bold', fontSize: '22px' }}>Detalles del productos</h2>
              <CRUDForm<ProductDetailPendingOrderTypes>
                fetchItems={GetProductDetailPendingOrder as any}
                searchItem={GetSearchProductDetailPendingOrder}
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
                sortFieldMap={ProductDetailPendingOrderSortFieldMap}
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

export default ProductDetailPendingOrderCRUD;