import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { v4 as uuidV4 } from 'uuid';

import { NoteData, Tag } from './App'

import {
    Box,
    FormLabel,
    Input,
    Textarea,
    VStack,
    Flex,
    Spacer,
    Button
} from '@chakra-ui/react'

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>


export function NoteForm({ onSubmit, onAddTag, availableTags, title = '', markdown = '', tags = [] }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const noteData = {
            title: titleRef.current!.value,
            markdown: textareaRef.current!.value,
            tags: selectedTags
        }

        onSubmit(noteData)
        navigate('..')
    }


    return (
        <>
            <form onSubmit={handleSubmit} method='POST'>
                <VStack spacing={3} align='stretch'>
                    <Flex>
                        <Box flex='1' mr={3}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type='text'
                                ref={titleRef}
                                mr={3}
                                defaultValue={title}
                                required
                            />
                        </Box>
                        <Box flex='1'>
                            <FormLabel>Tags</FormLabel>
                            <CreatableSelect
                                isMulti
                                onCreateOption={label => {
                                    const newTag = { id: uuidV4(), label }
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                            />
                        </Box>
                    </Flex>
                    <Box>
                        <FormLabel>Body</FormLabel>
                        <Textarea
                            ref={textareaRef}
                            rows={15}
                            defaultValue={markdown}
                            required
                        />
                    </Box>
                    <Flex gap='2'>
                        <Spacer />
                        <Button type='submit' colorScheme='teal'>Submit</Button>
                        <Link to='..'>
                            <Button type='button' colorScheme='grey' variant='outline'>Cancel</Button>
                        </Link>
                    </Flex>
                </VStack>
            </form>
        </>
    )
}