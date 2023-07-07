import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Tag } from './App'

import {
    Grid,
    SimpleGrid,
    GridItem,
    Flex,
    Spacer,
    Button,
    Box,
    FormLabel,
    Input,
    Card,
    CardBody,
    Heading,
    Stack,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    ModalCloseButton
} from '@chakra-ui/react'

type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

export function NoteList({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState('')

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === '' ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
            )
        })
    }, [title, selectedTags, notes])


    return <>
        <Grid templateColumns='repeat(2, 1fr)' gap={3}>
            <Heading as='h1' size='xl' noOfLines={1} maxWidth='160px'>
                Notes
            </Heading>
            <Flex gap='2' alignItems='center'>
                <Spacer />
                <Link to='/new'>
                    <Button colorScheme='teal'>Create</Button>
                </Link>
                <EditTagsModal
                    availableTags={availableTags}
                    onUpdateTag={onUpdateTag}
                    onDeleteTag={onDeleteTag}
                />
            </Flex>
            <GridItem colSpan={2}>
                <Flex>
                    <Box flex='1' mr={3}>
                        <FormLabel>Title</FormLabel>
                        <Input
                            type='text'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            mr={3}
                        />
                    </Box>
                    <Box flex='1'>
                        <FormLabel>Tags</FormLabel>
                        <ReactSelect
                            isMulti
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
            </GridItem>
        </Grid>
        <SimpleGrid minChildWidth='300px' spacing={3}>
            {filteredNotes.map(note => (
                <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    tags={note.tags}
                />
            ))}
        </SimpleGrid>
    </>
}


function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className='note-card'>
            <CardBody>
                <Stack direction='column' spacing={5}>
                    <Heading size='md'>{title}</Heading>
                    <Flex gap={2} justifyContent='center'>
                        {tags.length > 0 && tags.map(tag => (
                            <Badge key={tag.id} variant='subtle' colorScheme='green'>
                                {tag.label}
                            </Badge>
                        ))}
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    )
}


type EditTagsModalProps = {
    availableTags: Tag[]
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

function EditTagsModal({ availableTags, onUpdateTag, onDeleteTag }: EditTagsModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return <>
        <Button colorScheme='grey' variant='outline' onClick={onOpen}>Edit Tags</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Tags</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {availableTags.map(tag => (
                        <Flex key={tag.id}>
                            <Input
                                type='text'
                                value={tag.label}
                                onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                                mr={3}
                                mb={3}
                            />
                            <Button
                                colorScheme='red'
                                variant='outline'
                                onClick={() => onDeleteTag(tag.id)}
                            >
                                &times;
                            </Button>
                        </Flex>
                    ))}
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}