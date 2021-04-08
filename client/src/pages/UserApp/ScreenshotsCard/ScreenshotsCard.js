import { Card, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import sharedStyles from '../UserApp.module.css'
import * as api from 'src/api'
import Screenshots from 'src/components/Screenshots/Screenshots'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const ScreenshotsCard = ({ app, mutate }) => {
    const [isUploading, setIsUploading] = useState(false)
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()
    const formEl = useRef(null)
    const inputEl = useRef(null)
    const screenshots = app.images.filter(img => !img.logo)

    const handleScreenshotDelete = async imageId => {
        if (
            !window.confirm('Are you sure you want to delete this screenshot?')
        ) {
            return
        }

        try {
            await api.deleteImage(app.id, imageId)
            mutate({
                ...app,
                images: app.images.filter(img => img.id != imageId),
            })
            successAlert.show({ message: 'Image deleted' })
        } catch (error) {
            errorAlert.show({ error })
        }
    }
    const handleUploadButtonClick = () => {
        inputEl.current.click()
    }
    const handleUpload = async event => {
        setIsUploading(true)
        const files = Array.from(event.target.files)
        const payloads = files.map(file => ({
            image: {
                caption: '',
                description: '',
                logo: false,
            },
            file,
        }))
        const requests = payloads.map(payload =>
            api.createNewImage(app.id, payload)
        )
        try {
            await Promise.all(requests)
            await mutate()
            formEl.current.reset()
            successAlert.show({
                message: `${files.length} screenshot${
                    files.length !== 1 ? 's' : ''
                } uploaded`,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsUploading(false)
    }

    return (
        <Card className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Screenshots</h2>
            {screenshots.length > 0 ? (
                <Screenshots
                    screenshots={screenshots}
                    onDelete={handleScreenshotDelete}
                />
            ) : (
                <em>This app has no screenshots</em>
            )}
            <form style={{ display: 'none' }} ref={formEl}>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    ref={inputEl}
                />
            </form>
            <div style={{ marginTop: 8 }}>
            <Button
                primary
                onClick={handleUploadButtonClick}
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload screenshots'}
            </Button>
            </div>
        </Card>
    )
}

ScreenshotsCard.propTypes = {
    app: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
}

export default ScreenshotsCard
