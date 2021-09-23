import { useRef, useEffect, useCallback } from 'react'

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
    if (param instanceof Set) {
        return encodeQueryParameter([...param])
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
    Object.entries(params)
        .filter(([, value]) => value)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeQueryParameter(value)}`
        )
        .join('&')

// This is a SWR middleware for keeping the data even if key changes.
// See https://swr.vercel.app/docs/middleware#keep-previous-result
export const laggySWRMiddleware = useSWRNext => {
    return (key, fetcher, config) => {
        // Use a ref to store previous returned data
        const laggyDataRef = useRef()

        // Actual SWR hook.
        const swr = useSWRNext(key, fetcher, config)

        useEffect(() => {
            // Update ref if data is not undefined
            if (swr.data !== undefined) {
                laggyDataRef.current = swr.data
            }
        }, [swr.data])

        // Expose a method to clear the laggy data, if any
        const resetLaggy = useCallback(() => {
            laggyDataRef.current = undefined
        }, [])

        // Fallback to previous data if the current data is undefined
        const dataOrLaggyData =
            swr.data === undefined ? laggyDataRef.current : swr.data

        // Is it showing previous data?
        const isLagging =
            swr.data === undefined && laggyDataRef.current !== undefined

        // Also add a `isLagging` field to SWR.
        return Object.assign({}, swr, {
            data: dataOrLaggyData,
            isLagging,
            resetLaggy,
        })
    }
}
