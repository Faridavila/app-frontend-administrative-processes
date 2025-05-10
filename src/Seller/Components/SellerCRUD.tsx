import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { SellerTypes } from "../Types/SellerTypes";
import { SellerSortFieldMap } from "../Types/MapeoSellerTypes";
import {
  GetSeller,
  CreateSeller,
  UpdateSeller,
  DeleteSeller,
  GetSearchSeller,
} from "../API/SellerAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const SellerCRUD = () => {
  const itemTemplate = (): SellerTypes => ({
    id: 0,
    name: "",
    lastName: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof SellerTypes;
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
    {key: "name",label: "Nombre",},
    {key: "lastName",label: "Apellido",},
    {key: "email",label: "Correo",},
    {key: "phone",label: "Celular",},
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
            Gestión de vendedores
          </h3>
          <FavoritoButton path="/Seller" label="Tipo de documento contable" />
        </div>
        <p>
          Administre los vendedores mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<SellerTypes>
              fetchItems={GetSeller}
              searchItem={GetSearchSeller}
              createItem={CreateSeller}
              updateItem={UpdateSeller}
              deleteItem={DeleteSeller}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={SellerSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCRUD;
