import React, { Fragment, useContext } from "react"
import { Link } from "react-router-dom"
import { formatString } from "../../../utils/formatString"
import { Context } from "../../context"

const CheckoutBasket = ({ date, checkout }) => {
    const [state, dispatch] = useContext(Context)
    const boxHeaders = Object.keys(checkout[date]).reduce((acc, curr) => {
        const result = curr.toLowerCase().includes("box") ? "Box" : curr.toLowerCase().includes("batch") ? "Batch" : curr

        acc.push(result)
        return acc
    }, [])

    const productTypeHeaders = ["Box of 5", "MAC-A-GRAM", "Batch of 12", "Catering + Bulk"]

    const inCheckout = date => Object.values(checkout[date])

    return inCheckout(date).map((productType, index) => {
        const productClassName = formatString(productTypeHeaders[index], "kebab")

        return productType.length > 0 ? (
            <Fragment key={index}>
                <h3 className="cart_h3 cart__h3--product">{productTypeHeaders[index]}</h3>
                <Link
                    className="cart__btn cart__btn--edit btn"
                    to={`/shop/${productClassName}`}
                    onClick={() => dispatch({ type: "setDate", data: date })}>
                    Edit
                </Link>
                <div className={`cart__product cart__product--${productClassName}`}>
                    {productType.map((box, i) => {
                        return (
                            <div className={`cart__product__box`} key={i}>
                                <h4 className={`cart__h4 cart__h4--${productClassName}`}>{`${boxHeaders[index]} ${i + 1}`}</h4>
                                {Object.keys(box).map((flavour, x) => {
                                    return (
                                        <div key={x} className="cart__product__flavour">
                                            <p className="cart__product__flavour__name">{flavour}</p>
                                            <p className="cart__product__flavour__amount">{box[flavour]}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </Fragment>
        ) : null
    })
}

export default CheckoutBasket
