import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { ClientTypes } from "../Types/ClientTypes";
import { ClientSortFieldMap } from "../Types/MapeoClientTypes";
import {
  GetClient,
  CreateClient,
  UpdateClient,
  DeleteClient,
  GetSearchClient,
} from "../API/ClientAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import IdentificationTypeSelect from "./IdentificationTypeSelect";
import PersonTypeSelect from "./TypePersonSelect";
import TaxLiabilitySelect from "./TaxLiabilitySelect";
import CitySelect from "../../NeighborhoodRate/Components/SelectCity";
import DepartmentSelect from "../../NeighborhoodRate/Components/SelectDepartment";

const ClientCRUD = () => {
  const itemTemplate = (): ClientTypes => ({
    id: 0,
    name: "",
    typeIdentificationId:0,
    identificationType: "",
    identification: 0,
    verificationDigit: 0,
    personTypeId: 0,
    personType: "",
    taxLiabilityId: 0,
    taxLiability: "",
    departmentId: 0,
    departmentName: "",
    municipalityId: 0,
    municipality: "",
    neighborhoodName: "",
    address: "",
    email: "",
    phone: "",
    status: "",
  });

  const columns: {
    key: keyof ClientTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    render?: (item: ClientTypes) => React.ReactNode;
    formHidden?: (item: ClientTypes) => boolean;
    type?: "text" | "number" | "image" | "password";
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
    { key: "name", label: "Nombre y apellidos", required: true },
    { key: "typeIdentificationId", label: "Tipo de identificacion",hidden: true, },
    { key: "identificationType", label: "Tipo de identificacion",hiddenInCreate: true, hiddenInEdit: true,  
       render: (item) => {
        const observation = item.identificationType || "No disponible";
        return <span>{observation}</span>;
      }
     },
    { key: "identification", label: "Identificacion",
       render: (item) => {
        const observation = item.identification || "No disponible";
        return <span>{observation}</span>;
      }
      },
    { 
      key: "verificationDigit", 
      label: "Dígito de Verificación (DV)", 
      type: "number",
      formHidden: (item) => {
        const typeId = String(item.typeIdentificationId);
        return typeId !== "6";
      },hidden: true,
    },
    { 
      key: "personTypeId", 
      label: "Tipo de persona",
      formHidden: (item) => {
        const typeId = String(item.typeIdentificationId);
        return typeId !== "6";
      },hidden: true,
    }, 
    { key: "personType", label: "Tipo de persona", hidden: true, hiddenInCreate: true, hiddenInEdit: true },
    { 
      key: "taxLiabilityId", 
      label: "Responsabilidad tributaria",
      formHidden: (item) => {
        const typeId = String(item.typeIdentificationId);
        return typeId !== "6";
      },hidden: true,
    }, 
    { key: "taxLiability", label: "Responsabilidad tributaria", hidden: true, hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "departmentId",
      label: "Departamento",
      hidden: true,
      type: "number",
    },
    {
      key: "departmentName",
      label: "Departamento",
      required: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
      hidden: true,
    },
    {
      key: "municipalityId",
      label: "Municipio",
      hidden: true,
      type: "number",
    },
    {
      key: "municipality",
      label: "Municipio",
      hiddenInCreate: true,
      hiddenInEdit: true,
       render: (item) => {
        const observation = item.municipality || "No disponible";
        return <span>{observation}</span>;
      }
    },
    { key: "neighborhoodName", label: "Barrio",required: true,
       render: (item) => {
        const observation = item.neighborhoodName || "No disponible";
        return <span>{observation}</span>;
      }
     },
    { key: "address", label: "Direccion", required: true },
    { key: "phone", label: "Celular", required: true },
    { key: "email", label: "Correo",
       render: (item) => {
        const observation = item.email || "No disponible";
        return <span>{observation}</span>;
      }
    },
  ];

  const renderCustomFormField = (
    colKey: keyof ClientTypes,
    value: any,
    onChange: (update: Partial<ClientTypes>) => void
  ) => {
    if (colKey === "departmentId") {
      return (
        <DepartmentSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newDepartmentId: number) => {
            onChange({ departmentId: newDepartmentId });
          }}
        />
      );
    }
    if (colKey === "municipalityId") {
      return (
        <CitySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newMunicipalityId: number) => {
            onChange({ municipalityId: newMunicipalityId });
          }}
        />
      );
    }
    if (colKey === "typeIdentificationId") {
      return (
        <IdentificationTypeSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newTypeId: number) => {
            console.log("Tipo de identificación seleccionado:", newTypeId);
            
            const update: Partial<ClientTypes> = { 
              typeIdentificationId: Number(newTypeId) 
            };
            
            if (newTypeId !== 6) {
              update.verificationDigit = 0;
              update.personTypeId = 0;
              update.taxLiabilityId = 0;
            }
            
            onChange(update);
          }}
        />
      );
    }
    if (colKey === "personTypeId") {
      return (
        <PersonTypeSelect
          selectedValue={parseInt(value, 10)}
          onChange={(newValue: number) => onChange({ personTypeId: newValue })}
        />
      );
    }
    if (colKey === "taxLiabilityId") {
      return (
        <TaxLiabilitySelect
          selectedValue={parseInt(value, 10)}
          onChange={(newValue: number) => onChange({ taxLiabilityId: newValue })}
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
            Gestión de clientes
          </h3>
          <FavoritoButton path="/client" label="Clientes" />
        </div>
        <p>
          Administre los clientes mediante la creación, edición o eliminación
          de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<ClientTypes>
              fetchItems={GetClient}
              searchItem={GetSearchClient}
              createItem={CreateClient}
              updateItem={UpdateClient}
              deleteItem={DeleteClient}
              itemTemplate={itemTemplate}
              columns={columns}
              filterButtonOrder={1}
              sortFieldMap={ClientSortFieldMap}
              pageTitle="Clientes"
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCRUD;