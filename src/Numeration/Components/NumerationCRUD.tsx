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
    authNumber: 0,
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
     type?: "text" | "number" | "image" | "password" | "date";
    render?: (item: NumerationTypes) => React.ReactNode;
  }[] = [
      { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
      { key: "prefix", label: "Prefijo", required: true },
      { key: "authNumber", label: "Número de autorización", },

      {
        key: "startDate", 
        label: "Fecha de autorización", 
        required: true,
        type: "date",
        render: (item) => {
          if (!item.startDate) return "No disponible";
          // ✅ CORREGIDO: Usar split para evitar problemas de zona horaria
          const [year, month, day] = item.startDate.split('-');
          return <span>{`${day}/${month}/${year}`}</span>;
        }
      },
      {
        key: "finishDate", 
        label: "Fecha de venciemiento", 
        required: true,
        type: "date",
        render: (item) => {
          if (!item.finishDate) return "No disponible";
          // ✅ CORREGIDO: Usar split para evitar problemas de zona horaria
          const [year, month, day] = item.finishDate.split('-');
          return <span>{`${day}/${month}/${year}`}</span>;
        }
      },


      { key: "initialNumber", label: "Número inicial", required: true,  },
      { key: "finalNumber", label: "Número final", required: true, },
      { key: "currentNumber", label: "Número actual", required: true, },

    ];

  // El campo "startDate" y "finishDate" ahora son manejados automáticamente por CRUDForm
  // ya que tienen type: "date" en la definición de columnas
  const renderCustomFormField = (
    colKey: keyof NumerationTypes,
    value: any,
    onUpdate: (update: Partial<NumerationTypes>) => void,
  ) => {
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