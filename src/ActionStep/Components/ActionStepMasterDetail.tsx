import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Nav } from 'react-bootstrap';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ActionStepTypes } from '../Types/ActionStepTypes';
import { ActionStepSortFieldMap } from '../Types/MapeoActionStep'; 
import {
  GetSearchActionStep,
  CreateActionStep,
  UpdateActionStep,
  DeleteActionStep,
} from '../API/ActionStepAPI';
import StepSelect from './ActionStepSelectStep';
import ActionSelect from './ActionStepSelectAccion';

interface ActionStepCRUDProps {
  selectedStepId: number | null; 
  onRowClick: (row: ActionStepTypes) => void; 
}

const ActionStepCRUD: React.FC<ActionStepCRUDProps> = ({ selectedStepId, onRowClick }) => {
  const [actions, setActions] = useState<ActionStepTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<number | null>(null); 

  
  const handleActionRowClick = (row: ActionStepTypes) => {
    setSelectedRow(row.id); 
    onRowClick(row); 
  };

  const itemTemplate = (): ActionStepTypes => ({
    id: 0, 
    idStep: selectedStepId ?? 0, 
    idAction: 0,
    nameStep: '',
    descriptionStep: '',
    nameAction: '',
    description: '',
    status: 'ACTIVE',
  });

  const columns: { 
    key: keyof ActionStepTypes; 
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
    { key: 'idStep', label: 'Pasos', hidden: true,hiddenInCreate: true, hiddenInEdit: true  },
    { key: 'idAction', label: 'Acciónes', hidden: true },
    { key: 'nameStep', label: 'Pasos', hiddenInCreate: true, hiddenInEdit: true, hidden:true },
    { key: 'nameAction', label: 'Acciónes', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'description', label: 'Descripción', minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
  ];

  const renderCustomFormField = (colKey: keyof ActionStepTypes, value: string, onChange: (newValue: string) => void) => {
    const selectedValue = value ? parseInt(value, 10) : 0; 

    if (colKey === 'idStep') {
      return (
        <StepSelect
          selectedValue={selectedValue}  
          onChange={(newStepId: number) => onChange(newStepId.toString())}  
        />
      );
    } else if (colKey === 'idAction') {
      return (
        <ActionSelect
          selectedValue={selectedValue}  
          onChange={(newActionId: number) => onChange(newActionId.toString())}  
        />
      );
    }
    return null; 
  };

  const fetchFilteredActions = async (page: number, size: number, idStep?: number) => {
    if (idStep === undefined) return [];
    const response = await GetSearchActionStep(page, size, { idStep });
    return response;  
  };

  const reloadActions = async () => {
    setLoading(true);  
    try {
      if (selectedStepId !== null) {
        const actionsData = await fetchFilteredActions(0, 10, selectedStepId);
        setActions(actionsData); 
      } else {
        setActions([]);
      }
    } catch (error) {
      console.error("Error fetching actions:", error);
      setActions([]);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    reloadActions();  
  }, [selectedStepId]);

  return (
    <Container fluid>
      <Row className="mt-8">
        <Col md={12}>
          <Card className="w-200">
            <Card.Body className="table-responsive" style={{ maxHeight: '500px' }}>
              <Nav variant="tabs" defaultActiveKey="/home" className="mb-3">
                <Nav.Item>
                  <Nav.Link href="#action">Gestión de Acciones</Nav.Link>
                </Nav.Item>
              </Nav>
              <p>Administre las acciones mediante la creación, edición o eliminación de registros.</p>
              {loading ? (
                <div>Cargando...</div>
              ) : (
                <CRUDForm<ActionStepTypes>
                  fetchItems={() => Promise.resolve(actions)}  
                  searchItem={(page, size, filters) => GetSearchActionStep(page, size, { ...filters, idStep: selectedStepId ?? undefined })} 
                  createItem={async (newActionStep) => {
                    newActionStep.idStep = selectedStepId ?? 0; 
                    await CreateActionStep(newActionStep);
                    reloadActions();  
                  }}
                  updateItem={async (id, updatedActionStep) => {
                    updatedActionStep.idStep = selectedStepId ?? updatedActionStep.idStep; 
                    await UpdateActionStep(id, updatedActionStep);  
                    reloadActions();  
                  }}
                  deleteItem={async (id) => {
                    await DeleteActionStep(id);
                    reloadActions();  
                  }}
                  itemTemplate={itemTemplate}
                  columns={columns}
                  sortFieldMap={ActionStepSortFieldMap}
                  renderCustomFormField={renderCustomFormField}
                  onRowClick={handleActionRowClick} 
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

export default ActionStepCRUD;
