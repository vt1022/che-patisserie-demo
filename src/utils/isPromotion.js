import countProducts from "./countProducts"
import { momentInt, nextSaturday, thisSaturday } from "./getDates"

const isPromotion = (checkout, promoCheck) => {
    switch (promoCheck) {
        case "validWebLaunch":
            // website launch
            const isWebLaunchDays =
                (momentInt("DDD") > 233 && momentInt("DDD") < 236 && momentInt("YY") === 21) ||
                (momentInt("DDD") === 236 && momentInt("H") < 18 && momentInt("YY") === 21)
            const isTwoPlusBox5 =
                countProducts(checkout, "Box of 5", thisSaturday()) > 2 || countProducts(checkout, "Box of 5", nextSaturday()) > 2
            return isWebLaunchDays && isTwoPlusBox5

        case "webLaunchDays":
            return (momentInt("DDD") > 233 && momentInt("DDD") < 236) || (momentInt("DDD") === 236 && momentInt("H") < 18)

        case "blackFriday":
            // black friday
            const isBlackFriday =
                (momentInt("DDD") > 320 && momentInt("DDD") < 328 && momentInt("YY") === 21) ||
                (momentInt("DDD") === 328 && momentInt("H") < 18 && momentInt("YY") === 21)
            // const isBlackFridayBox = countProducts(checkout, "Box of 5", "11/27/2021") > 2 || countProducts(checkout, "Box of 5", "12/04/2021") > 2
            const isBlackFridayBox = checkout["12/04/2021"] && countProducts(checkout, "Box of 5", "12/04/2021") > 2

            return isBlackFriday && isBlackFridayBox

        case "blackFridayDouble":
            const isBFDouble =
                (momentInt("DDD") > 320 && momentInt("DDD") < 328 && momentInt("YY") === 21) ||
                (momentInt("DDD") === 328 && momentInt("H") < 18 && momentInt("YY") === 21)
            // const isBFDoubleBox = countProducts(checkout, "Box of 5", "11/27/2021") > 2 && countProducts(checkout, "Box of 5", "12/04/2021") > 2
            const isBFDoubleBox = checkout["12/04/2021"] && countProducts(checkout, "Box of 5", "12/04/2021") > 2

            return isBFDouble && isBFDoubleBox

        case "blackFridayDays":
            return (
                (momentInt("DDD") > 320 && momentInt("DDD") < 328 && momentInt("YY") === 21) ||
                (momentInt("DDD") === 328 && momentInt("H") < 18 && momentInt("YY") === 21)
            )
        default:
            break
    }
}

export default isPromotion
