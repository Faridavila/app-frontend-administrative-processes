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
import { GetAllUserByTerminal } from '../../User/API/UserAPI';
import { Form, Badge, Spinner } from 'react-bootstrap';
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import NumerationSelect from "./SelectNumeration";

const TerminalCRUD = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentTerminalId, setCurrentTerminalId] = useState<number | undefined>();
  const [isLoadingUsers, setIsLoadingUsers] = useState(false); // ✅ Estado de carga

  // Función para cargar usuarios según el contexto (crear o editar)
  const loadUsers = async (terminalId?: number) => {
    setIsLoadingUsers(true); // ✅ Inicia loading
    try {
      const result = await GetAllUserByTerminal(terminalId);
      if (result && Array.isArray((result as any).content)) {
        setUsers((result as any).content);
      } else if (Array.isArray(result)) {
        setUsers(result);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false); // ✅ Finaliza loading
    }
  };

  // Cargar usuarios sin terminal al inicio (para crear)
  useEffect(() => {
    loadUsers();
  }, []);

  // Callback cuando se abre el modal de CREAR
  const handleAddModalOpen = () => {
    setCurrentTerminalId(undefined);
    loadUsers(); // Sin terminalId = solo usuarios sin terminal
  };

  // Callback cuando se abre el modal de EDITAR
  const handleEditModalOpen = (item: TerminalTypes) => {
    setCurrentTerminalId(item.id);
    loadUsers(item.id); // Con terminalId = usuarios sin terminal + usuarios de esa terminal
  };

  // Callback cuando se cierra cualquier modal
  const handleModalClose = () => {
    setCurrentTerminalId(undefined);
    loadUsers(); // Reset a usuarios sin terminal
  };

  const itemTemplate = (): TerminalTypes => ({
    id: 0,
    name: "",
    prefix: "",
    numerationId: 0,
    initialNumber: 0,
    finalNumber: 0,
    users: [],           
    numberUser: 0,      
    status: "",
  });

  const columns = [
    { key: "id" as const, label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    { key: "name" as const, label: "Nombre", required: true },
    { key: "numerationId" as const, label: "Rango de numeración", required: true, hidden: true },
    { 
      key: "prefix" as const, 
      label: "Rango de numeración", 
      hiddenInCreate: true, 
      hiddenInEdit: true,
      render: (item: TerminalTypes) => {
        if (!item.prefix || item.initialNumber === null || item.finalNumber === null) {
          return <Badge bg="secondary">Sin numeración</Badge>;
        }
        return (
          <span className="fw-medium">
            {item.prefix} ({item.initialNumber}-{item.finalNumber})
          </span>
        );
      }
    },
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
    { key: "status" as const, label: "Estado", hiddenInCreate: true, hiddenInEdit: true, hidden: true },
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
              minHeight: '100px', // ✅ Altura mínima para evitar saltos
            }}
          >
            {isLoadingUsers ? (
              // ✅ Mostrar spinner mientras carga
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                <Spinner animation="border" role="status" size="sm" variant="primary">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <span className="ms-2 text-muted">Cargando usuarios...</span>
              </div>
            ) : users.length === 0 ? (
              <p className="text-muted text-center my-4">No hay usuarios a los cuales asignarles una terminal</p>
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
                onAddModalOpen={handleAddModalOpen}
                onEditModalOpen={handleEditModalOpen}
                onModalClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalCRUD;