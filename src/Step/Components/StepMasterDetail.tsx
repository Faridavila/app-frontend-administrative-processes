import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Nav } from 'react-bootstrap';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { StepTypes } from '../Types/StepTypes';
import { StepSortFieldMap } from '../Types/MapeoStep'; 
import { CreateStep, UpdateStep, DeleteStep, GetSearchStep } from '../API/StepAPI';
import ProcessSelect from './StepSelectProcess';
import StepTypeSelect from './StepSelectStepType';
import MenuSelect from './StepSelectmenu';

interface StepCRUDProps {
  selectedProcessId: number | null;
  onRowClick: (row: StepTypes) => void; 
}

export const StepCRUD: React.FC<StepCRUDProps> = ({ selectedProcessId, onRowClick }) => {
  const [steps, setSteps] = useState<StepTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);


  const handleStepRowClick = (row: StepTypes) => {
    setSelectedRow(row.id); 
    onRowClick(row); 
  };

  const itemTemplate = (): StepTypes => ({
    id: 0,
    description: '',
    idProcess: selectedProcessId ?? 0,  
    name: '',
    processName: '',
    confWorkflowStepsTypeId: 0,
    stepTypeName: '',
    menuId: 0, 
    nameMenu: '',
    orderExecution: -1,
    status: 'ACTIVE',
  });
  const columns: { 
    key: keyof StepTypes; 
    label: string; 
    hidden?: boolean; 
    required?: boolean; 
    minLength?: number; 
    maxLength?: number; 
    regex?: RegExp; 
    hiddenInCreate?: boolean; 
    hiddenInEdit?: boolean; 
  }[] = [
    { key: 'id', label: 'ID', hiddenInCreate: true, hiddenInEdit: true }, 
    { key: 'name', label: 'Nombre', required: true, minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
    { key: 'description', label: 'Descripción', required: true, minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
    { key: 'processName', label: 'Proceso', hiddenInCreate: true, hiddenInEdit: true, hidden: true }, 
    { key: 'stepTypeName', label: 'Tipo de Paso', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'nameMenu', label: 'Menu', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'orderExecution', label: 'Orden de ejecución', },
    { key: 'idProcess', label: 'Proceso', hidden: true, hiddenInCreate: true, hiddenInEdit: true },  
    { key: 'menuId', label: 'Menu', hidden: true },
    { key: 'confWorkflowStepsTypeId', label: 'Tipo de Paso', hidden: true },
  ];

  const renderCustomFormField = (colKey: keyof StepTypes, value: string, onChange: (newValue: string) => void) => {
    if (colKey === 'idProcess') {
      return (
        <ProcessSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newProcessId: number) => onChange(newProcessId.toString())}
        />
      );
    }else  if (colKey === 'confWorkflowStepsTypeId') {
      return (
        <StepTypeSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newProcessId: number) => onChange(newProcessId.toString())}
        />
      );
    }else  if (colKey === 'menuId') {
      return (
        <MenuSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newProcessId: number) => onChange(newProcessId.toString())}
        />
      );
    }
    return null;
  };

  const fetchFilteredSteps = async (page: number, size: number, idProcess?: number) => {
    if (idProcess === undefined) return [];
    const response = await GetSearchStep(page, size, { idProcess });
    return response;
  };

  const reloadSteps = async () => {
    setLoading(true);
    try {
      if (selectedProcessId !== null) {
        const stepsData = await fetchFilteredSteps(0, 10, selectedProcessId);
        setSteps(stepsData);
      } else {
        setSteps([]);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadSteps();
  }, [selectedProcessId]);

  return (
    <Container fluid>
      <Row className="mt-8">
        <Col md={80}>
          <Card className="w-200">
            <Card.Body className="table-responsive" style={{ maxHeight: '600px' }}>
              <Nav variant="tabs" defaultActiveKey="/home" className="mb-3">
                <Nav.Item>
                  <Nav.Link href="#step">Gestión de Pasos</Nav.Link>
                </Nav.Item>
              </Nav>
              <p>Administre los pasos mediante la creación, edición o eliminación de registros.</p>
              {loading ? (
                <div>Cargando...</div>
              ) : (
                <CRUDForm<StepTypes>
                  fetchItems={() => Promise.resolve(steps)}
                  searchItem={(page, size, filters) => GetSearchStep(page, size, { ...filters, idProcess: selectedProcessId ?? undefined })}
                  createItem={async (newStep) => {
                    newStep.idProcess = selectedProcessId ?? 0;
                    await CreateStep(newStep);
                    reloadSteps();
                  }}
                  updateItem={async (id, updatedStep) => {
                    updatedStep.idProcess = selectedProcessId ?? updatedStep.idProcess;
                    await UpdateStep(id, updatedStep);
                    reloadSteps();
                  }}
                  deleteItem={async (id) => {
                    await DeleteStep(id);
                    reloadSteps();
                  }}
                  itemTemplate={itemTemplate}
                  columns={columns}
                  sortFieldMap={StepSortFieldMap}
                  onRowClick={handleStepRowClick}
                  renderCustomFormField={renderCustomFormField}
                  rowClassName={(row) => row.id === selectedRow ? 'selected-row' : ''} 
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <style>{`.selected-row { background-color: #7367f0 !important; color: white; }`}</style>
    </Container>
  );
};
