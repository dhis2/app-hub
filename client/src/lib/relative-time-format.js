const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
}

export const relativeTimeFormat = (datetime, from = new Date()) => {
    const elapsedMilliseconds = datetime - from

    for (const [unit, valueMilliseconds] of Object.entries(units)) {
        if (
            unit === 'second' ||
            Math.abs(elapsedMilliseconds) > valueMilliseconds
        ) {
            const diff = elapsedMilliseconds / valueMilliseconds
            return new Intl.RelativeTimeFormat('en').format(
                Math.round(diff),
                unit
            )
        }
    }
}
