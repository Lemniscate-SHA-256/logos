// src/components/NoteLink.jsx
const NoteLink = ({ note, onLinkToSection }) => {
    return (
      <div className="note-link">
        <p>{note.content.substring(0, 50)}...</p>
        <button onClick={() => onLinkToSection(note.id)}>
          Link to Current Section
        </button>
      </div>
    );
  }; export default NoteLink;