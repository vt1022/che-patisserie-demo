import { momentInt } from "./getDates"

const getProductType = (weeklyFlavours, date) => {
    const productTypes = weeklyFlavours
        .filter(
            flavour => momentInt("DDD", flavour["Date"]) > momentInt("DDD") || momentInt("YY", flavour["Date"]) > momentInt("YY")
        )
        .reduce((acc, curr) => {
            if (curr["Type"] !== undefined && !acc[curr["Date"]]) acc[curr["Date"]] = curr["Type"]
            return acc
        }, {})

    return productTypes[date]
}

export default getProductType
