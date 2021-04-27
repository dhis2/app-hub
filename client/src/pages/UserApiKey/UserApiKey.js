import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Button,
} from '@dhis2/ui'
import classnames from 'classnames'
import copyToClipboard from 'copy-text-to-clipboard'
import { useState } from 'react'
import styles from './UserApiKey.module.css'
import { useQuery, deleteApiKey, generateApiKey } from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const GenerateApiKey = ({ onGenerate, isUpdating }) => (
    <>
        <NoticeBox
            warning
            title="Keep API keys secret"
            className={styles.noticeBox}
        >
            API keys can be used to upload any app to your organisation, so it's
            important to keep them secret and secure.
        </NoticeBox>
        <div className={classnames(styles.flexCenter, styles.justifyBetween)}>
            There is no active API key for this organisation.
            <Button primary onClick={onGenerate} disabled={isUpdating}>
                Generate API key
            </Button>
        </div>
    </>
)

const ApiKeyDisplay = ({ createdAt, onDelete, apiKey, isUpdating }) => {
    const handleCopyToClipboard = () => {
        copyToClipboard(apiKey)
    }

    return (
        <>
            {!apiKey && (
                <NoticeBox title="Note" className={styles.noticeBox}>
                    If you suspect your key is compromised or lost, you can
                    delete it and generate a new one. Be aware that any scripts
                    or applications using the API key will need to be updated.
                </NoticeBox>
            )}
            <div>
                {apiKey && (
                    <NoticeBox
                        title="API key generated"
                        className={styles.noticeBox}
                    >
                        Make sure to copy your new API key below. You won’t be
                        able to see it again!
                        <div className={styles.flexCenter}>
                            <code>{apiKey}</code>
                            <Button
                                small
                                className={styles.copyToClipboardButton}
                                onClick={handleCopyToClipboard}
                            >
                                Copy to clipboard
                            </Button>
                        </div>
                    </NoticeBox>
                )}
                <div
                    className={classnames(
                        styles.flexCenter,
                        styles.justifyBetween
                    )}
                >
                    API key is active. API key was generated at{' '}
                    {new Date(createdAt).toLocaleString()}
                    <Button
                        destructive
                        small
                        onClick={onDelete}
                        disabled={isUpdating}
                    >
                        Delete API key
                    </Button>
                </div>
            </div>
        </>
    )
}

const requestOpts = {
    useAuth: true,
}

const UserApiKey = () => {
    const [apiKey, setApiKey] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const { data, error, mutate } = useQuery('key', null, requestOpts)
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleDeleteKey = async () => {
        setIsUpdating(true)
        try {
            await deleteApiKey()
            mutate({ hasApiKey: false, createdAt: undefined })
            successAlert.show({ message: 'Successfully deleted API key' })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsUpdating(false)
    }

    const handleGenerateKey = async () => {
        setIsUpdating(true)
        try {
            const { apiKey } = await generateApiKey()
            setApiKey(apiKey)
            mutate({ hasApiKey: true, createdAt: new Date() }, false)
            successAlert.show({ message: 'Successfully generated API key' })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsUpdating(false)
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your API keys" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!data) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>Your API key</h2>
            <p className={styles.description}>
                An API key can be used to upload new app versions through the
                App Hub API. This can be useful in continous integration
                workflows.
            </p>
            {data.hasApiKey ? (
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
            )}
        </Card>
    )
}

export default UserApiKey
