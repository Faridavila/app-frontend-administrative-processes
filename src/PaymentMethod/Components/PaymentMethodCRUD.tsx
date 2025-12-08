import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { PaymentMethodTypes } from "../Types/PaymentMethodTypes";
import { PaymentMethodSortFieldMap } from "../Types/MapeoPaymentMethodTypes";
import {
  GetPaymentMethod,
  CreatePaymentMethod,
  UpdatePaymentMethod,
  DeletePaymentMethod,
  GetSearchPaymentMethod,
} from "../API/PaymentMethodAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const PaymentMethodCRUD = () => {
  const itemTemplate = (): PaymentMethodTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof PaymentMethodTypes;
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
      { key: "description", label: "Nombre", },
    ];


  return (
    <div className="app-content content">
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow"></div>
      <div className="content-wrapper container-fluid p-0">
        <div className="content-header row"></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3
            className="content-body"
            style={{ margin: "0", fontSize: "21px" }}
          >
            Gestión de metodo de pago
          </h3>
          <FavoritoButton path="/PaymentMethod" label="Tipo de documento contable" />
        </div>
        <p>
          Administre los metodo de pago mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<PaymentMethodTypes>
              fetchItems={GetPaymentMethod}
              searchItem={GetSearchPaymentMethod}
              createItem={CreatePaymentMethod}
              updateItem={UpdatePaymentMethod}
              deleteItem={DeletePaymentMethod}
              itemTemplate={itemTemplate}
              filterButtonOrder={2}
              addButtonOrder={1}
              editButtonOrder={3}
              deleteButtonOrder={4}
              hiddenDownloadButton={false}
              columns={columns}
              pageTitle="Medio de pago"
              sortFieldMap={PaymentMethodSortFieldMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCRUD;
