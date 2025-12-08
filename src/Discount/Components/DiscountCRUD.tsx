import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { DiscountTypes } from "../Types/DiscountTypes";
import { DiscountSortFieldMap } from "../Types/MapeoDiscount";
import {
  GetDiscount,
  CreateDiscount,
  UpdateDiscount,
  DeleteDiscount,
  GetSearchDiscount,
} from "../API/DiscountAPI";
import AccountingDocumentTypestSelect from "./DiscountSelectDiscountType";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import "react-datepicker/dist/react-datepicker.css";

const DiscountCRUD = () => {
  const itemTemplate = (): DiscountTypes => ({
    id: 0,
    amount: "",
    quantity: "",
    discountTypeName: "",
    discountTypeId: 0,
    status: "ACTIVE",
  });

  const columns: {
    key: keyof DiscountTypes;
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
    { key: "amount", label: "Monto",  },
    { key: "quantity", label: "Cantidad", required: true },
    { key: "discountTypeName", label: "Tipo de descuento", hiddenInCreate: true, hiddenInEdit: true },
    { key: "discountTypeId", label: "Tipo de descuento", hidden: true },
  ];

  const renderCustomFormField = (
    colKey: keyof DiscountTypes,
    value: string,
    onChange: (newValue: string) => void
  ) => {
    if (colKey === "discountTypeId") {
      return (
        <AccountingDocumentTypestSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newAccountingDocumentTypestId: number) =>
            onChange(newAccountingDocumentTypestId.toString())
          }
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
            Gestión de descuento
          </h3>
          <FavoritoButton path="/Discount" label="Discount" />
        </div>
        <p>
          Administre los descuentos mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<DiscountTypes>
              fetchItems={GetDiscount}
              searchItem={GetSearchDiscount}
              createItem={CreateDiscount}
              updateItem={UpdateDiscount}
              deleteItem={DeleteDiscount}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={DiscountSortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCRUD;
