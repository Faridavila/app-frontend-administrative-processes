import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Nav } from 'react-bootstrap';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ActionParameterTypes } from '../Types/ActionParameterTypes';
import { ActionParameterSortFieldMap } from '../Types/MapeoActionParameter'; 
import {
  GetSearchActionParameter, 
  CreateActionParameter,
  UpdateActionParameter,
  DeleteActionParameter,
} from '../API/ActionParameterAPI'; 

import ParameterSelect from './ActionParameterSelectStep';
import ActionSelect from './ActionParameterSelectAccion';

interface ActionParameterCRUDProps {
  selectedActionStepId: number | null;  
}

const ActionParameterCRUD: React.FC<ActionParameterCRUDProps> = ({ selectedActionStepId }) => {
  const [actionParameters, setActionParameters] = useState<ActionParameterTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<number | null>(null); 

  
  const handleParameterRowClick = (row: ActionParameterTypes) => {
    setSelectedRow(row.id); 
  };

  const itemTemplate = (): ActionParameterTypes => ({
    id: 0, 
    confWorkflowParameterId: 0,
    parameterName: '',
    actionName: '',
    idAction: selectedActionStepId ?? 0,  
    status: 'ACTIVE',
  });

  const columns: { 
    key: keyof ActionParameterTypes; 
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
    { key: 'confWorkflowParameterId', label: 'Parámetros', hidden: true },
    { key: 'idAction', label: 'Acciónes', hidden: true,hiddenInCreate: true, hiddenInEdit: true  },
    { key: 'parameterName', label: 'Parámetros', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'actionName', label: 'Acciónes', hiddenInCreate: true, hiddenInEdit: true, hidden: true },
  ];

  const renderCustomFormField = (colKey: keyof ActionParameterTypes, value: string, onChange: (newValue: string) => void) => {
    const selectedValue = value ? parseInt(value, 10) : 0; 

    if (colKey === 'confWorkflowParameterId') {
      return (
        <ParameterSelect
          selectedValue={selectedValue}  
          onChange={(newParameterId: number) => onChange(newParameterId.toString())}  
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

  const fetchFilteredActionParameters = async (page: number, size: number, idAction?: number) => {
    if (idAction === undefined) return [];
    const response = await GetSearchActionParameter(page, size, { idAction });
    return response;  
  };

  const reloadActionParameters = async () => {
    setLoading(true);
    try {
      if (selectedActionStepId !== null) {
        const parametersData = await fetchFilteredActionParameters(0, 10, selectedActionStepId);
        setActionParameters(parametersData); 
      } else {
        setActionParameters([]);
      }
    } catch (error) {
      console.error("Error fetching action parameters:", error);
      setActionParameters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadActionParameters();
  }, [selectedActionStepId]); 

  return (
    <Container fluid>
      <Row className="mt-8">
        <Col md={12}>
          <Card className="w-200">
            <Card.Body className="table-responsive" style={{ maxHeight: '500px' }}>
              <Nav variant="tabs" defaultActiveKey="/home" className="mb-3">
                <Nav.Item>
                  <Nav.Link href="#action">Gestión de parámetros de acciones</Nav.Link>
                </Nav.Item>
              </Nav>
              <p>Administre los parámetros de acciones mediante la creación, edición o eliminación de registros.</p>
              {loading ? (
                <div>Cargando...</div>
              ) : (
                <CRUDForm<ActionParameterTypes>
                  fetchItems={() => Promise.resolve(actionParameters)}  
                  searchItem={(page, size, filters) => GetSearchActionParameter(page, size, { ...filters, idAction: selectedActionStepId ?? undefined })} 
                  createItem={async (newActionParameter) => {
                    newActionParameter.idAction = selectedActionStepId ?? 0; 
                    await CreateActionParameter(newActionParameter);
                    reloadActionParameters();  
                  }}
                  updateItem={async (id, updatedActionParameter) => {
                    updatedActionParameter.idAction = selectedActionStepId ?? updatedActionParameter.idAction; 
                    await UpdateActionParameter(id, updatedActionParameter);  
                    reloadActionParameters();  
                  }}
                  deleteItem={async (id) => {
                    await DeleteActionParameter(id);
                    reloadActionParameters();  
                  }}
                  itemTemplate={itemTemplate}
                  columns={columns}
                  sortFieldMap={ActionParameterSortFieldMap}
                  renderCustomFormField={renderCustomFormField}
                  onRowClick={handleParameterRowClick} 
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

export default ActionParameterCRUD;
