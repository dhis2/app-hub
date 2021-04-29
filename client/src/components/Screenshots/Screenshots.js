import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import styles from './Screenshots.module.css'

const Screenshots = ({ screenshots, renderDeleteScreenshotButton }) => {
    const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0)
    // Handle current screenshot being deleted in user app view
    const currentScreenshot =
        screenshots[Math.min(currentScreenshotIndex, screenshots.length - 1)]

    return (
        <div className={styles.screenshots}>
            <div>
                <img
                    className={styles.currentScreenshot}
                    src={currentScreenshot.imageUrl}
                />
                {renderDeleteScreenshotButton &&
                    renderDeleteScreenshotButton(currentScreenshot.id)}
            </div>
            <div>
                {screenshots.map((screenshot, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentScreenshotIndex(index)}
                        className={classnames(styles.otherScreenshot, {
                            [styles.otherScreenshotCurrent]:
                                index === currentScreenshotIndex,
                        })}
                    >
                        <img src={screenshot.imageUrl} />
                    </button>
                ))}
            </div>
        </div>
    )
}

Screenshots.propTypes = {
    screenshots: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
        })
    ).isRequired,
    renderDeleteScreenshotButton: PropTypes.func,
}

export default Screenshots
