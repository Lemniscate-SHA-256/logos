// src/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import  OutlineNode  from './components/OutlineNode';
import AIPrompter from './components/AIPrompter';
import ZettelNote from './components/ZettelNote';
import FrameworkLibrary from './components/FrameworkLibrary';
import  { nanoid } from 'nanoid';
import { FRAMEWORKS } from './frameworks';

const DEFAULT_OUTLINE = {
  id: 'root',
  title: 'Thesis',
  children: [
    { id: 'intro', title: 'Introduction', children: [] }
  ]
};



function App() {
  const [currentSectionId, setCurrentSectionId] = useState('root');
  const [outline, setOutline] = useState(() => {
    const saved = localStorage.getItem('essayOutline');
    return saved ? JSON.parse(saved) : DEFAULT_OUTLINE; 
  });

  const applyFramework = (frameworkName) => {
    const framework = FRAMEWORKS[frameworkName];
    setOutline({
      ...outline,
      children: framework.sections.map(title => ({
        id: nanoid(),
        title,
        children: framework.sections.map(title => ({
          id: `section-${Date.now()}-${title}`,
          title,
          children: []
      }))
    })),
    });
  };

  const handleAddSection = useCallback((parentId) => {
    setOutline(prevOutline => {
      const newSection = { id: Date.now().toString(), title: 'New Section', children: [] };
      const addChildToNode = (node) => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newSection] };
        }
        if (node.children) {
          return { ...node, children: node.children.map(addChildToNode) };
        }
        return node;
      };
      return addChildToNode(prevOutline);
    });
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setOutline(prevOutline => {
        console.log('Drag ended', active.id, 'over', over.id);
        return prevOutline;
      });
    }
  }, []);

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem('zettelNotes')) || [];
  });

  useEffect(() => {
    localStorage.setItem('essayOutline', JSON.stringify(outline));
    localStorage.setItem('zettelNotes', JSON.stringify(notes));
  }, [outline, notes]);
  return (
    <div className="app">
      <FrameworkLibrary onApplyFramework={applyFramework} />
      <div className='main-content'>
        <div className="outline-pane">
          <DndContext>
            <OutlineNode 
              node={outline}
              onAddSection={handleAddSection}
            />
          </DndContext>
          </div>
        <div className="writing-pane">
          <AIPrompter 
            sectionTitle={outline.title} 
            content={notes.find(n => n.linkedTo?.includes(currentSectionId))?.content || ''}
          />
          <ZettelNote 
          notes={notes}
          setNotes={setNotes}
          onLinkNote={(note) => console.log('Linked:', note)} 
          currentSectionId={currentSectionId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;