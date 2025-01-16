import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Button,
    TabBar,
    Tab,
    IconUser16,
    IconTerminalWindow16,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import PluginTag from '../../components/PluginTag/PluginTag'
import ChangeLogViewer from '../../components/Versions/ChangeLogViewer'
import styles from './AppView.module.css'
import config from 'config'
import { useQueryV1 } from 'src/api'
import AppDescription from 'src/components/AppDescription/AppDescription'
import AppIcon from 'src/components/AppIcon/AppIcon'
import Screenshots from 'src/components/Screenshots/Screenshots'
import Versions from 'src/components/Versions/Versions'
import { renderDhisVersionsCompatibility } from 'src/lib/render-dhis-versions-compatibility'

const HeaderSection = ({
    appName,
    appDeveloper,
    appType,
    logoSrc,
    hasPlugin,
    pluginType,
    organisationSlug,
    latestVersion,
    sourceUrl,
}) => {
    const history = useHistory()
    return (
        <section
            className={classnames(styles.appCardSection, styles.appCardHeader)}
        >
            <AppIcon src={logoSrc} />
            <div>
                <h2 className={styles.appCardName}>{appName}</h2>
                <div className={styles.appTags}>
                    <div className={styles.tagWithIcon}>
                        <IconUser16 />
                        <a
                            data-test="organisation-link"
                            className={styles.organisationLink}
                            href={`/organisation/${organisationSlug}/view`}
                        >
                            {appDeveloper}
                        </a>
                    </div>
                    <div data-test="app-type" className={styles.tagWithIcon}>
                        <IconTerminalWindow16 />
                        {appType}
                    </div>
                    {hasPlugin && (
                        <PluginTag
                            hasPlugin={hasPlugin}
                            pluginType={pluginType}
                        />
                    )}
                </div>
            </div>
            <div>
                <div className={styles.topActionButtons}>
                    <a
                        data-test="button-download-latest-version"
                        download
                        href={latestVersion.downloadUrl}
                        tabIndex="-1"
                    >
                        <Button primary>Download latest version</Button>
                    </a>
                    <Button
                        onClick={() => history.push('?tab=previous-releases')}
                    >
                        See previous releases
                    </Button>
                </div>
                <div
                    data-test="latest-version-description"
                    className={styles.latestVersionDescription}
                >
                    <span>
                        {
                            config.ui.appChannelToDisplayName[
                                latestVersion.channel
                            ]
                        }{' '}
                        release v{latestVersion.version}.
                    </span>
                    <span>
                        Compatible with DHIS2{' '}
                        {renderDhisVersionsCompatibility(
                            latestVersion.minDhisVersion,
                            latestVersion.maxDhisVersion
                        )}
                        .
                    </span>
                </div>
                {sourceUrl && (
                    <>
                        <a
                            data-test="link-source-code"
                            href={sourceUrl}
                            className={styles.sourceUrl}
                        >
                            Source code
                        </a>
                    </>
                )}
            </div>
        </section>
    )
}

HeaderSection.propTypes = {
    appDeveloper: PropTypes.string.isRequired,
    appName: PropTypes.string.isRequired,
    appType: PropTypes.string.isRequired,
    organisationSlug: PropTypes.string.isRequired,
    hasPlugin: PropTypes.bool,
    latestVersion: PropTypes.object,
    logoSrc: PropTypes.string,
    pluginType: PropTypes.string,
    sourceUrl: PropTypes.string,
}

const AboutSection = ({ appDescription }) => (
    <section className={classnames(styles.appCardSection, styles.aboutSection)}>
        <div>
            <h2 className={styles.appCardHeading}>About this app</h2>
            {appDescription ? (
                <AppDescription
                    description={appDescription}
                    paragraphClassName={styles.appCardParagraph}
                />
            ) : (
                <em>
                    The developer of this app has not provided a description.
                </em>
            )}
        </div>
    </section>
)

AboutSection.propTypes = {
    appDescription: PropTypes.string,
}

const AppView = ({ match }) => {
    const { appId } = match.params
    const { data: app, error } = useQueryV1(`apps/${appId}`)

    const history = useHistory()

    const selectedTab =
        new URLSearchParams(window.location.search).get('tab') ?? 'about'

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title={'Error loading app'} error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!app) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const appDeveloper = app.developer.organisation || 'Unspecified'
    const logoSrc = app.images.find((img) => img.logo)?.imageUrl
    const screenshots = app.images.filter((img) => !img.logo)
    const versions = app.versions.sort((a, b) => b.created - a.created)
    const latestVersion = versions[0]

    const selectTab = (tabName) => () => {
        history.push('?tab=' + tabName)
    }

    return (
        <Card className={styles.appCard}>
            <HeaderSection
                appName={app.name}
                appDeveloper={appDeveloper}
                organisationSlug={app.developer?.organisation_slug}
                appType={config.ui.appTypeToDisplayName[app.appType]}
                logoSrc={logoSrc}
                hasPlugin={app.hasPlugin}
                pluginType={app.pluginType}
                latestVersion={latestVersion}
                sourceUrl={app.sourceUrl}
            />
            <TabBar dataTest="tabbar-appview">
                <Tab
                    onClick={selectTab('about')}
                    selected={selectedTab == 'about'}
                >
                    About
                </Tab>
                <Tab
                    onClick={selectTab('previous-releases')}
                    selected={selectedTab == 'previous-releases'}
                >
                    Previous releases
                </Tab>
                <Tab
                    onClick={selectTab('changelog')}
                    selected={selectedTab == 'changelog'}
                >
                    Change log
                </Tab>
                {/* <Tab
                    onClick={selectTab('moreapps')}
                    selected={selectedTab == 'moreapps'}
                >
                    More apps by {appDeveloper}
                </Tab> */}
            </TabBar>
            {selectedTab === 'about' && (
                <>
                    {screenshots.length > 0 && (
                        <>
                            <section className={styles.appCardSection}>
                                <h2 className={styles.appCardHeading}>
                                    Screenshots
                                </h2>
                                <Screenshots screenshots={screenshots} />
                            </section>
                        </>
                    )}
                    <AboutSection
                        appDescription={app.description}
                        latestVersion={latestVersion}
                        sourceUrl={app.sourceUrl}
                    />
                </>
            )}

            {selectedTab === 'previous-releases' && (
                <section className={styles.appCardSection}>
                    <Versions
                        versions={versions}
                        appId={appId}
                        hasChangelog={app.hasChangelog}
                    />
                </section>
            )}

            {selectedTab === 'changelog' && (
                <div>
                    <ChangeLogViewer
                        latestVersion={latestVersion.version}
                        appId={appId}
                    />
                </div>
            )}
        </Card>
    )
}

AppView.propTypes = {
    match: PropTypes.object.isRequired,
}

export default AppView
