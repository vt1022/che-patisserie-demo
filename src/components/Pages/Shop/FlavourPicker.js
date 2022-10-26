import React, { useContext, useEffect } from "react"
import { formatString } from "../../../utils/formatString"
import { Context } from "../../context"

const FlavourPicker = ({ boxNumber, boxType, flavour = "", date, productType }) => {
    const [{ cart, flavours }, dispatch] = useContext(Context)

    const flavourNameKebab = formatString(flavour, "kebab")
    // set limit for each product
    const limit = boxType === "Box of 5" ? 5 : boxType === "MAC-A-GRAM" ? 2 : 0

    const btnHandler = (e, action) => {
        e.target.blur()
        const boxCopy = [...cart[date][boxType]]
        const flavourAmount = parseInt(cart[date][boxType][boxNumber][flavour]) || 0

        switch (action) {
            case "add":
                if (flavourAmount >= limit) return
                // maybe send an alert() to tell customer its reached max
                boxCopy[boxNumber] = {
                    ...boxCopy[boxNumber],
                    [flavour]: flavourAmount + 1
                }
                return dispatch({
                    type: "setCart",
                    data: {
                        ...cart,
                        [date]: {
                            ...cart[date],
                            [boxType]: boxCopy
                        }
                    }
                })

            case "remove":
                if (flavourAmount < 1) return
                // maybe send an alert() to tell customer its reached 0
                boxCopy[boxNumber] = {
                    ...boxCopy[boxNumber],
                    [flavour]: flavourAmount - 1
                }
                return dispatch({
                    type: "setCart",
                    data: {
                        ...cart,
                        [date]: {
                            ...cart[date],
                            [boxType]: boxCopy
                        }
                    }
                })
            default:
                return console.log("something went wrong with flavour input")
        }
    }

    const handleChange = e => {
        const finalValue = e.target.value > limit ? limit : e.target.value

        const boxCopy = [...cart[date][boxType]]
        boxCopy[boxNumber] = {
            ...boxCopy[boxNumber],
            [flavour]: parseInt(finalValue) || 0
        }

        dispatch({
            type: "setCart",
            data: {
                ...cart,
                [date]: {
                    ...cart[date],
                    [boxType]: boxCopy
                }
            }
        })
    }

    const handleBatchChange = e => {
        const boxCopy = [...cart[date][boxType]]
        boxCopy[boxNumber] = {
            // ...boxCopy[boxNumber],
            [e.target.value]: e.target.value === "Choose One" ? 0 : 12
        }

        dispatch({
            type: "setCart",
            data: {
                ...cart,
                [date]: {
                    ...cart[date],
                    [boxType]: boxCopy
                }
            }
        })
    }

    useEffect(() => {}, [])

    return (
        <div className="flavour-picker">
            {boxType === "Batch of 12" ? (
                <>
                    <select
                        className="form__select form__product__batch-flavour"
                        name={`batch${boxNumber + 1}`}
                        id={`batch${boxNumber + 1}`}
                        value={Object.keys(cart[date][boxType][boxNumber])}
                        onChange={handleBatchChange}>
                        <option>Choose One</option>
                        {flavours.all.map((flavour, i) => (
                            <option key={i}>{flavour["Flavour"]}</option>
                        ))}
                    </select>
                </>
            ) : productType === "set" ? (
                <>
                    <label
                        className={`flavour-picker__label flavour-picker__label--${flavourNameKebab}`}
                        htmlFor={`${flavourNameKebab}--${formatString(boxType, "kebab")}-${boxNumber + 1}`}>
                        {flavour}
                    </label>
                    <div className="flavour-picker__container">
                        <div className="flavour-picker__btn--remove flavour-picker__btn" />
                        <input
                            className={`flavour-picker__amount flavour-picker__amount--${flavourNameKebab}`}
                            id={flavourNameKebab}
                            name={`${flavourNameKebab}--${formatString(boxType, "kebab")}-${boxNumber + 1}`}
                            value={1}
                            disabled
                            onClick={e => e.target.select()}
                            onChange={handleChange}
                            type="number"
                            min="0"
                            max="5"
                            pattern="[0-9]*"
                            title="Non-negative integral number"
                        />
                        <div className="flavour-picker__btn--add flavour-picker__btn" />
                    </div>
                </>
            ) : (
                <>
                    <label
                        className={`flavour-picker__label flavour-picker__label--${flavourNameKebab}`}
                        htmlFor={`${flavourNameKebab}--${formatString(boxType, "kebab")}-${boxNumber + 1}`}>
                        {flavour}
                    </label>
                    <div className="flavour-picker__container">
                        <button
                            className="flavour-picker__btn--remove flavour-picker__btn"
                            onClick={e => btnHandler(e, "remove")}>
                            -
                        </button>
                        <input
                            className={`flavour-picker__amount flavour-picker__amount--${flavourNameKebab}`}
                            id={flavourNameKebab}
                            name={`${flavourNameKebab}--${formatString(boxType, "kebab")}-${boxNumber + 1}`}
                            value={cart[date][boxType][boxNumber][flavour] || 0}
                            onClick={e => e.target.select()}
                            onChange={handleChange}
                            type="number"
                            min="0"
                            max="5"
                            pattern="[0-9]*"
                            title="Non-negative integral number"
                        />
                        <button className="flavour-picker__btn--add flavour-picker__btn" onClick={e => btnHandler(e, "add")}>
                            +
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default FlavourPicker
