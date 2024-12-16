import { CenteredContent, CircularLoader, Modal, ModalContent } from '@dhis2/ui'
import { useQuery } from 'src/api'

import React from 'react'
import ReactMarkdown from 'react-markdown'

// ToDo: this is a just a placeholder for a  basic Changelog viewer
const ChangeLogViewer = ({ appId, onCloseChangelog }) => {
    const { data, loading } = useQuery(`apps/${appId}/changelog`)

    return (
        <Modal onClose={onCloseChangelog}>
            <ModalContent>
                <div>
                    {loading && (
                        <CenteredContent>
                            <CircularLoader large />
                        </CenteredContent>
                    )}
                    <ReactMarkdown>{data?.changelog}</ReactMarkdown>
                </div>
            </ModalContent>
        </Modal>
    )
}

export default ChangeLogViewer
