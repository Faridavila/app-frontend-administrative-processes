import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col} from 'react-bootstrap';
import { ProductDetailSupplierTypes } from "../Types/ProductDetailSupplierTypes";
import { ProductDetailSupplierSortFieldMap } from "../Types/MapeoProductDetailSupplier";
import {
  GetProductDetailSupplier,
  CreateProductDetailSupplier,
  UpdateProductDetailSupplier,
  DeleteProductDetailSupplier,
  GetSearchProductDetailSupplier,
} from "../API/ProductDetailSupplierAPI";



interface ProductDetailSupplierCRUDProps {
  extraParams: { supplierId: number };
  onRowClick?: (item: ProductDetailSupplierTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const ProductDetailSupplierCRUD: React.FC<ProductDetailSupplierCRUDProps> = ({ extraParams, onRowClick, setSelectedSupplierId }) => {
  const [selectedMicroRoutes, setSelectedMicroRoutes] = useState<ProductDetailSupplierTypes | null>(null);

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
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true,hidden: true },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      { key: "purchasePrice", label: "Precio de compra", required: true },
      { key: "quantity", label: "Cantidad", required: true },
      { key: "total", label: "Total", required: true, hiddenInCreate: true, hiddenInEdit: true },
    ];


  const handleRowSelection = (supplier: ProductDetailSupplierTypes) => {
    setSelectedMicroRoutes(supplier);
    if (onRowClick) {
      onRowClick(supplier);
    }
  };


  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{ maxHeight: '600px', padding: '0' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '22px' }}>Detalles del productos</h2>
              <CRUDForm<ProductDetailSupplierTypes>
                fetchItems={GetProductDetailSupplier}
                searchItem={GetSearchProductDetailSupplier}
                createItem={CreateProductDetailSupplier}
                updateItem={UpdateProductDetailSupplier}
                deleteItem={DeleteProductDetailSupplier}
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