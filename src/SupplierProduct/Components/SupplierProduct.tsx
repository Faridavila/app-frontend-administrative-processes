// SupplierProductsCRUD.tsx
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col} from 'react-bootstrap';
import { SupplierProductTypes } from "../Types/SupplierProductTypes";
import { SupplierProductSortFieldMap } from "../Types/MapeoSupplierProduct";
import { GetSupplierProducts, GetSearchSupplierProducts } from "../API/SupplierProductAPI";

interface SupplierProductCRUDProps {
  extraParams: { supplierId: number };
  onRowClick?: (item: SupplierProductTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const SupplierProductsCRUD: React.FC<SupplierProductCRUDProps> = ({ extraParams, onRowClick }) => {
  const [selectedMicroRoutes, setSelectedshoppingSupplierId] = useState<SupplierProductTypes | null>(null);
  
  const itemTemplate = (): SupplierProductTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    purchasePrice: "",
    status: "",
  });

  const columns: {
    key: keyof SupplierProductTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "purchasePrice",
        label: "Precio de compra",
        required: true,
      }
    ];

  const handleRowSelection = (supplier: SupplierProductTypes) => {
    setSelectedshoppingSupplierId(supplier);
    if (onRowClick) {
      onRowClick(supplier);
    }
  };

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{  padding: '0' }}>
              <h2 className="product-details-title" style={{ fontWeight: 'bold', fontSize: '22px' }}>Productos precio de compra</h2>
              <CRUDForm<SupplierProductTypes>
                fetchItems={GetSupplierProducts}
                searchItem={GetSearchSupplierProducts}
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
                sortFieldMap={SupplierProductSortFieldMap}
                pageTitle="Porductos precio de compra proveedor"
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

export default SupplierProductsCRUD;