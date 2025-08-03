import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AddIcon, FilterIcon, FilterIcon2, EditIcon, DeleteIcon } from '../Icons/Icons';
import './CRUDGeneral.css';

const MySwal = withReactContent(Swal);

type Orders = "ASC" | "DESC" | "neutral";

interface CRUDIcon {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

export interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  hidden?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  dependentOn?: keyof T;
  validationMessage?: string;   
  hiddenInCreate?: boolean;
  hiddenInEdit?: boolean;

  render?: (item: T) => React.ReactNode;
}

interface CRUDFormProps<T> {
  fetchItems: (page: number, size: number, filters: Partial<T>, sortOrder?: string, sortBy?: keyof T) => Promise<T[]>;
  searchItem?: (page: number, size: number, filters: Partial<T>, sortOrder?: string, sortBy?: keyof T) => Promise<T[]>;
  createItem: (item: T) => Promise<void>;
  updateItem: (id: number, item: T) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  itemTemplate: () => T;
  columns: ColumnDefinition<T>[];
  sortFieldMap: Record<string, string>;
  renderCustomFormField?: (colKey: keyof T, value: any, onChange: (newValue: any) => void) => React.ReactNode;
  customIcons?: CRUDIcon[];
  onRowClick?: (item: T) => void;
  rowClassName?: (row: T) => string; 
  renderCustomColumn?: (col: ColumnDefinition<T>, item: T) => React.ReactNode;
}

const CRUDForm = <T extends { id: number }>({
  fetchItems,
  searchItem,
  createItem,
  updateItem,
  deleteItem,
  itemTemplate,
  columns,
  sortFieldMap,
  renderCustomFormField,
  customIcons,
  onRowClick,
  rowClassName, 
}: CRUDFormProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [operation, setOperation] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [filters, setFilters] = useState<Partial<T>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<Orders>("neutral");

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAndSetData();
  }, [page, filters, sortField, sortOrder]);

  useEffect(() => {
    if (currentItem) {
      validateAllFields();
    }
  }, [currentItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const fetchAndSetData = async () => {
  try {
    const sortFieldParam = sortField !== null ? (sortFieldMap[sortField as string] || String(sortField)) : undefined;
    const sortOrderParam = sortOrder !== "neutral" ? sortOrder : undefined;
    const activeFilters: Partial<T> = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof T]) {
        activeFilters[key as keyof T] = filters[key as keyof T];
      }
    });
    const hasFilters = Object.keys(activeFilters).length > 0;
    const fetchedItems = hasFilters
      ? await searchItem!(page - 1, pageSize, activeFilters, sortOrderParam, sortFieldParam as keyof T)
      : await fetchItems(page - 1, pageSize, {}, sortOrderParam, sortFieldParam as keyof T);

    // Asegúrate de que `fetchedItems` siempre sea un arreglo
    setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    MySwal.fire('Error', 'Error al obtener los datos', 'error');
  }
};


  const handleShowModal = (operation: 'add' | 'edit', item: T | null = null) => {
    setOperation(operation);
    setCurrentItem(item || itemTemplate());
    setErrors({});
    setIsSaveDisabled(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setErrors({});
  };

  const handleRowClick = (item: T) => {
    setSelectedItem(item);
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleEditSelectedRow = () => {
    if (selectedItem) {
      handleShowModal('edit', selectedItem);
    }
  };

  const handleDeleteSelectedRow = () => {
    if (selectedItem) {
      handleDelete(selectedItem.id);
    }
  };

const validateField = (key: keyof T, value: string): string | null => {
  const column = columns.find((col) => col.key === key);

  if (column) {
    // Validación dependiente
    if (column.dependentOn && currentItem) {
      const dependentColumn = columns.find((col) => col.key === column.dependentOn);
      if (dependentColumn) {
        const dependentValue = currentItem[dependentColumn.key];

        if (dependentValue !== undefined && value !== undefined) {
          const numericValue = parseFloat(value);
          const numericDependentValue = parseFloat(dependentValue as string); // Garantizar que sea numérico

          // Comprobar si los valores son numéricos válidos antes de comparar
          if (!isNaN(numericValue) && !isNaN(numericDependentValue)) {
            // Validación para que el valor actual sea mayor que el valor dependiente
            if (numericValue <= numericDependentValue) {
              return column.validationMessage || `${column.label} debe ser mayor que ${dependentColumn.label}.`;
            }
          } else {
            return `${column.label} y ${dependentColumn.label} deben ser números válidos.`;
          }
        }
      }
    }

    // Validación estándar para otros casos
    if (column.required && !value) {
      return `${column.label} es obligatorio.`;
    }
    if (column.minLength && value.length < column.minLength) {
      return `${column.label} debe tener al menos ${column.minLength} caracteres.`;
    }
    if (column.maxLength && value.length > column.maxLength) {
      return `${column.label} no puede exceder los ${column.maxLength} caracteres.`;
    }
    if (column.regex && !column.regex.test(value)) {
      return `${column.label} tiene un formato inválido.`;
    }
  }
  return null;
};

const validateAllFields = () => {
  if (!currentItem) return;

  const newErrors: Partial<Record<keyof T, string>> = {};
  let allValid = true;

  for (const col of columns) {
    if (!col.hidden) {
      const error = validateField(col.key, String(currentItem[col.key]));
      if (error) {
        allValid = false;
        newErrors[col.key] = error;
        break; // Detenemos el ciclo si encontramos un error
      }
    }
  }

  setErrors(newErrors);
  setIsSaveDisabled(!allValid); // Deshabilitar el botón de guardar si hay errores
};




const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  if (currentItem) {
    const key = name as keyof T;
    setCurrentItem({ ...currentItem, [key]: value } as T);

    const error = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));

    validateAllFields();
  }
};


  const handleSave = async () => {
    if (!currentItem || isSaveDisabled) return;

    try {
      if (operation === 'add') {
        await createItem(currentItem);
        MySwal.fire('Hecho!', 'Elemento añadido con éxito.', 'success');
      } else {
        await updateItem(currentItem.id, currentItem);
        MySwal.fire('Actualizado!', 'Elemento actualizado con éxito.', 'success');
      }
      fetchAndSetData();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar:', error);
      MySwal.fire('Error', 'No se pudo guardar el elemento.', 'error');
    }
  };

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "¡Estas seguro de eliminarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        deleteItem(id)
          .then(() => {
            MySwal.fire('Eliminado!', 'El elemento ha sido eliminado.', 'success');
            fetchAndSetData();
          })
          .catch((error) => {
            console.error('Error al eliminar:', error);
            MySwal.fire('Error', 'No se pudo eliminar el elemento.', 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire('Cancelado', 'Tu elemento está seguro :)', 'error');
      }
    });
  };

  const handleCancel = () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Tienes cambios sin guardar, ¿quieres cancelar la edición?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar editando',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        handleCloseModal();
      }
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value || undefined });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (key: keyof T) => {
    if (sortField === key) {
      setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : prevOrder === 'DESC' ? 'neutral' : 'ASC'));
    } else {
      setSortField(key);
      setSortOrder('ASC');
    }
  };

  const editableColumns = columns.filter((col) => {
    if (operation === 'add' && col.hiddenInCreate) return false;
    if (operation === 'edit' && col.hiddenInEdit) return false;
    return true;
  });

  return (
    <div className='container-fluid' ref={tableRef}>
      <div className='row mt-3'>
        <div className='col-md-12'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div className='button-container'>
              <Button
               className='btn btn-primary btn-small2 me-2'
                onClick={() => handleShowModal('add')}
                aria-label="Añadir Nuevo Elemento"
                 
              >
                <AddIcon />
              </Button>
              <Button
                className='btn btn-info btn-small me-2'
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? 'Ocultar Filtro' : 'Mostrar Filtro'}
              >
                {showFilters ? <FilterIcon /> : <FilterIcon2 />}
                {showFilters ? 'Ocultar Filtro' : 'Mostrar Filtro'}
              </Button>

              <Button
                className='btn btn-info btn-small3 me-2'
                onClick={handleEditSelectedRow}
                disabled={!selectedItem}
                aria-label="Editar Elemento Seleccionado"
              >
                <EditIcon /> Editar
              </Button>

              <Button
                className='btn btn-danger btn-small4 me-2'
                onClick={handleDeleteSelectedRow}
                disabled={!selectedItem}
                aria-label="Eliminar Elemento Seleccionado"
              >
                <DeleteIcon /> Eliminar
              </Button>
              {customIcons && customIcons.map((iconConfig, index) => (
                <Button
                  key={index}
                  className='btn btn-primary me-2'
                  onClick={iconConfig.onClick}
                  aria-label={iconConfig.ariaLabel || iconConfig.label}
                >
                  {iconConfig.icon} {iconConfig.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='table-responsive'>
            <Table bordered hover className="table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    !col.hidden && (
                      <th key={String(col.key)} onClick={() => handleSortChange(col.key)} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{col.label}</span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className={`bi bi-arrow-down-up ${sortField === col.key ? (sortOrder === 'ASC' ? 'asc' : 'desc') : ''}`}
                              viewBox="0 0 16 16"
                            >
                              <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5-.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </span>
                        </div>
                        {showFilters && (
                          <div className="filter-container">
                            <Form.Control
                              type='text'
                              name={String(col.key)}
                              placeholder={`Filtrar por ${col.label}`}
                              onChange={handleFilterChange}
                              className='filter-input'
                            />
                          </div>
                        )}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id ?? 'unknown'}
                    onClick={() => handleRowClick(item)}
                    className={rowClassName ? rowClassName(item) : ''} 
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedItem && selectedItem.id === item.id ? '#cc322d' : 'transparent'
                    }}
                  >
                    {columns.map((col) => (
                      !col.hidden && (
                        <td key={String(col.key)}>
                          {col.render ? col.render(item) : item[col.key] !== undefined && item[col.key] !== null
                            ? String(item[col.key])
                            : 'N/A'}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className='pagination-container d-flex justify-content-center'>
              <Button
                className='btn btn-outline-primary btn-sm me-1'
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <i className="fa-solid fa-angle-double-left"></i>
              </Button>
              {page > 1 && (
                <>
                  <Button
                    className={`btn btn-sm ${page === 1 ? 'btn-primary' : 'btn-outline-primary'} me-1`}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {page > 2 && (
                    <Button
                      className={`btn btn-sm ${page === page - 1 ? 'btn-primary' : 'btn-outline-primary'} me-1`}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      {page - 1}
                    </Button>
                  )}
                </>
              )}
              <Button className='btn btn-sm btn-primary me-1'>
                {page}
              </Button>
              {items.length === pageSize && (
                <Button
                  className={`btn btn-sm ${page === page + 1 ? 'btn-primary' : 'btn-outline-primary'} me-1`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </Button>
              )}
              <Button
                className='btn btn-outline-primary btn-sm ms-'
                onClick={() => handlePageChange(page + 1)}
                disabled={items.length < pageSize}
              >
                <i className="fa-solid fa-angle-double-right"></i>
              </Button>
            </div>

          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{operation === 'add' ? 'Añadir' : 'Editar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentItem && (
            <Form>
              <Row>
                {editableColumns.length <= 4 ? (
                  editableColumns.map((col, index) => (
                    <Col md={12} key={index}>
                      <Form.Group className='mb-3'>
                        <Form.Label>{col.label}</Form.Label>
                        {renderCustomFormField && renderCustomFormField(col.key, String(currentItem[col.key]), (newValue) => setCurrentItem({ ...currentItem, [col.key]: newValue } as T))}
                        {(!renderCustomFormField || !renderCustomFormField(col.key, String(currentItem[col.key]), () => { })) && (
                          <>
                            <Form.Control
                              type={col.key === 'password' ? 'password' : 'text'}
                              name={String(col.key)}
                              placeholder={col.label}
                              value={String(currentItem[col.key]) || ''}
                              onChange={handleChange}
                              aria-label={col.label}
                              isInvalid={!!errors[col.key]}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors[col.key]}
                            </Form.Control.Feedback>
                          </>
                        )}
                      </Form.Group>
                    </Col>
                  ))
                ) : (
                  editableColumns.map((col, index) => (
                    <Col md={6} key={index}>
                      <Form.Group className='mb-3'>
                        <Form.Label>{col.label}</Form.Label>
                        {renderCustomFormField && renderCustomFormField(col.key, String(currentItem[col.key]), (newValue) => setCurrentItem({ ...currentItem, [col.key]: newValue } as T))}
                        {(!renderCustomFormField || !renderCustomFormField(col.key, String(currentItem[col.key]), () => { })) && (
                          <>
                            <Form.Control
                              type={col.key === 'password' ? 'password' : 'text'}
                              name={String(col.key)}
                              placeholder={col.label}
                              value={String(currentItem[col.key]) || ''}
                              onChange={handleChange}
                              aria-label={col.label}
                              isInvalid={!!errors[col.key]}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors[col.key]}
                            </Form.Control.Feedback>
                          </>
                        )}
                      </Form.Group>
                    </Col>
                  ))
                )}
              </Row>
              <div className='d-flex justify-content-end'>
                <Button
                  className='btn btn-success me-1'
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  style={{ opacity: isSaveDisabled ? 0.5 : 1 }}
                >
                  <i className='fa-solid fa-floppy-disk me-1'></i> Guardar
                </Button>
                <Button
                  className='btn btn-danger'
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CRUDForm;
