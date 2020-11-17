const encodeQueryParameter = param => {
    if (Array.isArray(param)) {
        return param.map(encodeQueryParameter).join(',')
    }
    if (typeof param === 'string') {
        return encodeURIComponent(param)
    }
    if (typeof param === 'number') {
        return String(param)
    }
    if (typeof param === 'object') {
        throw new Error('Object parameter mappings not yet implemented')
    }
    throw new Error('Unknown parameter type')
}

export const joinUrlPath = (...paths) => {
    const truePaths = paths.filter(path => !!path)
    return truePaths
        .map((path, i) => {
            path = typeof path === 'string' ? path : String(path)
            //remove trailing and leading slashes
            let regex = /^\/+|\/+$/g
            if (i === 0) {
                // if first path, only remove trailing slash. Leading slash is valid as a relative url to the domain-root.
                regex = /\/+$/g
            }
            return path.replace(regex, '')
        })
        .join('/')
}

export const queryParametersToQueryString = params =>
    Object.keys(params)
        .map(key => {
            const value = params[key]
            return `${encodeURIComponent(key)}=${encodeQueryParameter(value)}`
        })
        .join('&')
