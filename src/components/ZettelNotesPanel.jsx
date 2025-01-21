// src/components/ZettelNotesPanel.jsx
import { useState } from 'react';
import NoteLink from './NoteLink';

const ZettelNotesPanel = ({ notes, setNotes, currentSectionId }) => {
  const [newNote, setNewNote] = useState('');

  const handleLinkNote = (noteId) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, linkedTo: [...note.linkedTo, currentSectionId] }
        : note
    );
    setNotes(updatedNotes);
  };

  return (
    <div className="zettel-panel">
      <h3>Zettelkasten Notes</h3>
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="New atomic note..."
      />
      <button onClick={() => {
        setNotes([...notes, {
          id: Date.now(),
          content: newNote,
          linkedTo: []
        }]);
        setNewNote('');
      }}>
        Create Note
      </button>

      <div className="note-list">
        {notes.map(note => (
          <NoteLink 
            key={note.id}
            note={note}
            onLinkToSection={() => handleLinkNote(note.id)}
          />
        ))}
      </div>
    </div>
  );
}; export default ZettelNotesPanel;