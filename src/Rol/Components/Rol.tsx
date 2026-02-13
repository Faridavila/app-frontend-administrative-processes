import { useState, useEffect } from 'react';
import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RolTypes, PermissionType, Permission } from "../Types/RolTypes";
import { RolSortFieldMap } from "../Types/MapeoRol";
import {
  GetRol,
  GetAllPermissions,
  CreateRol,
  UpdateRol,
  DeleteRol,
  GetSearchRol,
} from "../API/RolAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import { Form, Badge, Spinner } from 'react-bootstrap';

const RolCRUD = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setIsLoadingPermissions(true);
    try {
      const result = await GetAllPermissions();
      setPermissions(result);
    } catch (error) {
      console.error("Error cargando permisos:", error);
      setPermissions([]);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleAddModalOpen = () => {
    loadPermissions();
  };

  const handleEditModalOpen = (item: RolTypes) => {
    loadPermissions();
  };

  const itemTemplate = (): RolTypes => ({
    id: 0,
    name: "",
    status: "ACTIVE",
    permissions: [],
    numberPermissions: 0,
  });

  const columns = [
    { 
      key: "id" as const, 
      label: "ID", 
      hiddenInCreate: true, 
      hiddenInEdit: true 
    },
    {
      key: "name" as const,
      label: "Nombre",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/
    },
    {
      key: "permissions" as const,
      label: "Permisos",
      hidden: true,
      render: (item: RolTypes) => {
        if (item.permissions.length === 0) {
          return <Badge bg="secondary">Sin permisos</Badge>;
        }
        return (
          <div className="d-flex flex-wrap gap-1 align-items-center">
            {item.permissions.map((perm, i) => (
              <Badge key={i} bg="info" className="text-dark">
                {perm.permissionName}
              </Badge>
            ))}
            <small className="text-muted ms-2">({item.permissions.length})</small>
          </div>
        );
      },
    },
    { 
      key: "numberPermissions" as const, 
      label: "Cantidad de permisos", 
      hiddenInCreate: true, 
      hiddenInEdit: true 
    },
  ];

  const renderCustomFormField = (
    colKey: keyof RolTypes,
    value: any,
    onUpdate: (update: Partial<RolTypes>) => void,
    currentItem: RolTypes
  ) => {
    if (colKey === "permissions") {
      const selectedPermissionIds = currentItem.permissions.map(p => p.permissionId);
      
      // 🔥 VERIFICAR SI TODOS ESTÁN SELECCIONADOS
      const allSelected = permissions.length > 0 && 
                         selectedPermissionIds.length === permissions.length;
      
      // 🔥 VERIFICAR SI ALGUNOS ESTÁN SELECCIONADOS (para indeterminate)
      const someSelected = selectedPermissionIds.length > 0 && 
                          selectedPermissionIds.length < permissions.length;

      const handlePermissionToggle = (permission: Permission, checked: boolean) => {
        let newPermissions: PermissionType[];

        if (checked) {
          newPermissions = [
            ...currentItem.permissions, 
            { 
              permissionId: permission.id, 
              permissionName: permission.name 
            }
          ];
        } else {
          newPermissions = currentItem.permissions.filter(
            p => p.permissionId !== permission.id
          );
        }

        onUpdate({
          permissions: newPermissions,
          numberPermissions: newPermissions.length,
        });
      };

      // 🔥 MANEJAR SELECCIONAR/DESELECCIONAR TODOS
      const handleSelectAll = (checked: boolean) => {
        if (checked) {
          // Seleccionar todos
          const allPermissions: PermissionType[] = permissions.map(p => ({
            permissionId: p.id,
            permissionName: p.name
          }));
          onUpdate({
            permissions: allPermissions,
            numberPermissions: allPermissions.length,
          });
        } else {
          // Deseleccionar todos
          onUpdate({
            permissions: [],
            numberPermissions: 0,
          });
        }
      };

      return (
        <div>
          <Form.Label className="mb-2 fw-medium">
            Seleccionar permisos (pantallas) para este rol
          </Form.Label>
          
          <div
            style={{
              maxHeight: '320px',
              overflowY: 'auto',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              minHeight: '100px',
            }}
          >
            {isLoadingPermissions ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                <Spinner animation="border" role="status" size="sm" variant="primary">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <span className="ms-2 text-muted">Cargando permisos...</span>
              </div>
            ) : permissions.length === 0 ? (
              <p className="text-muted text-center my-4">
                No hay permisos disponibles
              </p>
            ) : (
              <>
                <Form.Check
                  type="checkbox"
                  id="select-all-permissions"
                  label={
                    <span className="fw-medium">
                      Seleccionar todos
                    </span>
                  }
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="py-2 border-bottom mb-2"
                  style={{ 
                    borderRadius: '0.25rem',
                    marginBottom: '0.5rem'
                  }}
                />

                {/* LISTA DE PERMISOS */}
                {permissions.map((permission) => {
                  const isChecked = selectedPermissionIds.includes(permission.id);

                  return (
                    <Form.Check
                      key={permission.id}
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      label={
                        <div>
                          <span className="fw-medium">{permission.name}</span>
                          {permission.description && (
                            <small className="text-muted d-block">
                              {permission.description}
                            </small>
                          )}
                        </div>
                      }
                      checked={isChecked}
                      onChange={(e) => handlePermissionToggle(permission, e.target.checked)}
                      className="py-2 border-bottom"
                    />
                  );
                })}
              </>
            )}
          </div>
          
          {currentItem.permissions.length > 0 && (
            <small className="fw-medium mt-2 d-block">
              ✓ {currentItem.permissions.length} permiso(s) seleccionado(s)
            </small>
          )}
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
            <h3 style={{ margin: 0, fontSize: "21px" }}>
              Gestión de roles
            </h3>
            <FavoritoButton path="/rol" label="Roles" />
          </div>
          <p>
            Administre los roles y sus permisos mediante la creación, edición o eliminación de registros.
          </p>

          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<RolTypes>
                fetchItems={GetRol}
                searchItem={GetSearchRol}
                createItem={CreateRol}
                updateItem={UpdateRol}
                deleteItem={DeleteRol}
                itemTemplate={itemTemplate}
                columns={columns}
                filterButtonOrder={1}
                sortFieldMap={RolSortFieldMap}
                pageTitle="Rol"
                renderCustomFormField={renderCustomFormField}
                onAddModalOpen={handleAddModalOpen}
                onEditModalOpen={handleEditModalOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolCRUD;