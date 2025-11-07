import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import React, { useState } from 'react';
import { Card, Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import { AddIcon, DeleteIcon } from '../Icons/Icons';
import { SupplierProductTypes } from "../Types/SupplierProductTypes";
import { SupplierProductSortFieldMap } from "../Types/MapeoSupplierProduct";
import {
  GetSupplierProducts,
  CreateSupplierProducts,
  UpdateSupplierProducts,
  DeleteSupplierProducts,
  GetSearchSupplierProducts,
} from "../API/SupplierProductAPI";
import ProductSelect from "../../Inventory/Components/SelectProduct";

interface ProductLine {
  tempId: string;
  productId: number;
  productName: string;
  purchasePrice: number;
}

interface SupplierProductCRUDProps {
  extraParams: { supplierId: number };
  onRowClick?: (item: SupplierProductTypes) => void;
  setSelectedSupplierId: (id: number) => void;
}

const SupplierProductsCRUD: React.FC<SupplierProductCRUDProps> = ({ extraParams, onRowClick, setSelectedSupplierId }) => {
  const [selectedMicroRoutes, setSelectedMicroRoutes] = useState<SupplierProductTypes | null>(null);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const renderCustomFormField = (
    colKey: keyof SupplierProductTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "productId") {
      return (
        <ProductSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCategoryId: number) => onChange(newCategoryId.toString())}
        />
      );
    }
    return null;
  };

  const handleRowSelection = (supplier: SupplierProductTypes) => {
    setSelectedMicroRoutes(supplier);
    if (onRowClick) {
      onRowClick(supplier);
    }
  };

  const renderCustomAddModal = () => {
    const handleAddLine = () => {
      const newLine: ProductLine = {
        tempId: Date.now().toString(),
        productId: 0,
        productName: "",
        purchasePrice: 0,
      };
      setProductLines([...productLines, newLine]);
    };

    const handleRemoveLine = (tempId: string) => {
      setProductLines(productLines.filter(line => line.tempId !== tempId));
    };

    const handleLineChange = (tempId: string, field: 'productId' | 'purchasePrice', value: any, productName?: string) => {
      setProductLines(prevLines =>
        prevLines.map(line =>
          line.tempId === tempId
            ? {
              ...line,
              [field]: value,
              ...(field === 'productId' && productName && { productName }),
            }
            : line
        )
      );
    };

    const handleProductChange = (tempId: string, productId: number, productName?: string) => {
      handleLineChange(tempId, 'productId', productId, productName);
    };

    return (
      <Form>
        <Row className="flex-grow-1">
          <Col xs={12} className="p-0">
            <div className="mb-3 flex-grow-1" style={{
              borderRadius: '0.375rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              maxWidth: '100%',
              width: '100%',
              overflow: 'visible'
            }}>
              <div style={{ overflow: 'visible' }}>
                <Table bordered hover className="mb-0" style={{ tableLayout: 'auto', width: '100%' }}>
                  <thead >
                    <tr>
                      <th style={{ width: '50%', padding: '12px', textAlign: 'left' }}>PRODUCTO</th>
                      <th style={{ width: '30%', padding: '12px', textAlign: 'center' }}>PRECIO DE COMPRA</th>
                      <th style={{ width: '20%', padding: '12px', textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLines.map((line) => (
                      <tr key={line.tempId}>
                        <td style={{ padding: '12px', verticalAlign: 'middle', position: 'relative', overflow: 'visible', zIndex: 1000 }}>
                          <ProductSelect
                            selectedValue={line.productId}
                            onChange={(newId: number) => handleProductChange(line.tempId, newId)}
                          />
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <Form.Control
                            type="number"
                            placeholder="Precio de compra"
                            value={line.purchasePrice || ''}
                            onChange={(e) => handleLineChange(line.tempId, 'purchasePrice', parseFloat(e.target.value) || 0)}
                            min={0}
                            step={0.01}
                            className="form-control form-control-sm text-center"
                            style={{ borderRadius: '0.375rem', maxWidth: '120px', margin: '0 auto', border: '1px solid #ced4da' }}
                          />
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <Button
                            className='btn btn-danger p-0'
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto'

                            }}
                            aria-label="Eliminar Elemento Seleccionado"
                            onClick={() => handleRemoveLine(line.tempId)}
                          >
                            <DeleteIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {productLines.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4" >
                          No hay productos agregados. Haz clic en "Añadir Producto".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
            <Button
              variant="outline-secondary"
              onClick={handleAddLine}
              className="btn-sm px-1"
            >
              <span className="me-1">
                <AddIcon />
              </span>
              Añadir Producto
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const customSave = async (onSuccess: () => void, onError: (error: any) => void) => {
    try {
      for (const line of productLines) {
        if (line.productId > 0 && line.purchasePrice > 0) {
          const item: SupplierProductTypes = {
            id: 0,
            productId: line.productId,
            productName: line.productName,
            purchasePrice: line.purchasePrice.toString(),
            status: "",
          };
          await CreateSupplierProducts(item, null, extraParams);
        }
      }
      setProductLines([]);
      setRefreshKey(prev => prev + 1);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const renderCustomValidation = () => {
    return productLines.some(line => line.productId > 0 && line.purchasePrice > 0);
  };

  const onAddModalOpen = () => {
    const emptyLine: ProductLine = {
      tempId: Date.now().toString(),
      productId: 0,
      productName: "",
      purchasePrice: 0,
    };
    setProductLines([emptyLine]);
  };

  const onAddModalClose = () => {
    setProductLines([]);
  };

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="w-100" style={{ margin: '0' }}>
            <Card.Body className="table-responsive" style={{ maxHeight: '600px', padding: '0' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '22px' }}>Productos precio de compra</h2>
              <CRUDForm<SupplierProductTypes>
                key={refreshKey}
                fetchItems={GetSupplierProducts}
                searchItem={GetSearchSupplierProducts}
                createItem={CreateSupplierProducts}
                updateItem={UpdateSupplierProducts}
                deleteItem={DeleteSupplierProducts}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={2}
                hiddenDownloadButton={false}
                hiddenAddButton={false}
                hiddenEditButton={false}
                hiddenDeleteButton={false}
                sortFieldMap={SupplierProductSortFieldMap}
                pageTitle="Porductos precio de compra proveedor"
                renderCustomFormField={renderCustomFormField}
                renderCustomAddModal={renderCustomAddModal}
                renderCustomValidation={renderCustomValidation}
                customSave={customSave}
                onAddModalOpen={onAddModalOpen}
                onAddModalClose={onAddModalClose}
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