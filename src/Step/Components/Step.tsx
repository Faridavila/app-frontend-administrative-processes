import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { StepTypes } from '../Types/StepTypes';
import {StepSortFieldMap } from '../Types/MapeoStep'; 
import {
  GetStep,
  CreateStep,
  UpdateStep,
  DeleteStep,
  GetSearchStep,
} from '../API/StepAPI';
import ProcessSelect from './StepSelectProcess'
const StepCRUD = () => {
  const itemTemplate = (): StepTypes => ({
    id: 0, 
    description: '',
    idProcess: 0, 
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
    { key: 'id', label: 'ID',hiddenInCreate: true, hiddenInEdit: true  }, 
    { key: 'name', label: 'Nombre', },
    { key: 'description', label: 'Descripcion', },
    { key: 'processName', label: 'Procesos', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'stepTypeName', label: 'Pasos', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'nameMenu', label: 'Menu',hiddenInCreate: true, hiddenInEdit: true  },
    { key: 'orderExecution', label: 'Orden de ejecución', },
    { key: 'idProcess', label: 'Procesos',hidden:true  }, 
    { key: 'menuId', label: 'Menu',hidden:true  }, 
    { key: 'confWorkflowStepsTypeId', label: 'Pasos', hidden:true  }, 
    
  ];


  const renderCustomFormField = (colKey: keyof StepTypes, value: string, onChange: (newValue: string) => void) => {
    if (colKey === 'idProcess') {
      return (
        <ProcessSelect
          selectedValue={parseInt(value, 10)}  
          onChange={(newDepartmentId: number) => onChange(newDepartmentId.toString())}  
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
          <h3>Gestión de Pasos</h3>
          <p>Administre los pasos mediante la creación, edición o eliminación de registros.</p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<StepTypes>
                fetchItems={GetStep}
                searchItem={GetSearchStep}
                createItem={CreateStep}
                updateItem={UpdateStep}
                deleteItem={DeleteStep}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={StepSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCRUD;
