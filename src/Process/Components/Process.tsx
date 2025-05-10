import { useState, useRef } from 'react';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProcessTypes } from '../Types/ProcessTypes';
import { ProcessSortFieldMap } from '../Types/MapeoProcess';
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton.tsx";
import {
  GetProcess,
  CreateProcess,
  UpdateProcess,
  DeleteProcess,
  GetSearchProcess,
} from '../API/ProcessAPI';
import { StepCRUD } from '../../Step/Components/StepMasterDetail';
import ActionStepCRUD from '../../ActionStep/Components/ActionStepMasterDetail';
import ActionParameterCRUD from '../../ActionParameter/Components/ActionParameterMasterDetail.tsx';

const MasterDetail = () => {
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedActionStepId, setSelectedActionStepId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  
  const [stepKey, setStepKey] = useState<number>(0); 
  const [actionStepKey, setActionStepKey] = useState<number>(0); 
  const [actionParameterKey, setActionParameterKey] = useState<number>(0); 

  const tableRef = useRef<HTMLDivElement>(null);

  
  const handleProcessRowClick = (row: ProcessTypes) => {
    setSelectedProcessId(row.id);
    setSelectedRow(row.id); 


    setSelectedStepId(null);  
    setSelectedActionStepId(null);  

    setStepKey(prevKey => prevKey + 1);
    setActionStepKey(prevKey => prevKey + 1);
    setActionParameterKey(prevKey => prevKey + 1);
  };

  const itemTemplate = (): ProcessTypes => ({
    id: 0,
    description: '',
    status: 'ACTIVE',
  });

  const columns: { 
    key: keyof ProcessTypes; 
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
    { key: 'description', label: 'Nombre', required: true, minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
  ];

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
              Gestión de Procesos
            </h3>
            <FavoritoButton path="/process" label="Procesos" />
          </div>
          <p>Administre los procesos mediante la creación, edición o eliminación de registros.</p>
          
          <div className="card">
            <div className="card-datatable table-responsive" ref={tableRef}>
              <CRUDForm<ProcessTypes>
                fetchItems={GetProcess}
                searchItem={GetSearchProcess}
                createItem={CreateProcess}
                updateItem={UpdateProcess}
                deleteItem={DeleteProcess}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ProcessSortFieldMap}
                onRowClick={handleProcessRowClick}
                rowClassName={(row) => row.id === selectedRow ? 'selected-row' : ''}
              />
            </div>
          </div>
          <div className="card mt-3">
            <StepCRUD
              key={stepKey} 
              selectedProcessId={selectedProcessId}
              onRowClick={(row) => {
                setSelectedStepId(row.id);
                setActionStepKey(prevKey => prevKey + 1);
                setSelectedActionStepId(null); 
              }}
            />
          </div>

          <div className="card mt-3">
            <ActionStepCRUD 
              key={actionStepKey} 
              selectedStepId={selectedStepId}
              onRowClick={(row) => {
                setSelectedActionStepId(row.idAction);
                setActionParameterKey(prevKey => prevKey + 1); 
              }}
            />
          </div>

          <div className="card mt-3">
            <ActionParameterCRUD 
              key={actionParameterKey} 
              selectedActionStepId={selectedActionStepId}
            />
          </div>
        </div>
      </div>
      <style>{`.selected-row {background-color: #7367f0 !important; color: white;}`}</style>
    </div>
  );
};

export default MasterDetail;
