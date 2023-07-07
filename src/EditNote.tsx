import { NoteData, Tag } from "./App"
import { Heading } from '@chakra-ui/react'
import { useNote } from "./NoteLayout"
import { NoteForm } from "./NoteForm"

type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
    const note = useNote()
    return <>
        <Heading as='h1' size='xl' mb={5}>
            Edit {note.title}
        </Heading>
        <NoteForm
            onSubmit={data => onSubmit(note.id, data)}
            onAddTag={onAddTag}
            availableTags={availableTags}
            title={note.title}
            markdown={note.markdown}
            tags={note.tags}
        />
    </>
}