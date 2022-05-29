import { Tab, TabBar, hasValue, Divider, Label, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useField } from 'react-final-form'
import AppDescription from '../../components/AppDescription/AppDescription'
import styles from './UserAppEdit.module.css'
import MarkdownEditor from '../../components/MarkdownEditor/MarkdownEditor'

const tabs = {
    WRITE: 'WRITE',
    PREVIEW: 'PREVIEW',
}

const DescriptionEdit = ({ description }) => {
    const [selectedTab, setSelectedTab] = useState(tabs.WRITE)

    const handleSelectTab = (tab, _, event) => {
        // stops submission of form
        event.preventDefault()
        setSelectedTab(tab)
    }

    return (
        <div className={styles.descriptionContainer}>
            <Label required>App description</Label>
            <TabBar>
                <Tab
                    type={'button'}
                    selected={selectedTab === tabs.WRITE}
                    onClick={handleSelectTab.bind(null, tabs.WRITE)}
                >
                    Write
                </Tab>
                <Tab
                    selected={selectedTab === tabs.PREVIEW}
                    onClick={handleSelectTab.bind(null, tabs.PREVIEW)}
                >
                    Preview
                </Tab>
            </TabBar>
            {selectedTab === tabs.WRITE && (
                <WriteContent description={description} />
            )}
            {selectedTab === tabs.PREVIEW && <PreviewContent />}
            <Help className={styles.helpText}>
                A good app description helps users of the App Hub quickly
                understand what the purpose of an app is and any requirements to
                using it.
            </Help>
        </div>
    )
}

DescriptionEdit.propTypes = {
    description: PropTypes.string,
}

const WriteContent = ({ description }) => {
    return (
        <div className={styles.writeContent}>
            <MarkdownEditor
                name="description"
                initialValue={description}
                validate={hasValue}
                placeholder={'What is the purpose of this app?'}
                required
            />
        </div>
    )
}

WriteContent.propTypes = {
    description: PropTypes.string,
}

const PreviewContent = () => {
    const {
        input: { value },
    } = useField('description')

    return (
        <div className={styles.previewContent}>
            <AppDescription description={value} />
            <Divider />
        </div>
    )
}

export default DescriptionEdit
