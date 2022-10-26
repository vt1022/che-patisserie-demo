import React, { useContext, useEffect } from "react"
import { Context } from "../../context"

const CouponCode = ({ disabled, disabledMsg }) => {
    const [{ couponCode, couponList }, dispatch] = useContext(Context)

    const inputHandler = e => {
        dispatch({
            type: "setCoupon",
            data: e.target.value.trim().toUpperCase()
        })
    }

    const matchedCoupon = couponList.find(coupon => coupon["Code"] === couponCode)

    useEffect(() => {
        if (matchedCoupon) {
            dispatch({ type: "setMatchedCoupon", data: matchedCoupon })
        } else {
            dispatch({
                type: "setMatchedCoupon",
                data: { Code: "", Amount: "", Type: "" }
            })
        }
    }, [couponCode, matchedCoupon, dispatch])

    return (
        <div className="coupon-code">
            {disabled && <p className="coupon-code__message cart__p cart__p--coupon-msg">{disabledMsg}</p>}
            <div className="coupon-code__info__item flying-label-item">
                <input
                    className={`flying-label-item__input flying-label-item__input--coupon coupon-code__input ${
                        disabled ? "disable" : ""
                    } ${matchedCoupon && matchedCoupon["Code"] !== "" ? "valid" : ""}`}
                    type="text"
                    value={couponCode}
                    onChange={inputHandler}
                    maxLength="5"
                    disabled={disabled}
                />
                <label
                    className={`flying-label-item__label flying-label-item__label--coupon coupon-code__label ${
                        disabled ? "disable" : ""
                    }`}>
                    Coupon Code
                </label>
            </div>
            {matchedCoupon && matchedCoupon["Code"] !== "" ? (
                <p className="coupon-code__message cart__p cart__p--coupon-msg">
                    {matchedCoupon["Type"] === "%"
                        ? `${parseFloat(matchedCoupon["Amount"])}% off your order!`
                        : matchedCoupon["Type"] === "$"
                        ? `$${parseFloat(matchedCoupon["Amount"])} off your order!`
                        : ""}
                </p>
            ) : !matchedCoupon && couponCode !== "" ? (
                <p className="coupon-code__message cart__p cart__p--coupon-msg">That's an invalid code</p>
            ) : (
                ""
            )}
        </div>
    )
}

export default CouponCode
