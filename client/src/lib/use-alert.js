import { useContext } from 'react'
import AlertsContext from 'src/components/AlertsProvider/AlertsContext'

export const useAlert = (message, options = {}) => {
    const { addAlert } = useContext(AlertsContext)

    const show = (props) => {
        const resolvedMessage =
            typeof message === 'function' ? message(props) : message
        const resolvedOptions =
            typeof options === 'function' ? options(props) : options

        addAlert({
            message: resolvedMessage,
            options: resolvedOptions,
        })
    }

    return { show }
}

export const useSuccessAlert = () =>
    useAlert(
        ({ message }) => message,
        (options) => ({
            ...options,
            success: true,
        })
    )

export const useErrorAlert = () =>
    useAlert(
        ({ error }) => `An error occured: ${error.message}`,
        (options) => ({
            ...options,
            critical: true,
        })
    )
