import { AlertBar, AlertStack } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import AlertsContext from './AlertsContext'

let alertId = 0

const AlertsProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([])
    const removeAlert = (id) => {
        setAlerts((alerts) => alerts.filter((alert) => alert.id !== id))
    }
    const addAlert = (alert) => {
        const id = alertId++
        setAlerts((alerts) => [
            ...alerts,
            {
                ...alert,
                id,
                remove: () => removeAlert(id),
            },
        ])
    }

    return (
        <AlertsContext.Provider value={{ addAlert, removeAlert }}>
            {children}

            <AlertStack>
                {alerts.map(
                    ({
                        message,
                        remove,
                        id,
                        options: { onHidden, ...props },
                    }) => (
                        <AlertBar
                            {...props}
                            key={id}
                            onHidden={() => {
                                onHidden && onHidden()
                                remove()
                            }}
                        >
                            {message}
                        </AlertBar>
                    )
                )}
            </AlertStack>
        </AlertsContext.Provider>
    )
}

AlertsProvider.propTypes = {
    children: PropTypes.any,
}

export default AlertsProvider
