import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { AuthTypes } from '../Types/AuthTypes';
import {AuthSortFieldMap } from '../Types/MapeoAuth'; 
import {
  GetAuth,
  CreateAuth,
  UpdateAuth,
  DeleteAuth,
  GetSearchAuth,
} from '../API/AuthAPI';

const AuthCRUD = () => {
  const itemTemplate = (): AuthTypes => ({
    id: 0, 
    nameAuth: '',
    role: 0, 
    status: 'ACTIVE',
  });

  const columns: { 
    key: keyof AuthTypes; 
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
    { key: 'nameAuth', label: 'Nombre', required: true, minLength: 2, maxLength: 100, regex: /^[A-Za-z\s]+$/ },
    { key: 'role', label: 'Roles', required: true,  maxLength: 100, regex: /^\d+$/ },
  ];

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
              <CRUDForm<AuthTypes>
                fetchItems={GetAuth}
                searchItem={GetSearchAuth}
                createItem={CreateAuth}
                updateItem={UpdateAuth}
                deleteItem={DeleteAuth}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={AuthSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCRUD;
