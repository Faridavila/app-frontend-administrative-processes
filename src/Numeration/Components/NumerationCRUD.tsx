import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { NumerationTypes } from "../Types/NumerationTypes";
import { NumerationSortFieldMap } from "../Types/MapeoNumeration";
import {
  GetNumeration,
  CreateNumeration,
  UpdateNumeration,
  DeleteNumeration,
  GetSearchNumeration,
} from "../API/NumerationAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import "react-datepicker/dist/react-datepicker.css";

const NumerationCRUD = () => {
  const itemTemplate = (): NumerationTypes => ({
    id: 0,
    prefix: "",
    startDate: "",
    finishDate: "",
    initialNumber: 0,
    finalNumber: 0,
    currentNumber: 0,
    resolutionNumber: 0,
    status: "",
  });

  const columns: {
    key: keyof NumerationTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: NumerationTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
      { key: "prefix", label: "Prefijo", required: true },
      { key: "resolutionNumber", label: "Número de autorización", },

      {
        key: "startDate", label: "Fecha de autorización", required: true,
        render: (item) => {
          const date = item.startDate ? new Date(item.startDate).toLocaleDateString() : "No disponible";
          return <span>{date}</span>;
        }
      },
      {
        key: "finishDate", label: "Fecha de venciemiento", required: true,
        render: (item) => {
          const date = item.finishDate ? new Date(item.finishDate).toLocaleDateString() : "No disponible";
          return <span>{date}</span>;
        }
      },


      { key: "initialNumber", label: "Número inicial", required: true, minLength: 2, maxLength: 100, },
      { key: "finalNumber", label: "Número final", required: true, minLength: 2, maxLength: 100, },
      { key: "currentNumber", label: "Número actual", required: true, minLength: 2, maxLength: 100, },

    ];

  const renderCustomFormField = (
    colKey: keyof NumerationTypes,
    value: any,
    onUpdate: (update: Partial<NumerationTypes>) => void,
  ) => {
    if (colKey === "startDate" || colKey === "finishDate") {
      return (
        <input
          type="date"
          className="form-control"
          value={value || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            onUpdate({ [colKey]: newValue } as Partial<NumerationTypes>);
          }}
          aria-label="Fecha"
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
          <h3 className="content-body" style={{ margin: "0", fontSize: "21px" }}>
            Gestión de rangos de  numeración de facturación
          </h3>
          <FavoritoButton path="/numeration" label="Rango de numeracion" />
        </div>
        <p>
          Administre los rangos de numeracion de facturación mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<NumerationTypes>
              fetchItems={GetNumeration}
              searchItem={GetSearchNumeration}
              createItem={CreateNumeration}
              updateItem={UpdateNumeration}
              deleteItem={DeleteNumeration}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={2}
              addButtonOrder={1}
              editButtonOrder={3}
              deleteButtonOrder={4}
              hiddenDownloadButton={false}
              sortFieldMap={NumerationSortFieldMap}
              renderCustomFormField={renderCustomFormField}
              pageTitle="Rango de numeración"

            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumerationCRUD;
