// src/components/OutlineTree.jsx
import {
    DndContext,
    useDraggable,
    useDroppable,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
  } from '@dnd-kit/core';
  import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
  import  OutlineNode  from './OutlineNode';
  
  const OutlineTree = ({ node, onReorder }) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );
  
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        onReorder(active.id, over.id);
      }
    };
  
    return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <OutlineNode node={node} depth={0} />
      </DndContext>
    );
  }; export default OutlineTree;