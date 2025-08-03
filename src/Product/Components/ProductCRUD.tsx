import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProductTypes } from "../Types/ProductTypes";
import { ProductSortFieldMap } from "../Types/MapeoProductTypes";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import CategorySelect from "./CategorySelectProduct";
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
    price: "",
    description: "",
    quantity: 0,
    categoryId: 0,
    categoryName: "",
    status: "", 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agotado":
        return "red"; 
      case "pocas unidades":
        return "yellow";
      case "disponible":
        return "green"; 
      default:
        return "transparent"; 
    }
  };

  const columns: {
    key: keyof ProductTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "productName", label: "Nombre del producto" },
    { key: "price", label: "Precio" },
    { key: "description", label: "Descripcion" },
    { key: "quantity", label: "Cantidad" },
    { key: "categoryId", label: "Categoria", hidden: true },
    { key: "categoryName", label: "Categoria", hiddenInCreate: true, hiddenInEdit: true },
    { key: "status", label: "Estado", hiddenInCreate: true, hiddenInEdit: true },
  ];


  const renderCustomFormField = (
    colKey: keyof ProductTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "categoryId") {
      return (
        <CategorySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newCategoryId: number) => onChange(newCategoryId.toString())}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de Inventario
          </h3>
          <FavoritoButton path="/inventory" label="Inventario" />
        </div>
        <p>
          Administre los productos mediante la creación, edición o eliminación de registros.
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
              sortFieldMap={ProductSortFieldMap}
              renderCustomFormField={renderCustomFormField}
              renderCustomColumn={(col, item) => {
                if (col.key === 'status') {
                  return (
                    <span
                      style={{
                        backgroundColor: getStatusColor(item.status), 
                        padding: '5px',
                        borderRadius: '5px',
                        color: '#fff',
                      }}
                    >
                      {item.status}
                    </span>
                  );
                }
                return item[col.key];
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;
