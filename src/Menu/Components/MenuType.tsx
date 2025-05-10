import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { MenuTypeTypes } from '../Types/MenuTypeTypes';
import { MenuTypeSortFieldMap } from '../Types/MapeoMenuType'; 
import {
  GetMenuType,
  CreateMenuType,
  UpdateMenuType,
  DeleteMenuType,
  GetSearchMenuType,
} from '../API/MenuTypeAPI';

const MenuTypeCRUD = () => {
  const itemTemplate = (): MenuTypeTypes => ({
    id: 0,
    description: '',
    status: 'ACTIVE',
  });

  const columns: { key: keyof MenuTypeTypes; 
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
              <CRUDForm<MenuTypeTypes>
                fetchItems={GetMenuType}
                searchItem={GetSearchMenuType}
                createItem={CreateMenuType}
                updateItem={UpdateMenuType}
                deleteItem={DeleteMenuType}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={MenuTypeSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default MenuTypeCRUD;
