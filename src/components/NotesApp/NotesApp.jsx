import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { UserAuth } from '../../context/AuthContext';
import Sidebar from './SideBar';

const NotesApp = () => {
  const { session } = UserAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch notes for logged-in user
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) console.error(error);
    else setNotes(data);
  };

  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  // Select a note
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // Add new note
   const handleAddNote = async () => {
    const { data, error } = await supabase.from('notes').insert([
      {
        user_id: session.user.id,
        title: 'Untitled',
        content: '',
      },
    ]);

    if (error) console.error(error);
    else {
      setNotes([data[0], ...notes]);
      setSelectedNote(data[0]);
      setTitle(data[0].title);
      setContent(data[0].content);
    }
  };

  // Update note
  const updateNote = async () => {
    if (!selectedNote) return;

    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date() })
      .eq('id', selectedNote.id);

    if (error) console.error(error);
    else {
      setNotes(notes.map((n) => (n.id === selectedNote.id ? data[0] : n)));
      setSelectedNote(data[0]);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);
    else {
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
      }  
    }
  };

  return (
    <div className="flex h-screen text-white bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onAddNote={handleAddNote}
        onSelectNote={handleSelectNote}
      />
      {/* <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">My Notes</h2>
        <button
          onClick={() => {
            setSelectedNote(null);
            setTitle('');
            setContent('');
          }}
          className="mb-4 bg-green-500 w-full p-2 rounded"
        >
          + New Note
        </button>

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className={`p-2 rounded cursor-pointer ${
                selectedNote?.id === note.id ? 'bg-gray-600' : 'hover:bg-gray-700'
              }`}
            >
              {note.title || 'Untitled'}
            </div>
          ))}
        </div>
      </div> */}

      {/* Main Panel */}
      <div className="flex-1 p-6">
        {selectedNote ? (
          <>
            <input
              className="w-full p-2 mb-4 text-black"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full h-64 p-2 text-black"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={updateNote}
                className="bg-blue-500 p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="bg-red-500 p-2 rounded"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-center mt-20">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
