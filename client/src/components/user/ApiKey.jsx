import React, { useState } from 'react'
import { Card, CardText } from 'material-ui/Card'
import Button from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import SubHeader from '../header/SubHeader'
import { useQuery, deleteApiKey, generateApiKey } from '../../api/api'
import NoteBlock from '../utils/NoteBlock'
import Spinner from '../utils/Spinner'
import copyToClipboard from 'copy-text-to-clipboard'

const requestOpts = {
    useAuth: true,
}

const styles = {
    flexCenterDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5px',
    },
}

const ApiKeyView = () => {
    return (
        <div>
            <SubHeader title="API key"></SubHeader>
            <Card>
                <CardText>
                    <p>
                        An API key can be used to upload new app versions
                        through the App Hub API. This can be useful in continous
                        integration workflows.
                    </p>
                    <ApiKeyStatus />
                </CardText>
            </Card>
        </div>
    )
}

const GenerateApiKey = props => {
    return (
        <div>
            <NoteBlock
                warning
                header={<b>API keys should be kept confidential</b>}
            >
                Treat API-keys as passwords, they can be used to upload
                arbitrary apps to your organisations.
            </NoteBlock>
            <div style={styles.flexCenterDiv}>
                No API key active
                <Button
                    primary
                    label="Generate api key"
                    onClick={props.onGenerate}
                    icon={props.isUpdating ? <Spinner inButton /> : null}
                    disabled={props.isUpdating}
                />
            </div>
        </div>
    )
}

const ApiKeyDisplay = ({ createdAt, onDelete, apiKey, isUpdating }) => {
    const handleCopyToClipboard = () => {
        copyToClipboard(apiKey)
    }

    return (
        <div>
            {!apiKey && (
                <NoteBlock>
                    If you suspect your key is compromised or you lost it, you
                    can delete it and generate a new one. Be aware that any
                    scripts or applications using the API key will need to be
                    updated.
                </NoteBlock>
            )}
            <div>
                {apiKey && (
                    <div>
                        <NoteBlock
                            header={<b>API key generated</b>}
                            icon="check_circle"
                        >
                            Make sure to copy your new API key below. You won’t
                            be able to see it again!
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <code>{apiKey}</code>
                                <IconButton
                                    tooltip="Copy API key"
                                    onClick={handleCopyToClipboard}
                                >
                                    <FontIcon className="material-icons">
                                        content_paste
                                    </FontIcon>
                                </IconButton>
                            </div>
                        </NoteBlock>
                    </div>
                )}
                <div style={styles.flexCenterDiv}>
                    API is key active. API key was generated at{' '}
                    {new Date(createdAt).toLocaleString()}
                    <FlatButton
                        label="Delete API key"
                        onClick={onDelete}
                        style={{ color: 'red' }}
                        icon={isUpdating ? <Spinner inButton /> : null}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    )
}

const ApiKeyStatus = () => {
    const [apiKey, setApiKey] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const { data, error, mutate } = useQuery('key', null, requestOpts)

    const handleDeleteKey = async () => {
        setIsUpdating(true)
        await deleteApiKey()
        setIsUpdating(false)
        mutate({ hasApiKey: false, createdAt: undefined })
    }

    const handleGenerateKey = async () => {
        try {
            setIsUpdating(true)
            const { apiKey } = await generateApiKey()
            setIsUpdating(false)
            setApiKey(apiKey)
            mutate({ hasApiKey: true, createdAt: new Date() }, false)
        } catch (e) {
            console.error(e)
            //TODO: show snackbar?
        }
    }

    if (error) {
        return 'Failed to load API-key status'
    }
    if (!data) {
        return <Spinner />
    }

    return data.hasApiKey ? (
        <ApiKeyDisplay
            createdAt={data.createdAt}
            apiKey={apiKey}
            onDelete={handleDeleteKey}
            isUpdating={isUpdating}
        />
    ) : (
        <GenerateApiKey
            onGenerate={handleGenerateKey}
            isUpdating={isUpdating}
        />
    )
}

export default ApiKeyView
