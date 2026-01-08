import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProductTypes } from "../Types/ProductTypes";
import { ProductSortFieldMap } from "../Types/MapeoProductTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import CategorySelect from "./CategorySelectProduct";
import { Form } from "react-bootstrap";
import {
  GetProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetSearchProduct,
} from "../API/ProductAPI";

const ProductCRUD = () => {
  const itemTemplate = (): ProductTypes => ({
    id: 0,
    productName: "",
    price: 0,
    description: "",
    quantity: 0,
    categoryId: 0,
    categoryName: "",
    image: "",
    purchasePrice: 0,
    status: "",
  });

  const columns: {
    key: keyof ProductTypes;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    hidden?: boolean;
    editable?: boolean;
    dependentOn?: keyof ProductTypes;
    validationMessage?: string;
    render?: (item: ProductTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "productName",
      label: "Nombre del producto",
      required: true,
      minLength: 2,
      maxLength: 40,
      regex: /^[A-Za-záéíóúÁÉÍÓÚ0-9\s\.,;¡!¿?(){}[\]@#%&*+_\\/-]+$/,
    },
    {
      key: "price",
      label: "Precio de venta",
      required: true,
      regex: /^\d+$/,
      render: (item) => item.price.toLocaleString('es-ES')
    },
    {
      key: "description",
      label: "Medidas",
      required: true,
      minLength: 2,
      maxLength: 80,
      regex: /^[A-Za-záéíóúÁÉÍÓÚ0-9\s\.,;¡!¿?(){}[\]@#%&*+_\\/-]+$/,
    },
    {
      key: "purchasePrice",
      label: "Precio de compra",
      required: true,
      regex: /^\d+$/,
      render: (item) => item.purchasePrice.toLocaleString('es-ES')
    },
    {
      key: "quantity",
      hidden: true,
      label: "Cantidad inicial",
      required: true,
      regex: /^\d+$/,
      render: (item) => item.quantity.toLocaleString('es-ES')
    },
    { 
      key: "categoryId", 
      required: true,
      label: "Categoria", 
      hidden: true 
    },
    {
      key: "categoryName",
      label: "Categoria",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
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
  ];

  const renderCustomFormField = (
    colKey: keyof ProductTypes,
    value: any,
    onChange: (update: Partial<ProductTypes>) => void
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
                onChange({ image: file as unknown } as Partial<ProductTypes>);
              }
            }}
          />
        </div>
      );
    }

    if (colKey === "categoryId") {
      return (
        <CategorySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCategoryId: number) => {
            onChange({ categoryId: newCategoryId });
          }}
        />
      );
    }
    if (colKey === "price" || colKey === "purchasePrice" || colKey === "quantity") {
      const numValue = value > 0 ? value : '';
      const displayValue = numValue ? numValue.toLocaleString('es-ES') : '';
      
      const placeholders: Record<string, string> = {
        price: "Ej: 50.000",
        purchasePrice: "Ej: 30.000",
        quantity: "Ej: 100"
      };

      return (
        <Form.Control
          type="text"
          placeholder={placeholders[colKey]}
          value={displayValue}
          onChange={(e) => {
            const input = e.target.value.replace(/\./g, "");
            if (!/^\d*$/.test(input)) return;
            onChange({ [colKey]: input ? parseInt(input) : 0 } as Partial<ProductTypes>);
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid  p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de Productos
          </h3>
          <FavoritoButton path="/product" label="Productos" />
        </div>
        <p>
          Administre los productos mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<ProductTypes>
              fetchItems={GetProduct}
              searchItem={GetSearchProduct}
              createItem={CreateProduct}
              updateItem={UpdateProduct}
              deleteItem={DeleteProduct}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={ProductSortFieldMap}
              pageTitle="Productos"
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;