import { Link, useNavigate } from 'react-router-dom'
import { useNote } from "./NoteLayout"

import ReactMarkdown from 'react-markdown'
import {
    Flex,
    Spacer,
    Heading,
    Button,
    Box,
    Badge,
    HStack
} from '@chakra-ui/react'

type NoteProps = {
    onDelete: (id: string) => void
}

export function Note({ onDelete }: NoteProps) {
    const note = useNote()
    const navigate = useNavigate()

    return <>
        <Flex minWidth='max-content' alignItems='center' gap='2' mb={5}>
            <Box>
                <Heading as='h1' size='xl' noOfLines={1} maxWidth='250px'>{note.title}</Heading>
                <HStack gap={3} mt={1}>
                    {note.tags.length > 0 && note.tags.map(tag => (
                        <Badge key={tag.id} variant='subtle' colorScheme='green'>
                            {tag.label}
                        </Badge>
                    ))}
                </HStack>
            </Box>
            <Spacer />
            <Box>
                <Flex gap='2' alignItems='center'>
                    <Spacer />
                    <Link to={`/${note.id}/edit`}>
                        <Button colorScheme='teal'>Edit</Button>
                    </Link>
                    <Button
                        colorScheme='red'
                        variant='outline'
                        onClick={() => { onDelete(note.id); navigate('/'); }}
                    >
                        Delete
                    </Button>
                    <Link to='/'>
                        <Button colorScheme='grey' variant='outline'>Back</Button>
                    </Link>
                </Flex>
            </Box>
        </Flex>
        <ReactMarkdown>
            {note.markdown}
        </ReactMarkdown>
    </>
}