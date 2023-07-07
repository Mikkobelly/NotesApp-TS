import { Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Box } from "@chakra-ui/react"

import './App.css'
import { useLocalStorage } from './useLocalStorage';
import { NoteLayout } from './NoteLayout';
import { NoteList } from './NoteList';
import { NewNote } from './NewNote';
import { Note } from './Note';
import { EditNote } from './EditNote';


export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', [])

  const noteWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prev) => {
      return [...prev, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <>
      <Box m={4} w={650} p={4}>
        <Routes>
          <Route
            path='/'
            element={
              <NoteList
                notes={noteWithTags}
                availableTags={tags}
                onUpdateTag={updateTag}
                onDeleteTag={deleteTag}
              />
            }
          />

          <Route
            path='/new'
            element={
              <NewNote
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />

          <Route path='/:id' element={<NoteLayout notes={noteWithTags} />}>
            <Route index element={<Note onDelete={onDeleteNote} />} />
            <Route
              path='edit'
              element={
                <EditNote
                  onSubmit={onUpdateNote}
                  onAddTag={addTag}
                  availableTags={tags}
                />
              }
            />
          </Route>

          <Route path='*' element={<Navigate to='/' />} />
        </Routes >
      </Box>
    </>
  )
}

export default App
