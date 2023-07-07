import { NoteData, Tag } from "./App"
import { NoteForm } from "./NoteForm"
import { Heading } from '@chakra-ui/react'

type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
    return <>
        <Heading as='h1' size='xl' mb={5}>
            New
        </Heading>
        <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
    </>
}