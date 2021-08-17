import {
    ReactFinalForm,
    FileInputFieldFF,
    hasValue,
    NoticeBox,
} from '@dhis2/ui'
import * as ZipJs from '@zip.js/zip.js'
import { useEffect, useState } from 'react'
import styles from './UserAppUpload.module.css'

const useFileFromInput = (fileData, fileName) => {
    const [contents, setContents] = useState()
    const [error, setError] = useState()
    useEffect(() => {
        const getEntries = async () => {
            const fileZip = new ZipJs.ZipReader(new ZipJs.BlobReader(fileData))
            const entries = await fileZip.getEntries()
            const file = entries.filter(entry => entry.filename === fileName)[0]
            if (!file) {
                setError(`${fileName} was not found in zip.`)
                return
            }
            const fileText = await file.getData(new ZipJs.TextWriter())
            let parsedContents = fileText
            try {
                parsedContents = JSON.parse(fileText)
            } catch(e) {
                // don't do anything, just use the text
            }
            setContents(parsedContents)
        }
        if (fileData) {
            getEntries()
        } else { //reset
            setError()
            setContents()
        }
    }, [fileData, fileName])

    return { data: contents, error }
}

const manifestKeys = ['name', 'description', 'version']

const UploadFileSection = () => {
    const { input: fileInput } = ReactFinalForm.useField('file')
    const form = ReactFinalForm.useForm()
    const { data: manifest, error: manifestError } = useFileFromInput(
        fileInput.value[0],
        'manifest.webapp'
    )
    const { data: d2Config, error: d2ConfigError } = useFileFromInput(
        fileInput.value[0],
        'd2.config.json'
    )
    console.log(manifest)
    console.log(d2Config)

    useEffect(() => {
        if (manifest) {
            form.change('name', manifest.name)
            form.change('description', manifest.description)
            form.change('version', manifest.version)
            form.change('appType', manifest.appType.toUpperCase())
        }
    }, [manifest])

    return (
        <section className={styles.formSection}>
            <h3 className={styles.subheader}>Upload app file (Required)</h3>
            <p className={styles.description}>
                Upload your app as a single .zip file.
            </p>
            <ReactFinalForm.Field
                required
                name="file"
                buttonLabel="Upload a zip file"
                accept=".zip"
                component={FileInputFieldFF}
                className={styles.field}
                validate={hasValue}
            />
            {manifestError && (
                <NoticeBox title="Error parsing manifest" error>
                    {manifestError}
                </NoticeBox>
            )}
            <UploadFileSummary manifest={manifest} />
        </section>
    )
}



const UploadFileSummary = ({manifest}) => {
    if(!manifest) {
        return null
    }

    return (<NoticeBox title="Gathered from manifest" >
          <p className={styles.description}>
        The following information was gathered from the manifest
            </p>
        <div>
            {manifest.name && 'Name:' + manifest.name}
        </div>
    </NoticeBox>)

}

export default UploadFileSection
