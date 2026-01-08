import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { ProductDetailWarehouseRelocationTypes } from "../Types/ProductDetailWarehouseRelocationTypes";
import { ProductDetailWarehouseRelocationSortFieldMap } from "../Types/MapeoProductProductDetailWarehouseRelocation";
import {GetProductDetailWarehouseRelocation,GetSearchProductDetailWarehouseRelocation,} from "../API/ProductDetailWarehouseRelocationAPI";


interface ProductDetailWarehouseRelocationCRUDProps {
  extraParams: { shoppingSupplierId: number };
  onRowClick?: (item: ProductDetailWarehouseRelocationTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const ProductDetailWarehouseRelocationCRUD: React.FC<ProductDetailWarehouseRelocationCRUDProps> = ({ extraParams, onRowClick }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<ProductDetailWarehouseRelocationTypes | null>(null);

  const itemTemplate = (): ProductDetailWarehouseRelocationTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    quantity: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductDetailWarehouseRelocationTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: ProductDetailWarehouseRelocationTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "quantity",
        label: "Cantidad",
        required: true,
        render: (item) => item.quantity.toLocaleString('es-ES')
      },

    ];


  const handleRowSelection = (supplier: ProductDetailWarehouseRelocationTypes) => {
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
              <CRUDForm<ProductDetailWarehouseRelocationTypes>
                fetchItems={GetProductDetailWarehouseRelocation as any}
                searchItem={GetSearchProductDetailWarehouseRelocation}
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
                sortFieldMap={ProductDetailWarehouseRelocationSortFieldMap}
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

export default ProductDetailWarehouseRelocationCRUD;