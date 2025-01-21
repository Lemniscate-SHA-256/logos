// src/components/OutlineNode.jsx
import { useDraggable, useDroppable } from '@dnd-kit/core';

export const OutlineNode = ({ id, title, children, onAddSection }) => {
  const { attributes, listeners, setNodeRef: draggableRef } = useDraggable({ id });
  const { setNodeRef: droppableRef } = useDroppable({ id });

  return (
    <div ref={droppableRef} className="outline-node">
      <div ref={draggableRef} {...listeners} {...attributes}>
        <h4>{title}</h4>
        <button onClick={() => onAddSection(id)}>+ Subsection</button>
      </div>
      <div className="children">{children}</div>
    </div>
  );
}; export default OutlineNode;