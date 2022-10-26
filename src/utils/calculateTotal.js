import countProducts from "./countProducts"
import isPromotion from "./isPromotion"

const calculateTotal = (prices, checkout, coupon, delivery) => {
    // helper functions
    const productInfo = (product, column) =>
        parseFloat(
            prices.find(item => item['Product'] === product) ? prices.find(item => item['Product'] === product)[column] : 0
        )

    // const bundleProductsCost = (
    //     numberOfProducts,
    //     numberInBundle,
    //     singleCost,
    //     bundleCost
    // ) =>
    //     ((numberOfProducts - (numberOfProducts % numberInBundle)) /
    //         numberInBundle) *
    //         bundleCost +
    //     (numberOfProducts % numberInBundle) * singleCost

    // define the numbers from sheets that are needed for prices
    const [singleBox5, singleGram, singleBatch] = [
        productInfo('Box of 5', 'Single'),
        // productInfo("Box of 5", "Bundle"),
        productInfo('MAC-A-GRAM', 'Single'),
        // productInfo("MAC-A-GRAM", "Bundle"),
        productInfo('Batch of 12', 'Single')
    ]
    // const [inBundleBox5, inBundleGram] = [
    //     productInfo("Box of 5", "Bundle Size"),
    //     productInfo("MAC-A-GRAM", "Bundle Size"),
    // ]
    const [amountBox5, amountGram, amountBatch] = [
        countProducts(checkout, 'Box of 5'),
        countProducts(checkout, 'MAC-A-GRAM'),
        countProducts(checkout, 'Batch of 12')
    ]

    // math
    const [costBox5, costGram, costBatch] = [amountBox5 * singleBox5, amountGram * singleGram, amountBatch * singleBatch]

    // math for bundles. might come back
    // const [costBox5, costGram, costBatch] = [
    //     bundleProductsCost(amountBox5, inBundleBox5, singleBox5, bundleBox5),
    //     bundleProductsCost(amountGram, inBundleGram, singleGram, bundleGram),
    //     amountBatch * singleBatch,
    // ]

    const productsTotal = costBox5 + costGram + costBatch
    const couponAmount = coupon ? parseFloat(coupon['Amount']) : 0
    const discount =
        isPromotion(checkout, 'blackFridayDouble') || isPromotion(checkout, 'blackFriday')
            ? 15 * Math.floor(countProducts(checkout, 'Box of 5') / 3)
            : coupon && coupon['Type'] === '%'
            ? productsTotal * (couponAmount / 100)
            : coupon && coupon['Type'] === '$'
            ? couponAmount
            : 0
    const deliveryCost = productsTotal - parseFloat(discount) >= 40 ? 0 : delivery === 'delivery' ? 7 : 0

    return productsTotal - parseFloat(discount) + deliveryCost
}

export default calculateTotal
