import { IconInfo16, IconTerminalWindow16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './SidebarInfo.module.css'

const SidebarEntry = ({ icon, children }) => {
    const Icon = icon
    return (
        <div className={styles.entry}>
            {Icon && (
                <span className={styles.icon}>
                    <Icon className={styles.icons} />
                </span>
            )}
            {children}
        </div>
    )
}

SidebarEntry.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.elementType,
}

export const SidebarInfo = () => {
    return (
        <div className={styles.container}>
            <SidebarEntry icon={IconInfo16}>
                <span>
                    How to install apps?{' '}
                    <a
                        className={styles.link}
                        href="https://developers.dhis2.org/docs/guides/submit-apphub"
                    >
                        Learn more
                    </a>
                </span>
            </SidebarEntry>
            <SidebarEntry icon={IconTerminalWindow16}>
                <span>
                    Building an app?{' '}
                    <a
                        className={styles.link}
                        href="https://developers.dhis2.org/docs/tutorials/setup-env"
                    >
                        Read our dev docs
                    </a>
                </span>
            </SidebarEntry>
        </div>
    )
}
