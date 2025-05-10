import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

interface EditFormProps<T> {
  currentItem: T | null;
  showModal: boolean;
  handleCloseModal: () => void;
  handleSave: () => void;
  columns: { key: keyof T; label: string; hiddenInCreate?: boolean; hiddenInEdit?: boolean }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  renderCustomFormField?: (colKey: keyof T, value: unknown, onChange: (newValue: unknown) => void) => React.ReactNode;
  isEditMode: boolean;
}

const EditForm = <T extends { id: number }>({
  currentItem,
  showModal,
  handleCloseModal,
  handleSave,
  columns,
  handleChange,
  renderCustomFormField,
  isEditMode,
}: EditFormProps<T>) => {
  

  const editableColumns = columns.filter(col => {
    if (isEditMode && col.hiddenInEdit) return false; 
    if (!isEditMode && col.hiddenInCreate) return false;
    return true; 
  });

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Editar' : 'Añadir'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentItem && (
          <Form>
            <Row>
              {editableColumns.map((col) => (
                <Col md={6} key={String(col.key)}>
                  <Form.Group className='mb-3'>
                    <Form.Label>{col.label}</Form.Label>
                    {renderCustomFormField && renderCustomFormField(col.key, currentItem[col.key], (newValue) => handleChange({ target: { name: String(col.key), value: newValue } } as React.ChangeEvent<HTMLInputElement>))}
                    {(!renderCustomFormField || !renderCustomFormField(col.key, currentItem[col.key], () => {})) && (
                      <Form.Control
                        type='text'
                        name={String(col.key)}
                        placeholder={col.label}
                        value={String(currentItem[col.key]) || ''}
                        onChange={handleChange}
                        aria-label={col.label}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <div className='d-grid'>
              <Button className='btn btn-success' onClick={handleSave}>
                <i className='fa-solid fa-floppy-disk me-1'></i> Guardar
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditForm;
