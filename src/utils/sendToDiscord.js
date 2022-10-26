import moment from "moment"
import { DISCORD_HOOK } from "./configs"

const sendToDiscord = state => {
    const {
        contactInfo,
        delivery,
        pickup,
        deliveryAddress,
        matchedCoupon,
        couponCode,
        total,
        cart,
    } = state

    const deliveryDates = () => {
        let result = ""
        Object.keys(cart).forEach((date, i) => {
            if (
                Object.values(cart[date]).filter(item => item.length > 0)
                    .length > 0
            ) {
                result += `${i > 0 ? `, ` : ``}${moment(date).format("MMM D")}`
            }
        })
        return result
    }

    const getProductAmount = product => {
        let count = 0
        Object.keys(cart).forEach(date => {
            count += Object.values(cart[date]).find(
                item => item === cart[date][product]
            ).length
        })
        return count
    }

    const packagesDetails = () => {
        let result = ""
        Object.keys(cart).forEach((date, index) => {
            const boxHeaders = Object.keys(cart[date]).reduce((acc, curr) => {
                const result = curr.toLowerCase().includes("box")
                    ? "Box"
                    : curr.toLowerCase().includes("batch")
                    ? "Batch"
                    : curr

                acc.push(result)
                return acc
            }, [])
            // if the cart of that date is not empty
            if (
                Object.values(cart[date]).filter(item => item.length > 0)
                    .length > 0
            ) {
                result += `${index > 0 ? "\r\n" : ""}${moment(date).format(
                    "MMM Do"
                )}\r\n`
            }

            Object.keys(cart[date]).forEach((product, productNumber) => {
                // if the product is not empty
                if (cart[date][product].length > 0) {
                    cart[date][product].forEach((box, i) => {
                        result += `\r\n${boxHeaders[productNumber]} ${
                            i + 1
                        }\r\n`

                        for (const [key, value] of Object.entries(
                            cart[date][product][i]
                        )) {
                            result += `${key}: ${value}\r\n`
                        }
                    })
                }
            })
        })
        return result
    }

    const request = new XMLHttpRequest()

    request.open("POST", DISCORD_HOOK)
    request.setRequestHeader("Content-type", "application/json")

    const thankYouEmail = `Hi ${
        contactInfo["user-name"]
    },\r\n\r\nThank you for ordering from us! This is an email to confirm that we have received your payment.\r\n\r\n${
        delivery === "pickup" ? `Pickup Details - ${pickup["value"]}` : ""
    }${
        delivery === "delivery"
            ? `Delivery Date(s): ${deliveryDates()} \r\nAddress: ${deliveryAddress}`
            : ""
    }\r\n\r\nThank you so much for the support and we can't wait for you to taste our macarons!\r\n\r\nLove,\r\nChé Macarons`

    const params = {
        username: `Order from ${contactInfo["user-name"]}`,
        avatar_url: "",
        content: thankYouEmail,
        embeds: [
            {
                description: `${contactInfo["user-email"]}\r\n${
                    contactInfo["user-cell"]
                }
                    +Box of Five:  ${getProductAmount("Box of 5")}
                    +MAC-A-GRAM:  ${getProductAmount("MAC-A-GRAM")}
                    +Batch of 12:  ${getProductAmount("Batch of 12")}
                    ${
                        delivery === "pickup"
                            ? `+Pick Up: ${pickup["value"]}`
                            : ""
                    }${
                    delivery === "delivery"
                        ? `+Delivery Date: ${deliveryDates()}`
                        : ""
                }
                    ${
                        delivery === "delivery"
                            ? `+Address: 
                    --${deliveryAddress}`
                            : ""
                    }
                    ${
                        matchedCoupon["Code"] !== ""
                            ? `\r\n+Code: ${couponCode}
                    --discount: ${matchedCoupon["Amount"]}${matchedCoupon["Type"]}`
                            : ""
                    }
                    
                    +TOTAL: ${total}`,
                color: parseInt("#ff0000".replace("#", ""), 16),
            },
            {
                description: "Products: \r\n" + packagesDetails(),
                color: parseInt("#0000ff".replace("#", ""), 16),
            },
        ],
    }
    request.send(JSON.stringify(params))
}

export default sendToDiscord
