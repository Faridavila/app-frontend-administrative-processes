import { useState, useEffect } from 'react';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { TerminalTypes, UserList } from "../Types/TerminalTypes";
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
      try {
        const result = await GetAllUseresNoPage();
        // La API puede devolver { content: [...] } o directamente un array
        if (result && Array.isArray((result as any).content)) {
          setUsers((result as any).content);
        } else if (Array.isArray(result)) {
          setUsers(result);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setUsers([]);
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
    users: [],           // Array vacío inicialmente
    numberUser: 0,       // Se calculará automáticamente si el backend lo requiere
    status: "",
  });

  const columns = [
    { key: "id" as const, label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "name" as const, label: "Nombre", required: true },
    { key: "prefix" as const, label: "Prefijo", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
    { key: "numerationId" as const, label: "Rango de numeración", required: true },
    {
      key: "users" as const,
      label: "Usuarios",
      hidden: true,
      render: (item: TerminalTypes) => {
        if (item.users.length === 0) {
          return <Badge bg="secondary">Sin usuarios</Badge>;
        }
        return (
          <div className="d-flex flex-wrap gap-1 align-items-center">
            {item.users.map((user, i) => (
              <Badge key={i} bg="info" className="text-dark">
                {user.userName}
              </Badge>
            ))}
            <small className="text-muted ms-2">({item.users.length})</small>
          </div>
        );
      },
    },
    { key: "numberUser" as const, label: "Cantidad usuarios", hiddenInCreate: true, hiddenInEdit: true },
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
          selectedValue={parseInt(String(value || "0"), 10)}
          onChange={(newValue) => onUpdate({ numerationId: newValue })}
        />
      );
    }

    if (colKey === "users") {
      const selectedUserIds = currentItem.users.map(u => u.userId);

      const handleUserToggle = (user: any, checked: boolean) => {
        let newUsers: UserList[];

        if (checked) {
          newUsers = [...currentItem.users, { userId: user.id, userName: user.name }];
        } else {
          newUsers = currentItem.users.filter(u => u.userId !== user.id);
        }

        onUpdate({
          users: newUsers,
          numberUser: newUsers.length,  
        });
      };

      return (
        <div>
          <Form.Label className="mb-2 fw-medium">
            Seleccionar usuarios que usarán esta terminal
          </Form.Label>
          <div
            style={{
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid #dee2e6',
              borderRadius: '0.375rem',
              padding: '0.5rem',
            }}
          >
            {users.length === 0 ? (
              <p className="text-muted text-center my-4">Cargando usuarios...</p>
            ) : (
              users.map((user: any) => {
                const isChecked = selectedUserIds.includes(user.id);

                return (
                  <Form.Check
                    key={user.id}
                    type="checkbox"
                    id={`user-${user.id}`}
                    label={<span className="fw-medium">{user.name}</span>}
                    checked={isChecked}
                    onChange={(e) => handleUserToggle(user, e.target.checked)}
                    className="py-1"
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
      <div className="content-wrapper container-fluid p-0">
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