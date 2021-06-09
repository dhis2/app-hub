import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import styles from './ScreenshotsCard.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const pluralise = (string, itemsCount) => string + (itemsCount === 1 ? '' : 's')

const UploadScreenshot = ({ appId, mutate }) => {
    const [isUploading, setIsUploading] = useState(false)
    const formEl = useRef(null)
    const inputEl = useRef(null)
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

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
            api.createNewImage(appId, payload)
        )
        try {
            await Promise.all(requests)
            await mutate()
            formEl.current.reset()
            successAlert.show({
                message: `${files.length} ${pluralise(
                    'screenshot',
                    files.length
                )} uploaded`,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsUploading(false)
    }

    return (
        <>
            <form className={styles.hidden} ref={formEl}>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    ref={inputEl}
                />
            </form>
            <div className={styles.uploadButton}>
                <Button
                    onClick={handleUploadButtonClick}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading…' : 'Upload screenshots'}
                </Button>
            </div>
        </>
    )
}

UploadScreenshot.propTypes = {
    appId: PropTypes.string.isRequired,
    mutate: PropTypes.func.isRequired,
}

export default UploadScreenshot
