import moment from 'moment'

// return moment info as integer not string
export const momentInt = (format, day) => parseInt(moment(day).format(format))

export const getNextDay = day => {
    // expected value of day is the day of the week in number form ex: tuesday, day = 2
    let daysToDay = parseInt(day) - parseInt(moment().format('d'))
    // add 7 more days if day of the week is today or already passed
    if (daysToDay < 1) daysToDay += 7
    // add another 7 days if it is past thursday or if it is thursday after 8pm
    if (
        (parseInt(moment().format('d')) > 4 && parseInt(moment().format('d')) < 6) ||
        (parseInt(moment().format('d')) === 4 && parseInt(moment().format('H')) > 19)
    )
        daysToDay += 7
    return moment().add(daysToDay, 'days').format('MM/DD/YYYY')
}

export const [thisSaturday, nextSaturday] = [
    (format = 'MM/DD/YYYY') => moment(getNextDay(6)).format(format),
    (format = 'MM/DD/YYYY') => moment(getNextDay(6)).add(7, 'days').format(format)
]

// use the weekly flavours to find the upcoming order dates
export const nextOrderDates = weeklyFlavours => {
    return weeklyFlavours
        .filter(flavour => {
            // undefined argument is getting the date for current day
            const isFutureFlavour =
                momentInt('DDD', flavour['Date']) > momentInt('DDD') || momentInt('YY', flavour['Date']) > momentInt('YY')

            const isMoreThanTwoDaysBeforeFlavourDate = moment(flavour['Date']).diff(moment(), 'days') > 2

            const twoDaysBeforeFlavourDate = momentInt('DDD') === momentInt('DDD', flavour['Date']) - 2

            const isBeforeEightPm = momentInt('H') < 20

            return (
                (isFutureFlavour && isMoreThanTwoDaysBeforeFlavourDate) ||
                (isFutureFlavour && twoDaysBeforeFlavourDate && isBeforeEightPm)
            )
        })
        .reduce((acc, curr) => {
            if (!acc.includes(curr['Date'])) acc.push(curr['Date'])
            return acc
        }, [])
}
