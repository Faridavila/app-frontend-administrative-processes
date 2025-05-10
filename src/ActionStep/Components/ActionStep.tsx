import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ActionStepTypes } from '../Types/ActionStepTypes';
import { ActionStepSortFieldMap } from '../Types/MapeoActionStep'; 
import {
  GetActionStep,
  CreateActionStep,
  UpdateActionStep,
  DeleteActionStep,
  GetSearchActionStep,
} from '../API/ActionStepAPI';

import StepSelect from './ActionStepSelectStep';
import ActionSelect from './ActionStepSelectAccion';

const ActionStepCRUD = () => {
  const itemTemplate = (): ActionStepTypes => ({
    id: 0, 
    idStep: 0,
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
    { key: 'idStep', label: 'ID Paso', hidden: true },
    { key: 'idAction', label: 'ID Acción', hidden: true },
    { key: 'nameStep', label: 'Nombre Paso', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'nameAction', label: 'Nombre Acción', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'description', label: 'Descripcion',  minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
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

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <h3>Gestión de Acciones</h3>
          <p>Administre los Acciones mediante la creación, edición o eliminación de registros.</p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<ActionStepTypes>
                fetchItems={GetActionStep}
                searchItem={GetSearchActionStep}
                createItem={CreateActionStep}
                updateItem={UpdateActionStep}
                deleteItem={DeleteActionStep}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={ActionStepSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionStepCRUD;
