import React, { useContext } from "react"
import { Context } from "../context/index"
import { formatString } from "../../utils/formatString"

const CartInput = ({ boxType, date }) => {
    const [{ selectedFlavour, cart }, dispatch] = useContext(Context)
    // set limit for each product
    const limit =
        boxType === "Box of 5"
            ? 10
            : boxType === "Batch of 12"
            ? 10
            : boxType === "MAC-A-GRAM"
            ? 20
            : 0

    const isNumberKey = e => {
        const charCode = e.which ? e.which : e.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            e.preventDefault()
    }

    const btnHandler = (e, action) => {
        e.target.blur()
        // const currBoxNumber = parseInt(cart[date][boxType].length) + 1

        switch (action) {
            case "add":
                if (cart[date][boxType].length >= limit) return
                // maybe send an alert() to tell customer its reached max
                return dispatch({
                    type: "setCart",
                    data: {
                        ...cart,
                        [date]: {
                            ...cart[date],
                            [boxType]: [...cart[date][boxType], {}],
                        },
                    },
                })

            case "remove":
                // use splice to remove the last item in the array.
                // don't remove anything from the array if there's none of the current flavour in the array
                return dispatch({
                    type: "setCart",
                    data: {
                        ...cart,
                        [date]: {
                            ...cart[date],
                            [boxType]: cart[date][boxType].splice(
                                0,
                                cart[date][boxType].length - 1
                            ),
                        },
                    },
                })
            default:
                return console.log("something went wrong with cart input")
        }
    }

    const inputHandler = e => {
        const finalValue = e.target.value > limit ? limit : e.target.value

        const amountOfBoxes = () => {
            var arr = []
            for (var i = 0; i < finalValue; i++) arr.push({})
            return arr
        }

        dispatch({
            type: "setCart",
            data: {
                ...cart,
                [date]: {
                    ...cart[date],
                    [boxType]: [...amountOfBoxes()],
                },
            },
        })
    }

    const formattedName = formatString(selectedFlavour, "kebab")
    
    return (
        <div className="cart-input">
            <button
                className="cart-input__btn--remove cart-input__btn"
                onClick={e => btnHandler(e, "remove")}>
                -
            </button>
            <input
                className={`cart-input__amount cart-input__amount--${boxType}`}
                name={`${formattedName}--${date}`}
                id={`${formattedName}--${date}`}
                onKeyPress={isNumberKey}
                onChange={inputHandler}
                onClick={e => e.target.select()}
                value={cart[date][boxType] ? cart[date][boxType].length : 0}
                type="number"
                min="0"
                max={limit}
                pattern="[0-9]+"
                title="Non-negative integral number"
            />
            <button
                className="cart-input__btn--add cart-input__btn"
                onClick={e => btnHandler(e, "add")}>
                +
            </button>
        </div>
    )
}

export default CartInput
