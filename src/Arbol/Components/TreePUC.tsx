import React, { useState } from 'react';
import { Accordion, Card, Table, Col, Row, Button, Modal, Alert } from 'react-bootstrap';
import { FaAngleDown } from 'react-icons/fa';
import { AddIcon, Recharge, EditIcon, DeleteIcon } from '../Icons/Icons';
import { DataActivo, DataPasivo } from './TreeCategory';

interface TreeNode {
  level: number;
  code: string;
  name: string;
  children?: TreeNode[];
}

const renderTree = (
  nodes: TreeNode[], 
  parentKey: string, 
  onNodeSelect: (node: TreeNode) => void
) => {
  return nodes.map((node, index) => {
    const currentKey = `${parentKey}-${index}`;
    const hasChildren = node.children && node.children.length > 0;
    const isLevel5 = node.level === 5;

    return (
      <Accordion.Item eventKey={currentKey} key={currentKey} className={`level-${node.level}`}>
        <Accordion.Header className={`level-${node.level}`} onClick={() => onNodeSelect(node)}>
          <div style={{ marginLeft: `${(node.level - 1) * 20}px` }}>
            {!isLevel5 && hasChildren && (
              <FaAngleDown style={{ marginRight: '10px' }} />
            )}
            <span style={{ width: '80px', display: 'inline-block' }}>{node.code}</span>
            <span>{node.name}</span>
          </div>
        </Accordion.Header>
        {hasChildren && (
          <Accordion.Body>
            {renderTree(node.children!, currentKey, onNodeSelect)}
          </Accordion.Body>
        )}
      </Accordion.Item>
    );
  });
};

const AccountingTree: React.FC<{ data: TreeNode[], onNodeSelect: (node: TreeNode) => void }> = ({ data, onNodeSelect }) => {
  return (
    <Accordion alwaysOpen>
      {renderTree(data, 'root', onNodeSelect)}
    </Accordion>
  );
};

const TreePUC: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<{ [key: number]: TreeNode | null }>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedAuxiliary, setEditedAuxiliary] = useState({ code: '', name: '' });

  const handleNodeSelect = (node: TreeNode) => {
    if (selectedNodes[1] && selectedNodes[1]?.code[0] !== node.code[0]) {
      setShowWarning(true);
      return;
    }
    setSelectedNodes(prevState => ({
      ...prevState,
      [node.level]: node,
    }));
    setShowWarning(false);

    if (node.level === 5) {
      setEditedAuxiliary({ code: node.code, name: node.name });
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClearTable = () => {
    setSelectedNodes({
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    });
    setEditing(false);
    setEditedAuxiliary({ code: '', name: '' });
  };

  const handleEditAuxiliary = () => {
    setEditing(true);
  };

  const handleSaveAuxiliary = () => {
    setEditing(false);
    if (selectedNodes[5]) {
      selectedNodes[5].code = editedAuxiliary.code;
      selectedNodes[5].name = editedAuxiliary.name;

      setSelectedNodes({ ...selectedNodes });
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (selectedNodes[5]) {
      setEditedAuxiliary({
        code: selectedNodes[5].code,
        name: selectedNodes[5].name,
      });
    }
  };

  const handleDeleteAuxiliary = () => {
    if (selectedNodes[5]) {
      console.log(`Deleting: ${selectedNodes[5].code} - ${selectedNodes[5].name}`);
      handleClearTable();
    }
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-start mb-0">Árbol Contable</h2>
                <div className="breadcrumb-wrapper">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
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
                    <strong>Código</strong> <strong style={{ marginLeft: '80px' }}>Cuenta contable</strong>
                  </div>
                  
                  <AccountingTree data={DataActivo} onNodeSelect={handleNodeSelect} />
                  <AccountingTree data={DataPasivo} onNodeSelect={handleNodeSelect} />

                </Card.Body>
              </Card>
            </Col>

        
            <Col md={6}>
              <Card className="shadow-lg animate__animated animate__fadeInUp mb-4">
                <Card.Body>
                  <h4>Detalles de la Cuenta</h4>
                  {showWarning && (
                    <Alert variant="warning">
                      No puedes seleccionar elementos de diferentes árboles al mismo tiempo. Por favor, limpia la tabla antes de continuar.
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
                        <td>{selectedNodes[1]?.code || ''}</td>
                        <td>{selectedNodes[1]?.name || ''}</td>
                      </tr>
                      <tr>
                        <td>Grupo Cuenta Contable</td>
                        <td>{selectedNodes[2]?.code || ''}</td>
                        <td>{selectedNodes[2]?.name || ''}</td>
                      </tr>
                      <tr>
                        <td>Cuenta contable</td>
                        <td>{selectedNodes[3]?.code || ''}</td>
                        <td>{selectedNodes[3]?.name || ''}</td>
                      </tr>
                      <tr>
                        <td>Sub cuenta contable</td>
                        <td>{selectedNodes[4]?.code || ''}</td>
                        <td>{selectedNodes[4]?.name || ''}</td>
                      </tr>
                      <tr>
                        <td>Cuenta Auxiliar contable</td>
                        <td>
                          <input
                            type="text"
                            value={editedAuxiliary.code}
                            onChange={(e) => setEditedAuxiliary({ ...editedAuxiliary, code: e.target.value })}
                            readOnly={!editing}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editedAuxiliary.name}
                            onChange={(e) => setEditedAuxiliary({ ...editedAuxiliary, name: e.target.value })}
                            readOnly={!editing}
                            className="form-control"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between">
                    <Button
                      className='btn btn-primary btn-small'
                      onClick={handleShowModal}
                      aria-label="Añadir Nuevo Elemento"
                      style={{ marginRight: '-50px', marginBottom: '60px', marginTop: '-70px' }} 
                    >
                      <AddIcon />
                    </Button>
                    <Button
                      className='btn btn-warning btn-small'
                      onClick={handleEditAuxiliary}
                      disabled={!selectedNodes[5]}
                      style={{ marginRight: '30px', marginBottom: '60px', marginTop: '-70px' }} 
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      className='btn btn-success '
                      onClick={handleSaveAuxiliary}
                      disabled={!editing}
                      style={{ marginRight: '10px', marginBottom: '60px', marginTop: '20px' }}
                    >
                      Guardar
                    </Button>
                    <Button
                      className='btn btn-danger'
                      onClick={handleCancelEdit}
                      disabled={!editing}
                      style={{ marginRight: '500px', marginBottom: '60px', marginTop: '20px' }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className='btn btn-danger btn-small'
                      onClick={handleDeleteAuxiliary}
                      disabled={!selectedNodes[5]}
                      style={{ marginRight: '70px', marginBottom: '60px', marginTop: '-70px' }} 
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      className='btn btn-primary btn-small'
                      onClick={handleClearTable}
                      style={{ marginRight: '-10px', marginBottom: '60px', marginTop: '-70px' }} 
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
              <Modal.Title>Añadir Nuevo Elemento</Modal.Title>
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
                        value={selectedNodes[1]?.code || ''}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[1]?.name || ''}
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
                        value={selectedNodes[2]?.code || ''}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[2]?.name || ''}
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
                        value={selectedNodes[3]?.code || ''}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[3]?.name || ''}
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
                        value={selectedNodes[4]?.code || ''}
                        readOnly
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={selectedNodes[4]?.name || ''}
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
                        onChange={(e) => setEditedAuxiliary({ ...editedAuxiliary, code: e.target.value })}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedAuxiliary.name}
                        onChange={(e) => setEditedAuxiliary({ ...editedAuxiliary, name: e.target.value })}
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
              <Button variant="primary" onClick={() => { /* Lógica para guardar el nuevo elemento */ }}>
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
