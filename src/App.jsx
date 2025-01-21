// src/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import  OutlineNode  from './components/OutlineNode';
import AIPrompter from './components/AIPrompter';
import ZettelNote from './components/ZettelNote';
import FrameworkLibrary from './components/FrameworkLibrary';
import  { nanoid } from 'nanoid';
import { FRAMEWORKS } from './frameworks';
import OutlineTree from './components/OutlineTree';
import SectionEditor from './components/SectionEditor';
import { updateSectionTitles } from './utils/outlineUtils';


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
  
  const handleReorder = (activeId, overId) => {
    const reorderChildren = (nodes) => {
      return nodes.reduce((acc, node) => {
        if (node.id === overId) {
          const activeNode = nodes.find(n => n.id === activeId);
          return [...acc, activeNode, node];
        }
        if (node.children) {
          return [...acc, { ...node, children: reorderChildren(node.children) }];
        }
        return [...acc, node];
      }, []);
    };

    setOutline(prev => ({
      ...prev,
      children: reorderChildren(prev.children)
    }));
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const filteredNotes = notes.filter(note =>
  note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      {/* Framework Library */}
      <FrameworkLibrary onApplyFramework={applyFramework} />
      <div className='main-content'>
        
        <OutlineTree
          node={outline}
          onReorder={handleReorder}
          onAddSection={(parentId) => {
            // Add a section logic
          }}
          onEditTitle={(sectionId, newTitle) => {
            setOutline(prev => updateSectionTitles(prev, sectionId, newTitle));
          }}
          />

        {currentSectionId && (
          <SectionEditor 
            sectionId={currentSectionId}
            notes={notes}
            onLinkNote={(noteId) => {
              setNotes(prev =>  prev.map(note =>
                note.id === noteId
                  ? { ...note, linkedTo: [...note.linkedTo, currentSectionId] }
                  : note
              ));
            }}
            onSaveContent={(sectionId, content) => {
              localStorage.setItem(`section-${sectionId}`, content);
            }}
          />
        )}


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