import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { StepStatusTypes } from '../Types/StepStatusTypes';
import { StepStatusSortFieldMap } from '../Types/MapeoStatusType'; 
import {
  GetStepStatus,
  CreateStepStatus,
  UpdateStepStatus,
  DeleteStepStatus,
  GetSearchStepStatus,
} from '../API/StepStatusAPI';

const StepStatusCRUD = () => {
  const itemTemplate = (): StepStatusTypes => ({
    id: 0,
    description: '',
    status: 'ACTIVE',
  });

  const columns: { key: keyof StepStatusTypes; 
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
          <h3>Gestión de estado de pasos</h3>
          <p>Administre los estado de pasos mediante la creación, edición o eliminación de registros.</p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<StepStatusTypes>
                fetchItems={GetStepStatus}
                searchItem={GetSearchStepStatus}
                createItem={CreateStepStatus}
                updateItem={UpdateStepStatus}
                deleteItem={DeleteStepStatus}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={StepStatusSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StepStatusCRUD;
