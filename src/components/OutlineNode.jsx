// src/components/OutlineNode.jsx
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { FiFile, FiFolder } from 'react-icons/fi';


const OutlineNode = ({ node, depth, onAddSection, onEditTitle }) => {
  const { attributes, listeners, setNodeRef: draggableRef } = useDraggable({ id: node.id });
  const { setNodeRef: droppableRef } = useDroppable({ id: node.id });

  return (
    <div 
      ref={droppableRef} 
      className="outline-node"
      style = {{ marginLeft: `${depth * 20}px` }}
      >
      <div 
        ref={draggableRef} {...listeners} {...attributes}>
        {node.children?.length ? <FiFolder /> : <FiFile />} 
        <input 
        value={node.title}
        onChange={(e) => onEditTitle(node.id, e.target.value)}
        />
        <button onClick={() => onAddSection(node.id)}>+ Child</button>
      </div>
      <div className="children">
        {node.children?.map(child => (
          <OutlineNode 
            key={child.id} 
            node={child} 
            depth={depth + 1} 
            onAddSection={onAddSection} 
            onEditTitle={onEditTitle}
          />  
        ))}
      </div>
    </div>
  );
}; export default OutlineNode;