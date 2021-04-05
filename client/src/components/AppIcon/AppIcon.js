import { PropTypes } from '@dhis2/prop-types'
import React from 'react'
import styles from './AppIcon.module.css'

const FallbackIcon = () => (
    <svg viewBox="0 0 72 72">
        <g fill="none" fillRule="evenodd">
            <rect fill="#f3f5f7" height="72" rx="10.5" width="72" />
            <path
                d="m60 52.5v3c0 2.3965213-1.8733799 4.3554913-4.2355908 4.492361l-.2644092.007639h-3v-3h3c.7692538 0 1.4032607-.5790603 1.4899084-1.3250683l.0100916-.1749317v-3zm-45 0v3l.0100916.1749317c.0866477.746008.7206546 1.3250683 1.4899084 1.3250683h3v3h-3l-.2644092-.007639c-2.3622109-.1368697-4.2355908-2.0958397-4.2355908-4.492361v-3zm18 4.5v3h-7.5v-3zm13.5 0v3h-7.5v-3zm-31.5-18v7.5h-3v-7.5zm45 0v7.5h-3v-7.5zm-45-13.5v7.5h-3v-7.5zm45 0v7.5h-3v-7.5zm-40.5-13.5v3h-3c-.7692538 0-1.4032607.5790603-1.4899084 1.3250683l-.0100916.1749317v3h-3v-3c0-2.3965213 1.8733799-4.3554913 4.2355908-4.492361l.2644092-.007639zm36 0 .2644092.007639c2.3622109.1368697 4.2355908 2.0958397 4.2355908 4.492361v3h-3v-3l-.0100916-.1749317c-.0866477-.746008-.7206546-1.3250683-1.4899084-1.3250683h-3v-3zm-22.5 0v3h-7.5v-3zm13.5 0v3h-7.5v-3z"
                fill="#c2ccd6"
                fillRule="nonzero"
            />
        </g>
    </svg>
)

const AppIcon = ({ src }) => (
    <div className={styles.appIcon}>
        {src ? (
            <img alt="App logo" src={src} loading="lazy" />
        ) : (
            <FallbackIcon />
        )}
    </div>
)

AppIcon.propTypes = {
    src: PropTypes.string,
}

export default AppIcon
