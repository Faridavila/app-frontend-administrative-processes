import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ProductTypes } from "../Types/ProductTypes";
import { ProductSortFieldMap } from "../Types/MapeoProductTypes";
import {
  GetProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetSearchProduct,
} from "../API/ProductAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const ProductCRUD = () => {
  const itemTemplate = (): ProductTypes => ({
    id: 0,
    productName: "",
    price: "",
    discountId: 0,
    discountAmount: "",
    taxConfigurationId: 0,
    taxConfigurationName: "",
    status: "ACTIVE",
  });

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
    {key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {key: "productName",label: "Nombre del producto",},
    {key: "price",label: "Precio",},
    {key: "discountId",label: "descuento",hidden:true},
    {key: "discountAmount",label: "descuento",},
    {key: "taxConfigurationId",label: "Impuesto",hiddenInCreate: true, hiddenInEdit: true, hidden:true},
    {key: "taxConfigurationName",label: "Impuesto",hiddenInCreate: true, hiddenInEdit: true },

  ];


  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de productos
          </h3>
          <FavoritoButton path="/Product" label="Tipo de documento contable" />
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
              sortFieldMap={ProductSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;
