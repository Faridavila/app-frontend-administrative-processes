import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { DiscountTypeTypes } from "../Types/DiscountTypeTypes";
import { DiscountTypeSortFieldMap } from "../Types/MapeoDiscountType";
import {
  GetDiscountType,
  CreateDiscountType,
  UpdateDiscountType,
  DeleteDiscountType,
  GetSearchDiscountType,
} from "../API/DiscountTypeAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const DiscountTypeCRUD = () => {
  const itemTemplate = (): DiscountTypeTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof DiscountTypeTypes;
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
    {key: "description",label: "Tipo  de descuento",},
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
            Gestión de tipo de descuento
          </h3>
          <FavoritoButton path="/DiscountType" label="Tipo de documento contable" />
        </div>
        <p>
          Administre los tipos de descuento mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<DiscountTypeTypes>
              fetchItems={GetDiscountType}
              searchItem={GetSearchDiscountType}
              createItem={CreateDiscountType}
              updateItem={UpdateDiscountType}
              deleteItem={DeleteDiscountType}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={DiscountTypeSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountTypeCRUD;
