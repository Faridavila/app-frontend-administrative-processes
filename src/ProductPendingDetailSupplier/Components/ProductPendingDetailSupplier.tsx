import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col} from 'react-bootstrap';
import { ProductPendingDetailSupplierTypes } from "../Types/ProductPendingDetailSupplierTypes";
import { ProductPendingDetailSupplierSortFieldMap } from "../Types/MapeoProductPendingDetailSupplier";
import {
  GetProductPendingDetailSupplier,
  CreateProductPendingDetailSupplier,
  UpdateProductPendingDetailSupplier,
  DeleteProductPendingDetailSupplier,
  GetSearchProductPendingDetailSupplier,
} from "../API/ProductPendingDetailSupplierAPI";



interface ProductPendingDetailSupplierCRUDProps {
  extraParams: { supplierId: number };
  onRowClick?: (item: ProductPendingDetailSupplierTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const ProductPendingDetailSupplierCRUD: React.FC<ProductPendingDetailSupplierCRUDProps> = ({ extraParams, onRowClick, setSelectedSupplierId }) => {
  const [selectedMicroRoutes, setSelectedMicroRoutes] = useState<ProductPendingDetailSupplierTypes | null>(null);

  const itemTemplate = (): ProductPendingDetailSupplierTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    remainingAmount: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductPendingDetailSupplierTypes;
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
      { key: "remainingAmount", label: "Cantidad Pendiente", required: true },
    ];


  const handleRowSelection = (supplier: ProductPendingDetailSupplierTypes) => {
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
              <CRUDForm<ProductPendingDetailSupplierTypes>
                fetchItems={GetProductPendingDetailSupplier}
                searchItem={GetSearchProductPendingDetailSupplier}
                createItem={CreateProductPendingDetailSupplier}
                updateItem={UpdateProductPendingDetailSupplier}
                deleteItem={DeleteProductPendingDetailSupplier}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={2}
                hiddenDownloadButton={false}
                hiddenAddButton={false}
                hiddenEditButton={false}
                hiddenDeleteButton={false}
                sortFieldMap={ProductPendingDetailSupplierSortFieldMap}
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

export default ProductPendingDetailSupplierCRUD;