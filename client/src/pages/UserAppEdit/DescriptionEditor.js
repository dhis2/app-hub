import { Tab, TabBar, hasValue, Divider, Label, Help } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useField } from 'react-final-form'
import AppDescription from '../../components/AppDescription/AppDescription'
import MarkdownEditor from '../../components/MarkdownEditor/MarkdownEditor'
import styles from './UserAppEdit.module.css'

const tabs = {
    WRITE: 'WRITE',
    PREVIEW: 'PREVIEW',
}

const DescriptionEditor = ({
    description,
    label = 'App description',
    name,
    placeholder,
    helpText,
    required = true,
}) => {
    const [selectedTab, setSelectedTab] = useState(tabs.WRITE)

    const handleSelectTab = (tab, _, event) => {
        // stops submission of form
        event.preventDefault()
        setSelectedTab(tab)
    }

    return (
        <div className={styles.descriptionContainer}>
            <Label required={required}>{label}</Label>
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

            <WriteContent
                description={description}
                placeholder={placeholder}
                hidden={selectedTab !== tabs.WRITE}
                name={name}
                helpText={helpText}
                required={required}
            />
            {selectedTab === tabs.PREVIEW && <PreviewContent name={name} />}
            <Help className={styles.helpText}>
                {helpText ??
                    'A good app description helps users of the App Hub quickly understand what the purpose of an app is and any requirements to using it.'}
            </Help>
        </div>
    )
}

DescriptionEditor.propTypes = {
    description: PropTypes.string,
    helpText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
}

const WriteContent = ({ description, name, placeholder, hidden, required }) => {
    return (
        <div className={cx(styles.writeContent, { [styles.hidden]: hidden })}>
            <MarkdownEditor
                name={name ?? 'description'}
                initialValue={description}
                validate={required ? hasValue : null}
                placeholder={placeholder ?? 'What is the purpose of this app?'}
            />
        </div>
    )
}

WriteContent.propTypes = {
    description: PropTypes.string,
    hidden: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
}

const PreviewContent = ({ name = 'description' }) => {
    const {
        input: { value },
    } = useField(name)

    return (
        <div className={styles.previewContent}>
            <AppDescription description={value} />
            <Divider />
        </div>
    )
}

PreviewContent.propTypes = {
    name: PropTypes.string,
}
export default DescriptionEditor
