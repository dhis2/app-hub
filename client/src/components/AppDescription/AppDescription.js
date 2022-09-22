import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import styles from './AppDescription.module.css'

const AppDescription = ({ description, paragraphClassName }) => {
    return (
        <div className={paragraphClassName}>
            <ReactMarkdown
                className={styles.markdownDescription}
                linkTarget={'_blank'}
            >
                {description}
            </ReactMarkdown>
        </div>
    )
}

AppDescription.propTypes = {
    description: PropTypes.string,
    paragraphClassName: PropTypes.string,
}

export default AppDescription
