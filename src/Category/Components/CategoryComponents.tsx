import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CategoryTypes } from "./../Types/CategoryTypes";
import { categorySortFieldMap } from "../Types/MapeoCategory";
import {
  GetCategory,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  GetSearchCategory,
} from "../API/Category";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const CategoryCRUD = () => {
  const itemTemplate = (): CategoryTypes => ({
    id: 0,
    nameCategory: "",
    soldOutValue:"",
    fewUnits: "",
    status: "ACTIVE",
  });

  const columns: {
  key: keyof CategoryTypes;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  hiddenInCreate?: boolean;
  hiddenInEdit?: boolean;
  hidden?: boolean; 
  dependentOn?: keyof CategoryTypes; 
  validationMessage?: string;      
}[] = [
  {
    key: "id",
    label: "ID",
    hiddenInCreate: true,
    hiddenInEdit: true,
  },
  {
    key: "nameCategory",
    label: "Tipo de Categoría",
    required: true,
    minLength: 2,
    maxLength: 100,
    regex: /^[A-Za-z\s]+$/
  },
  {
    key: "soldOutValue",
    label: "Rango de unidades agotadas",
    required: true,
    regex: /^\d+$/,
  },
  {
    key: "fewUnits",
    label: "Rango de pocas unidades",
    required: true,
    dependentOn: "soldOutValue", 
    validationMessage: "El valor debe ser mayor que 'Rango de unidades agotadas'.",
    regex: /^\d+$/
  },
  {
    key: "status",
    label: "Estado",
    hiddenInCreate: true,
    hiddenInEdit: true,
    hidden: true, 
  },
];

  const renderCustomFormField = (
    _colKey: keyof CategoryTypes,
    _value: string,
    _onChange: (newValue: string) => void
  ) => {
    return null;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: "0", fontSize: "21px" }}
            >
              Gestión de Categorías
            </h3>
            <FavoritoButton path="/category" label="Categorías" />
          </div>
          <p>
            Administre las categorías mediante la creación, edición o
            eliminación de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<CategoryTypes>
                fetchItems={GetCategory}
                searchItem={GetSearchCategory}
                createItem={CreateCategory}
                updateItem={UpdateCategory}
                deleteItem={DeleteCategory}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={categorySortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCRUD;
