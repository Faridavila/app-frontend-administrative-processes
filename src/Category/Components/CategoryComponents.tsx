/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // Definir la plantilla de los elementos (objeto inicial)
  const itemTemplate = (): CategoryTypes => ({
    id: 0,
    categoryType: "",
    description: "",
    status: "ACTIVE",
  });

  // Definir las columnas del formulario CRUD
  const columns: {
    key: keyof CategoryTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean; // Ocultar en la creación
    hiddenInEdit?: boolean; // Ocultar en la edición
  }[] = [
    {
      key: "id",
      label: "ID",
      hiddenInCreate: true, // Ocultar el ID en el formulario de creación
      hiddenInEdit: true,
    },
    {
      key: "categoryType",
      label: "Tipo de Categoría",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "description",
      label: "Descripción",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "status",
      label: "Estado",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  ];

  // Renderizar campos personalizados si es necesario (en este caso no hay ninguno)
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
