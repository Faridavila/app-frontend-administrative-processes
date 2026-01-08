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
import { Form } from "react-bootstrap";

const CategoryCRUD = () => {
  const itemTemplate = (): CategoryTypes => ({
    id: 0,
    nameCategory: "",
    soldOutValue: 0,
    fewUnits: 0,
    image: "",
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
    editable?: boolean;
    dependentOn?: keyof CategoryTypes;
    validationMessage?: string;
    render?: (item: CategoryTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
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
        maxLength: 30,
        regex: /^[A-Za-záéíóúÁÉÍÓÚ0-9\s\.,;¡!¿?(){}[\]@#%&*+_\\/-]+$/,
      },
      {
        key: "soldOutValue",
        label: "Rango de unidades agotadas",
        required: true,
        regex: /^\d+$/,
        render: (item) => item.soldOutValue.toLocaleString('es-ES')
      },
      {
        key: "fewUnits",
        label: "Rango de pocas unidades",
        required: true,
        dependentOn: "soldOutValue",
        validationMessage: "El valor debe ser mayor que 'Rango de unidades agotadas'.",
        regex: /^\d+$/,
        render: (item) => item.fewUnits.toLocaleString('es-ES')
      },
      {
        key: "image",
        label: "Imagen",
        required: true,
        imageOptions: {
          maxSize: 2 * 1024 * 1024,
          acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
        },
        render: (item) =>
          item.image ? (
            <img
              src={item.image}
              alt="Imagen"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          ) : (
            "N/A"
          ),
        editable: true,
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
    colKey: keyof CategoryTypes,
    value: any,
    onChange: (update: Partial<CategoryTypes>) => void
  ) => {
    if (colKey === "image") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {value && (
            <img
              src={value instanceof File ? URL.createObjectURL(value) : value}
              alt="Vista previa"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "8px"
              }}
            />
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange({ image: file as unknown } as Partial<CategoryTypes>);
              }
            }}
          />
        </div>
      );
    }

    if (colKey === "soldOutValue" || colKey === "fewUnits") {
      const numericValue = typeof value === 'string' ? value : String(value || '');
      const displayValue = numericValue ? parseInt(numericValue).toLocaleString('es-ES') : '';

      return (
        <Form.Control
          type="text"
          placeholder={colKey === "soldOutValue" ? "Ej: 1.000" : "Ej: 5.000"}
          value={displayValue}
          onChange={(e) => {
            let input = e.target.value;
            input = input.replace(/\./g, "");

            if (!/^\d*$/.test(input)) {
              return;
            }
            onChange({ [colKey]: input } as Partial<CategoryTypes>);
          }}
          className="fw-medium"
        />
      );
    }

    return null;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
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
                filterButtonOrder={1}
                sortFieldMap={categorySortFieldMap}
                renderCustomFormField={renderCustomFormField}
                pageTitle="Categorías"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCRUD;