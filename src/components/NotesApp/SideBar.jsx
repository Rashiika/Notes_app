import React from 'react';

const Sidebar = ({ notes, selectedNote, onAddNote, onSelectNote }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4 flex flex-col">
      <button
        onClick={onAddNote}
        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
      >
        + Add Note
      </button>

      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              selectedNote?.id === note.id
                ? 'bg-gray-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {note.title || 'Untitled Note'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
