import { Modal, ModalContent } from '@dhis2/ui'
import { useQuery } from 'src/api'

import React from 'react'
import ReactMarkdown from 'react-markdown'

// ToDo: this is a just a placeholder for a  basic Changelog viewer
const ChangeLogViewer = ({
    appId,
    versionId,
    modalShown,
    onCloseChangelog,
}) => {
    const { data, error } = useQuery(`apps/${appId}/changelog`)

    // ToDo: fall back to any version?
    const matchedVersion =
        data?.find((v) => v.version == versionId) ??
        data?.find((v) => !!v.changelog)

    if (!modalShown) {
        return null
    }
    return (
        <Modal onClose={onCloseChangelog}>
            <ModalContent>
                <ReactMarkdown>{matchedVersion?.changelog}</ReactMarkdown>
            </ModalContent>
        </Modal>
    )
}

export default ChangeLogViewer
