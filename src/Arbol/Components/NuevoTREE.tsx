import React, { useState, useEffect } from "react";
import { Card, Table, Col, Row, Button, Modal, Alert } from "react-bootstrap";
import { AddIcon, Recharge, EditIcon, DeleteIcon } from "../Icons/Icons";
import {
  fetchAllAccountClasses,
  fetchAllAccountGroups,
  fetchAllAccounts,
  fetchAllSubAccounts,
  fetchAuxiliaryAccountsBySubAccountId,
  createAuxiliaryAccount,
  updateAuxiliaryAccount,
  deleteAuxiliaryAccount,
} from "../API/PUCTreeAPI";
import AccountingTree from "./treeNUevo";
import { TreeNode } from "../Types/PUCType";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const TreePUC: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<{
    [key: number]: TreeNode | null;
  }>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedAuxiliary, setEditedAuxiliary] = useState({
    code: "",
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const loadTreeData = async () => {
    try {
      const classes = await fetchAllAccountClasses();
      const treeData = await Promise.all(
        classes.map(async (cls) => {
          const groups = await fetchAllAccountGroups(cls.id);
          const groupData = await Promise.all(
            groups.map(async (grp) => {
              const accounts = await fetchAllAccounts(grp.id);
              const accountData = await Promise.all(
                accounts.map(async (acc) => {
                  const subAccounts = await fetchAllSubAccounts(acc.id);
                  const subAccountData = await Promise.all(
                    subAccounts.map(async (sub) => {
                      const auxiliaries =
                        await fetchAuxiliaryAccountsBySubAccountId(sub.id);
                      return {
                        ...sub,
                        children: auxiliaries,
                      };
                    })
                  );
                  return {
                    ...acc,
                    children: subAccountData,
                  };
                })
              );
              return {
                ...grp,
                children: accountData,
              };
            })
          );
          return {
            ...cls,
            children: groupData,
          };
        })
      );

      setTreeData(treeData);
    } catch (error) {
      console.error("Error al cargar los datos del árbol contable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreeData();
  }, []);

  const handleNodeSelect = (node: TreeNode) => {
    const selectedClassId = selectedNodes[1]?.id;
    const selectedGroupId = selectedNodes[2]?.id;
    const selectedAccountId = selectedNodes[3]?.id;
    const selectedSubAccountId = selectedNodes[4]?.id;

    const isDifferentTree =
      (node.level === 1 && selectedClassId && selectedClassId !== node.id) ||
      (node.level === 2 && selectedGroupId && selectedGroupId !== node.id) ||
      (node.level === 3 &&
        selectedAccountId &&
        selectedAccountId !== node.id) ||
      (node.level === 4 &&
        selectedSubAccountId &&
        selectedSubAccountId !== node.id) ||
      (node.level === 5 &&
        selectedSubAccountId &&
        node.subAccountingAccountId &&
        selectedSubAccountId !== node.subAccountingAccountId);

    if (isDifferentTree) {
      setShowWarning(true);
    } else {
      setSelectedNodes((prevState) => ({
        ...prevState,
        [node.level]: node,
      }));
      setShowWarning(false);

      if (node.level === 5) {
        setEditedAuxiliary({ code: node.code, name: node.name });
      }

      console.log("Nodo seleccionado:", node);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
  };

  const handleClearTable = () => {
    setSelectedNodes({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setEditing(false);
    setEditedAuxiliary({ code: "", name: "" });
  };

  const handleEditAuxiliary = () => {
    if (selectedNodes[5]) {
      setEditing(true);
      setShowModal(true);
    } else {
      alert("Error: No se ha seleccionado ninguna cuenta auxiliar.");
    }
  };

  const handleSaveAuxiliary = async () => {
    if (!editedAuxiliary.code || !editedAuxiliary.name) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const auxiliaryAccountId = selectedNodes[5]?.id;
    const subAccountingAccountId = selectedNodes[4]?.id || 0;

    if (editing && !auxiliaryAccountId) {
      alert("Error: No se encontró el ID de la cuenta auxiliar.");
      return;
    }

    const auxiliaryAccount: TreeNode = {
      id: auxiliaryAccountId!,
      code: editedAuxiliary.code,
      name: editedAuxiliary.name,
      subAccountingAccountId: subAccountingAccountId,
      status: "ACTIVE",
      level: 5,
    };

    try {
      if (editing) {
        await updateAuxiliaryAccount(
          auxiliaryAccountId as number,
          auxiliaryAccount
        );
        alert("Cuenta auxiliar actualizada exitosamente");
      } else {
        await createAuxiliaryAccount(auxiliaryAccount);
        alert("Cuenta auxiliar creada exitosamente");
      }
      setShowModal(false);
      handleClearTable();
      await loadTreeData();
    } catch (error) {
      console.error("Error al guardar la cuenta auxiliar:", error);
      alert("Hubo un error al guardar la cuenta auxiliar");
    }
  };

  const handleDeleteAuxiliary = async () => {
    if (selectedNodes[5]) {
      try {
        await deleteAuxiliaryAccount(selectedNodes[5].id as number);
        alert("Cuenta auxiliar eliminada exitosamente");
        handleClearTable();
        await loadTreeData();
      } catch (error) {
        console.error("Error al eliminar la cuenta auxiliar:", error);
        alert("Hubo un error al eliminar la cuenta auxiliar");
      }
    }
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3
                      className="content-body"
                      style={{ margin: "0", fontSize: "21px" }}
                    >
                      Árbol Contable
                    </h3>
                    <FavoritoButton path="/arbol" label="Árbol" />
                  </div>
                </h2>
                <div className="breadcrumb-wrapper">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Árbol Contable</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-body">
          <Row>
            <Col md={6}>
              <Card className="shadow-lg animate__animated animate__fadeInUp mb-4">
                <Card.Body>
                  <div className="mb-2">
                    <strong>Código</strong>{" "}
                    <strong style={{ marginLeft: "80px" }}>
                      Cuenta contable
                    </strong>
                  </div>

                  {loading ? (
                    <p>Cargando...</p>
                  ) : (
                    <AccountingTree
                      data={treeData}
                      onNodeSelect={handleNodeSelect}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-lg animate__animated animate__fadeInUp mb-4">
                <Card.Body>
                  <h4>Detalles de la Cuenta</h4>
                  {showWarning && (
                    <Alert variant="warning">
                      No puedes seleccionar elementos de diferentes árboles al
                      mismo tiempo. Por favor, limpia la tabla antes de
                      continuar.
                    </Alert>
                  )}
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Nivel</th>
                        <th>Código</th>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Clase cuenta contable</td>
                        <td>{selectedNodes[1]?.code || ""}</td>
                        <td>{selectedNodes[1]?.name || ""}</td>
                      </tr>
                      <tr>
                        <td>Grupo Cuenta Contable</td>
                        <td>{selectedNodes[2]?.code || ""}</td>
                        <td>{selectedNodes[2]?.name || ""}</td>
                      </tr>
                      <tr>
                        <td>Cuenta contable</td>
                        <td>{selectedNodes[3]?.code || ""}</td>
                        <td>{selectedNodes[3]?.name || ""}</td>
                      </tr>
                      <tr>
                        <td>Sub cuenta contable</td>
                        <td>{selectedNodes[4]?.code || ""}</td>
                        <td>{selectedNodes[4]?.name || ""}</td>
                      </tr>
                      <tr>
                        <td>Cuenta Auxiliar contable</td>
                        <td>
                          <input
                            type="text"
                            value={editedAuxiliary.code}
                            onChange={(e) =>
                              setEditedAuxiliary({
                                ...editedAuxiliary,
                                code: e.target.value,
                              })
                            }
                            readOnly={!editing}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editedAuxiliary.name}
                            onChange={(e) =>
                              setEditedAuxiliary({
                                ...editedAuxiliary,
                                name: e.target.value,
                              })
                            }
                            readOnly={!editing}
                            className="form-control"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between">
                    <Button
                      className="btn btn-primary btn-small"
                      onClick={handleShowModal}
                      aria-label="Añadir Nuevo Elemento"
                      style={{
                        marginRight: "-50px",
                        marginBottom: "60px",
                        marginTop: "-70px",
                      }}
                    >
                      <AddIcon />
                    </Button>
                    <Button
                      className="btn btn-warning btn-small"
                      onClick={handleEditAuxiliary}
                      disabled={!selectedNodes[5]}
                      style={{
                        marginRight: "30px",
                        marginBottom: "60px",
                        marginTop: "-70px",
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      className="btn btn-success "
                      onClick={handleSaveAuxiliary}
                      disabled={!editing}
                      style={{
                        marginRight: "10px",
                        marginBottom: "60px",
                        marginTop: "20px",
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      className="btn btn-danger"
                      onClick={handleCloseModal}
                      disabled={!editing}
                      style={{
                        marginRight: "500px",
                        marginBottom: "60px",
                        marginTop: "20px",
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="btn btn-danger btn-small"
                      onClick={handleDeleteAuxiliary}
                      disabled={!selectedNodes[5]}
                      style={{
                        marginRight: "70px",
                        marginBottom: "60px",
                        marginTop: "-70px",
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      className="btn btn-primary btn-small"
                      onClick={handleClearTable}
                      style={{
                        marginRight: "-10px",
                        marginBottom: "60px",
                        marginTop: "-70px",
                      }}
                    >
                      <Recharge />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing
                  ? "Editar Cuenta Auxiliar"
                  : "Añadir Nueva Cuenta Auxiliar"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nivel</th>
                    <th>Código</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Clase cuenta contable</td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[1]?.code || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[1]?.name || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Grupo Cuenta Contable</td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[2]?.code || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[2]?.name || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cuenta contable</td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[3]?.code || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[3]?.name || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Sub cuenta contable</td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[4]?.code || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[4]?.name || ""}
                        readOnly
                        className="form-control"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cuenta Auxiliar contable</td>
                    <td>
                      <input
                        type="text"
                        value={editedAuxiliary.code}
                        onChange={(e) =>
                          setEditedAuxiliary({
                            ...editedAuxiliary,
                            code: e.target.value,
                          })
                        }
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedAuxiliary.name}
                        onChange={(e) =>
                          setEditedAuxiliary({
                            ...editedAuxiliary,
                            name: e.target.value,
                          })
                        }
                        className="form-control"
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleSaveAuxiliary}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TreePUC;
