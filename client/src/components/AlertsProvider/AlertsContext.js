import { createContext } from 'react'

const unimplemented = () => {
    throw new Error('AlertsContext has not been initialised yet.')
}

export default createContext({
    addAlert: unimplemented,
    removeAlert: unimplemented,
})
