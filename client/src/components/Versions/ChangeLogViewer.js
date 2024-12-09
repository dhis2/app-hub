import { CircularLoader, Modal, ModalContent } from '@dhis2/ui'
import { useQuery } from 'src/api'

import React from 'react'
import ReactMarkdown from 'react-markdown'

// ToDo: this is a just a placeholder for a  basic Changelog viewer
const ChangeLogViewer = ({ appId, modalShown, onCloseChangelog }) => {
    const { data, loading } = useQuery(`apps/${appId}/changelog`)

    if (!modalShown) {
        return null
    }
    return (
        <Modal onClose={onCloseChangelog}>
            <ModalContent>
                <div>
                    {loading && <CircularLoader large />}
                    <ReactMarkdown>{data?.changelog}</ReactMarkdown>
                </div>
            </ModalContent>
        </Modal>
    )
}

export default ChangeLogViewer
