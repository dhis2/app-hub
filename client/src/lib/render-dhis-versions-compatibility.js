export const renderDhisVersionsCompatibility = (min, max) => {
    if (min && max) {
        return `${min}–${max}`
    } else if (min && !max) {
        return `${min} and above`
    } else if (!min && max) {
        return `${max} and below`
    }
    return 'all versions'
}
