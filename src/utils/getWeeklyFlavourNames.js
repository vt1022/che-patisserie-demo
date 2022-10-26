const getWeeklyFlavourNames = (weeklyFlavours, date) => {
    const getNames = (acc, curr) => {
        acc.push(curr["Flavour"])
        return acc
    }
    return weeklyFlavours.filter(entry => entry["Date"] === date).reduce(getNames, [])
}

export default getWeeklyFlavourNames
