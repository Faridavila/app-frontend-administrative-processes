import { useState, useEffect } from 'react';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { TerminalTypes } from "../Types/TerminalTypes";
import { TerminalSortFieldMap } from "../Types/MapeoTerminal";
import {
  GetTerminal,
  CreateTerminal,
  UpdateTerminal,
  DeleteTerminal,
  GetSearchTerminal,
} from "../API/TerminalAPI";
import { GetAllUseresNoPage } from '../../User/API/UserAPI';
import { Form, Badge } from 'react-bootstrap';
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import NumerationSelect from "./SelectNumeration";

const TerminalCRUD = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const result = await GetAllUseresNoPage();
      if (result && result.content) {
        setUsers(result.content);
      } else if (Array.isArray(result)) {
        setUsers(result);
      }
    };
    loadUsers();
  }, []);

  const itemTemplate = (): TerminalTypes => ({
    id: 0,
    name: "",
    prefix: "",
    numerationId: 0,
    initialNumber: 0,
    finalNumber: 0,
    userId: 0,
    userName: "",
    numberUser: 0,
    status: "",
  });

  const columns = [
    { key: "id" as const, label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "name" as const, label: "Nombre", required: true },
    { key: "prefix" as const, label: "Prefijo", hiddenInCreate: true, hiddenInEdit: true, hidden:true },

    { key: "numerationId" as const, label: "Rango de numeración",  required: true },
    {
      key: "userName" as const,
      label: "Usuarios",
      hidden:true ,
      render: (item: TerminalTypes) => {
        if (!item.userName) return <Badge bg="secondary">Sin usuarios</Badge>;
        const userList = item.userName.split(', ').filter(Boolean);
        return (
          <div className="d-flex flex-wrap gap-1">
            {userList.map((user, i) => (
              <Badge key={i} bg="info" className="text-dark">
                {user}
              </Badge>
            ))}
            <small className="text-muted ms-2">({item.numberUser})</small>
          </div>
        );
      }
    },
    {key: "numberUser" as const, label: "Usuarios asignados", hiddenInCreate: true, hiddenInEdit: true,  },
    { key: "status" as const, label: "Estado", hiddenInCreate: true, hiddenInEdit: true },
  ];

  const renderCustomFormField = (
    colKey: keyof TerminalTypes,
    value: any,
    onUpdate: (update: Partial<TerminalTypes>) => void,
    currentItem: TerminalTypes
  ) => {
    if (colKey === "numerationId") {
      return (
        <NumerationSelect
          selectedValue={parseInt(value || "0", 10)}
          onChange={(newValue) => onUpdate({ numerationId: newValue })}
        />
      );
    }

    if (colKey === "userName") {
      return (
        <div>
          <Form.Label className="text-muted text-white mb-2">
            Seleccionar usuarios que usarán esta terminal
          </Form.Label>
          <div 
            
          >
            {users.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mt-2 mb-0">Cargando usuarios...</p>
              </div>
            ) : (
              users.map((user: any) => {
                const isChecked = currentItem.userName?.includes(user.name) || false;
                return (
                  <Form.Check
                    key={user.id}
                    type="checkbox"
                    id={`user-${user.id}`}
                    label={
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="text-muted fw-medium">{user.name}</span>
                      </div>
                    }
                    checked={isChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = currentItem.userName ? currentItem.userName.split(', ') : [];
                      const newUsers = checked
                        ? [...current.filter(Boolean), user.name]
                        : current.filter(u => u !== user.name);

                      onUpdate({
                        userName: newUsers.join(', '),
                        numberUser: newUsers.length,
                      });
                    }}
                    className=" p-1 "
                  />
                );
              })
            )}
          </div>
        </div>
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
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "21px" }}>Gestión de Terminales</h3>
            <FavoritoButton path="/Terminal" label="Terminales" />
          </div>
          <p>Administre los terminales mediante la creación, edición o eliminación de registros.</p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<TerminalTypes>
                fetchItems={GetTerminal}
                searchItem={GetSearchTerminal}
                createItem={CreateTerminal}
                updateItem={UpdateTerminal}
                deleteItem={DeleteTerminal}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={2}
                addButtonOrder={1}
                editButtonOrder={3}
                deleteButtonOrder={4}
                hiddenDownloadButton={false}
                sortFieldMap={TerminalSortFieldMap}
                pageTitle="Terminal"
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalCRUD;