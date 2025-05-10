import CRUDForm from '../../GeneralComponents/GeneralCrud/CRUDForm';
import { MenuTypes } from '../Types/MenuTypes';
import { MenuSortFieldMap } from '../Types/MapeoMenu';
import {
  GetMenu,
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
  GetSearchMenu,
} from '../API/MenuAPI';
import MenuTypeSelect from './MenuSelectMenuType';

const MenuCRUD = () => {

  const itemTemplate = (): MenuTypes => ({
    id: 0,
    name: '',
    description: '',
    shortName: '',
    fatherMenuId: 0,
    menuTypeId: { id: 0, description: '' },
    status: 'ACTIVE',
  });

  const columns: {
    key: keyof MenuTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: MenuTypes) => React.ReactNode;
  }[] = [
    { key: 'id', label: 'ID', hiddenInCreate: true, hiddenInEdit: true },
    { key: 'name', label: 'Nombre', required: true, minLength: 2, maxLength: 100 },
    { key: 'description', label: 'Descripcion', required: true, minLength: 2, maxLength: 100 },
    { key: 'shortName', label: 'Acronimo', required: true, minLength: 2, maxLength: 100 },
    { key: 'fatherMenuId', label: 'Id padre', required: true, },
    {
      key: 'menuTypeId',
      label: 'Tipo de menu',
      render: (item: MenuTypes) => {
        return item.menuTypeId?.description || '';
      },
    },
    
  ];

  const renderCustomFormField = (colKey: keyof MenuTypes, value: string, onChange: (newValue: string) => void) => {
    if (colKey === 'menuTypeId') {
      return (
        <MenuTypeSelect
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
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <h3>Gestión de menu</h3>
          <p>Administre el menu mediante la creación, edición o eliminación de registros.</p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<MenuTypes>
                fetchItems={GetMenu}
                searchItem={GetSearchMenu}
                createItem={CreateMenu}
                updateItem={UpdateMenu}
                deleteItem={DeleteMenu}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={MenuSortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCRUD;
