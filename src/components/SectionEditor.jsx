// src/components/SectionEditor.jsx
import { useEffect, useState } from 'react';

const SectionEditor = ({ sectionId, notes, onLinkNote, onSaveContent }) => {
  const [content, setContent] = useState('');

  // Load saved content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`section-${sectionId}`);
    setContent(saved || '');
  }, [sectionId]);

  return (
    <div className="section-editor">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => onSaveContent(sectionId, content)}
      />
      
      <div className="linked-notes">
        <h4>Linked Zettel Notes</h4>
        {notes
          .filter(note => note.linkedTo?.includes(sectionId))
          .map(note => (
            <div key={note.id} className="note-preview">
              {note.content.substring(0, 75)}...
            </div>
          ))}
      </div>
    </div>
  );
}; export default SectionEditor;