import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { StepTypeTypes } from '../Types/StepTypeTypes';
import { StepTypeSortFieldMap } from '../Types/MapeoStepType'; 
import {
  GetStepType,
  CreateStepType,
  UpdateStepType,
  DeleteStepType,
  GetSearchStepType,
} from '../API/StepTypeAPI';

const StepTypeCRUD = () => {
  const itemTemplate = (): StepTypeTypes => ({
    id: 0,
    description: '',
    status: 'ACTIVE',
  });

  const columns: { key: keyof StepTypeTypes; 
    label: string; 
    hidden?: boolean; 
    required?: boolean; 
    minLength?: number; 
    maxLength?: number; 
    regex?: RegExp;
    hiddenInCreate?: boolean; 
    hiddenInEdit?: boolean; 
  }[] = [
    { key: 'id', label: 'ID',hiddenInCreate: true, hiddenInEdit: true },
    { key: 'description', label: 'Descripcion', required: true, minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/},
  ];
  

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <h3>Gestión de tipo de pasos</h3>
          <p>Administre los tipo de pasos mediante la creación, edición o eliminación de registros.</p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<StepTypeTypes>
                fetchItems={GetStepType}
                searchItem={GetSearchStepType}
                createItem={CreateStepType}
                updateItem={UpdateStepType}
                deleteItem={DeleteStepType}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={StepTypeSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StepTypeCRUD;
