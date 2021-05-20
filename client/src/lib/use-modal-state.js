import { useState } from 'react'

export const useModalState = () => {
    const [isVisible, setIsVisible] = useState(false)
    const show = () => setIsVisible(true)
    const hide = () => setIsVisible(false)
    return { isVisible, show, hide }
}
