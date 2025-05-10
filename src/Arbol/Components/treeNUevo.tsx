import React from 'react';
import { Accordion } from 'react-bootstrap';
import { FaAngleDown } from 'react-icons/fa';
import { TreeNode } from '../Types/PUCType';

const renderTree = (
  nodes: TreeNode[],
  parentKey: string,
  onNodeSelect: (node: TreeNode) => void
) => {
  return nodes.map((node, index) => {
    const currentKey = `${parentKey}-${index}`;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <Accordion.Item eventKey={currentKey} key={currentKey} className={`level-${node.level}`}>
        <Accordion.Header className={`level-${node.level}`} onClick={() => onNodeSelect(node)}>
          <div style={{ marginLeft: `${(node.level - 1) * 20}px` }}>
            {hasChildren && <FaAngleDown style={{ marginRight: '10px' }} />}
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

const AccountingTree: React.FC<{ data: TreeNode[]; onNodeSelect: (node: TreeNode) => void }> = ({ data, onNodeSelect }) => {
  return <Accordion alwaysOpen>{renderTree(data, 'root', onNodeSelect)}</Accordion>;
};

export default AccountingTree;
