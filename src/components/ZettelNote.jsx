// In ZettelNote.jsx
import React, { useState } from 'react';

const ZettelNote = ({ notes, setNotes }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSaveNote = () => {
    setNotes([...notes, {
      id: Date.now(),
      content: noteContent,
      links: []
    }]);
    setNoteContent('');
  };

  return (
    <div>
      <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
      <button onClick={handleSaveNote}>Save Note</button>
    </div>
  );
}; export default ZettelNote;