import { ReactFinalForm, TextAreaFieldFF } from '@dhis2/ui'
import styles from './MarkdownEditor.module.css'
import MarkdownIcon from 'assets/icons/markdown_icon.svg'

const MARKDOWN_GUIDE_URL = 'https://www.markdownguide.org/basic-syntax/'

const MarkdownEditor = ({ ...fieldProps }) => {
    return (
        <div className={styles.markdownFieldWrapper}>
            <ReactFinalForm.Field
                component={TextAreaFieldFF}
                autoGrow
                {...fieldProps}
            />
            <label className={styles.markdownSupportedText}>
                <span>Styling with Markdown is supported.</span>
                <a
                    href={MARKDOWN_GUIDE_URL}
                    target={'_blank'}
                    className={styles.markdownLink}
                >
                    <MarkdownIcon />
                </a>
            </label>
        </div>
    )
}

export default MarkdownEditor
