import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col} from 'react-bootstrap';
import { ProductDetailsTypes } from "../Types/ProductDetailsTypes";
import { ProductDetailsSortFieldMap } from "../Types/MapeoProductDetails";
import { GetProductDetails,GetSearchProductDetails,} from "../API/ProductDetailsAPI";

interface ProductDetailsCRUDProps {
  extraParams: { inventoryId: number };
  onRowClick?: (item: ProductDetailsTypes) => void;
  setSelectedInventory: (id: number) => void;
}

const ProductDetailsCRUD: React.FC<ProductDetailsCRUDProps> = ({ extraParams, onRowClick }) => {
  const [selectedhistoryInventory, setSelectedHistoryInventory] = useState<ProductDetailsTypes | null>(null);

  const itemTemplate = (): ProductDetailsTypes => ({
    id: 0,
    productId: 0,
    productName: "",
    purchasePrice: "",
    quantity: 0,
    total: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductDetailsTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true},
      { key: "productId", label: "Producto", hidden: true, required: true },
      { key: "productName", label: "Producto", required: true, hiddenInCreate: true, hiddenInEdit: true },
      {
        key: "purchasePrice",
        label: "Precio de compra",
        required: true,
      },
      { key: "quantity", label: "Cantidad", required: true },
      { key: "total", label: "Total", required: true, hiddenInCreate: true, hiddenInEdit: true },
    ];


  const handleRowSelection = (inventoryHistory: ProductDetailsTypes) => {
    setSelectedHistoryInventory(inventoryHistory);
    if (onRowClick) {
      onRowClick(inventoryHistory);
    }
  };


  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{padding: '0' }}>
              <h2 className="product-details-title" style={{ fontWeight: 'bold', fontSize: '22px' }}>Detalles del productos</h2>
              <CRUDForm<ProductDetailsTypes>
                fetchItems={GetProductDetails as any}
                searchItem={GetSearchProductDetails}
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
                sortFieldMap={ProductDetailsSortFieldMap}
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

export default ProductDetailsCRUD;