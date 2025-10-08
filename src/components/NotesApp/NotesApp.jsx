import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { UserAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const NotesApp = () => {
  const { session } = UserAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) console.error(error);
    else setNotes(data || []);
  };

  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  
  const handleAddNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: session.user.id,
          title: 'Untitled Note',
          content: '',
        },
      ])
      .select(); 

    if (error) {
      console.error(error);
    } else {
      const newNote = data[0];
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setTitle(newNote.title);
      setContent(newNote.content);
    }
  };

  
  const updateNote = async () => {
    if (!selectedNote) return;

    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date() })
      .eq('id', selectedNote.id)
      .select();

    if (error) console.error(error);
    else {
      const updatedNote = data[0];
      setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
      setSelectedNote(updatedNote);
    }
  };

 
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
      
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onAddNote={handleAddNote}
        onSelectNote={handleSelectNote}
      />

     
      <div className="flex-1 p-6">
        {selectedNote ? (
          <>
            <input
              className="w-full p-2 mb-4 text-black rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full h-64 p-2 text-black rounded"
              placeholder="Write your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 space-x-2">
              <button onClick={updateNote} className="bg-blue-500 p-2 rounded">
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
            <h2 className="text-xl font-semibold mb-4">No note selected</h2>
            <p>Click “+ Add Note” to create a new note</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
