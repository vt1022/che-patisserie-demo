import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../context'
import CartInput from '../CartInput'
import FlavourPicker from './FlavourPicker'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { productImages, productAltText } from '../../../utils/productImages'
import { formatString } from '../../../utils/formatString'
import { nextOrderDates } from '../../../utils/getDates'
import awayMessage from '../../../utils/awayMessage'
import countProducts from '../../../utils/countProducts'
import getProductType from '../../../utils/getProductType'

const OrderForm = ({ match, setCheckout, checkout }) => {
    const [{ cart, flavours, prices, date }, dispatch] = useContext(Context)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (Object.keys(cart).length === 0) {
            const initialCart = () => {
                const weeklyCart = {
                    'Box of 5': [],
                    'MAC-A-GRAM': [],
                    'Batch of 12': [],
                    'Catering + Bulk': []
                }

                const result = nextOrderDates(flavours.weekly).reduce((acc, curr) => {
                    if (!acc[curr]) acc[curr] = weeklyCart
                    return acc
                }, {})

                return result
            }

            dispatch({ type: 'setCart', data: initialCart() })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getNames = (acc, curr) => {
        acc.push(curr['Flavour'])
        return acc
    }

    const weeklyFlavourNames = flavours.weekly.filter(entry => entry['Date'] === date).reduce(getNames, [])

    // const isRestWeek = week =>
    //     flavours.weekly.filter(entry => entry['Date'] === moment(week).format('MM/DD/YYYY')).reduce(getNames, []).length === 0

    const endpoint = match.params.product
    const productName = endpoint === 'mac-a-gram' ? endpoint.toUpperCase() : formatString(endpoint, 'kebab to title')

    const header = productName.toLowerCase().includes('box')
        ? 'Box'
        : productName.toLowerCase().includes('batch')
        ? 'Batch'
        : productName

    const macsInBox = productName === 'Box of 5' ? 5 : productName === 'MAC-A-GRAM' ? 2 : productName === 'Batch of 12' ? 12 : 0

    const isFilledBox =
        Object.keys(cart).length > 0
            ? cart[date][productName].reduce((acc, curr) => {
                  // checks each box and returns an array of [true, false, true...]
                  if (Object.values(curr).reduce((a, b) => a + b, 0) === macsInBox) {
                      acc.push(true)
                  } else {
                      acc.push(false)
                  }
                  return acc
              }, [])
            : []

    const handleDateClick = date => dispatch({ type: 'setDate', data: date })

    const handleAddToCart = e => {
        if (cart[date] === undefined) return

        let chosenFlavours = cart[date][productName]

        if (getProductType(flavours.weekly, date) === 'set' && productName === 'Box of 5') {
            const finalData = []

            const setObj = weeklyFlavourNames.reduce((acc, curr) => {
                acc[curr] = 1
                return acc
            }, {})

            for (let i = 0; i < cart[date][productName].length; i++) {
                finalData.push(setObj)
            }

            chosenFlavours = finalData
            dispatch({
                type: 'setCart',
                data: {
                    ...cart,
                    [date]: {
                        ...cart[date],
                        [productName]: chosenFlavours
                    }
                }
            })
        } else if (productName === 'Box of 5' || productName === 'MAC-A-GRAM') {
            // error message for boxes
            if (isFilledBox.includes(false)) {
                const problemBoxes = isFilledBox
                    .map((item, index) => (!item ? index + 1 : ''))
                    .filter(item => item !== '')
                    .join(', ')

                setMsg(`Box${problemBoxes.length < 2 ? '' : 'es'} ${problemBoxes} needs a total of ${macsInBox} macarons`)
                return
            }
        }
        // error for batches
        if (productName === 'Batch of 12') {
            if (isFilledBox.includes(false)) {
                const problemBoxes = isFilledBox
                    .map((item, index) => (!item ? index + 1 : ''))
                    .filter(item => item !== '')
                    .join(', ')

                setMsg(`Please choose a flavour for Batch${problemBoxes.length < 2 ? '' : 'es'} ${problemBoxes}`)
                return
            }
        }
        setCheckout({
            ...checkout,
            [date]: {
                ...checkout[date],
                [productName]: chosenFlavours
            }
        })
        sessionStorage.setItem(
            'checkout',
            JSON.stringify({
                ...checkout,
                [date]: {
                    ...checkout[date],
                    [productName]: chosenFlavours
                }
            })
        )
        alert('Successfully added to cart')
    }

    const GridItem = ({ name = '', price = '', image = '', alt = '' }) =>
        // a lot of customization needed. maybe should just be plain html
        name === 'MAC-A-GRAM oos' ? (
            <div className='shop__grid-item'>
                <div className='shop-item__image-container'>
                    <div className='shop__grid-item__oos'>
                        <p className='shop__grid-item__oos__text'>Out of Stock</p>
                    </div>
                    <img className='shop__grid-item__image' src={image} alt={alt} />
                </div>
                <div className='shop__grid-item__info'>
                    <h3 className='shop__grid-item__name'>{name}</h3>
                    <p className='shop__grid-item__price'>{price}</p>
                </div>
            </div>
        ) : (
            <Link to={`/shop/${formatString(name, 'kebab')}`} className='shop__grid-item'>
                <div className='shop-item__image-container'>
                    <img className='shop__grid-item__image' src={image} alt={alt} />
                </div>
                <div className='shop__grid-item__info'>
                    <h3 className='shop__grid-item__name'>{name.includes('Bulk') ? 'Bulk Order' : name}</h3>
                    <p className='shop__grid__price'>{price}</p>
                </div>
            </Link>
        )

    const handleEmailClick = e => {
        navigator.clipboard.writeText(e.target.innerText)
    }

    const productObj = productType => prices.find(product => product['Product'] === productType)

    const [msgActive, setMsgActive] = useState(false)

    return productName.includes('Bulk') ? (
        <div className={`order-form order-form--${endpoint}`}>
            <div className='order-form__image-container'>
                <img src={productImages[productName]} alt={productAltText[productName]} />
            </div>

            <div className='order-form__week-selection'>
                <div className='order-form__week-selection__wrapper wrapper'>
                    <h2 className='order-form__name'>{productName}</h2>
                    <p className='order-form__p order-form__p--bulk'>
                        {productObj('Catering + Bulk')['Description'] && productObj('Catering + Bulk')['Description']}
                    </p>
                    <p className='order-form__p order-form__p--bulk'>
                        {productObj('Catering + Bulk')['Description 2'] && productObj('Catering + Bulk')['Description 2']}
                    </p>
                    <p className='order-form__p order-form__p--bulk'>
                        {productObj('Catering + Bulk')['Description 3'] && productObj('Catering + Bulk')['Description 3']}
                    </p>
                    <a
                        className='footer__links__social link'
                        href='https://www.instagram.com/che.macarons/'
                        target='_blank'
                        rel='noreferrer'>
                        Instagram
                    </a>
                    <p className='footer__email' onClick={handleEmailClick}>
                        macarons@chepatisserie.com <i className='far fa-copy' aria-hidden='true'></i>
                    </p>
                </div>
            </div>
            <div className='order-form__other wrapper'>
                <h2>Shop Other Products</h2>
                <div className='shop__grid'>
                    {prices.map((product, i) => {
                        return product['Product'] !== productName ? (
                            <GridItem
                                key={i}
                                name={product['Product']}
                                image={productImages[product['Product']]}
                                alt={productAltText[product['Product']]}
                            />
                        ) : null
                    })}
                </div>
            </div>
        </div>
    ) : (
        <div className={`order-form order-form--${endpoint}`}>
            <div className='order-form__image-container'>
                {endpoint === 'box-of-5' && msgActive && (
                    <div className='home__top-message'>
                        <div className='home__top-message__wrapper wrapper'>
                            <p className='home__p'>
                                Add 3 <strong>Box of 5s</strong> to cart for Buy 2 get 1 FREE
                            </p>
                            <button className='home__top-message__btn' onClick={() => setMsgActive(false)}>
                                X
                            </button>
                        </div>
                    </div>
                )}
                <img src={productImages[productName]} alt={productAltText[productName]} />
            </div>

            <div className='order-form__week-selection'>
                <div className='order-form__week-selection__wrapper wrapper'>
                    <h2 className='order-form__name'>{`${productName} - $${productObj(productName)['Single']}`}</h2>
                    {nextOrderDates(flavours.weekly).length > 0 && (
                        <>
                            <p className='order-form__p order-form__week-selection__choose'>Order for</p>
                            <div className='order-form__btns'>
                                {nextOrderDates(flavours.weekly).map((week, i) => {
                                    return endpoint === 'mac-a-gram' ? (
                                        getProductType(flavours.weekly, week) !== 'set' && (
                                            <button
                                                key={i}
                                                className={`order-form__btn order-form__btn--week btn${
                                                    date === week ? ' active' : ''
                                                }`}
                                                onClick={() => handleDateClick(week)}>
                                                {moment(week).format('MMM DD')}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            key={i}
                                            className={`order-form__btn order-form__btn--week btn${
                                                date === week ? ' active' : ''
                                            }`}
                                            onClick={() => handleDateClick(week)}>
                                            {moment(week).format('MMM DD')}
                                        </button>
                                    )
                                })}
                            </div>
                            {endpoint !== 'mac-a-gram' && getProductType(flavours.weekly, date) === 'set' && (
                                <p className='order-form__p order-form__p--set'>5 preset premium flavours this week</p>
                            )}
                        </>
                    )}
                    {nextOrderDates(flavours.weekly).length < 1 && (
                        <p className='order-form__instruction order-form__p'>{awayMessage}</p>
                    )}
                </div>
            </div>

            {endpoint === 'mac-a-gram' && getProductType(flavours.weekly, date) === 'set' ? null : nextOrderDates(flavours.weekly)
                  .length > 0 ? (
                <div className='order-form__quantity'>
                    <div className='order-form__quantity__wrapper wrapper'>
                        <p className='order-form__p order-form__p--quantity p'>Quantity</p>
                        <CartInput boxType={productName} date={date} />
                    </div>
                </div>
            ) : null}

            <div className='order-form__boxes wrapper'>
                {Object.keys(cart).length > 0 && (
                    <>
                        {cart[date][productName].length < 1 && (
                            <p className='order-form__instruction'>
                                Please choose the date and the amount of products you want to order.
                            </p>
                        )}
                        {cart[date][productName].map((box, boxNumber) => {
                            return (
                                <div className='order-form__package' key={boxNumber}>
                                    <h5 className='order-form__h5'>{`${header} ${boxNumber + 1}`}</h5>
                                    {productName === 'Batch of 12' ? (
                                        <FlavourPicker date={date} boxType={productName} boxNumber={boxNumber} />
                                    ) : (
                                        weeklyFlavourNames.map((flavour, index) => (
                                            <FlavourPicker
                                                productType={getProductType(flavours.weekly, date)}
                                                date={date}
                                                key={index}
                                                boxType={productName}
                                                boxNumber={boxNumber}
                                                flavour={flavour}
                                            />
                                        ))
                                    )}
                                </div>
                            )
                        })}
                    </>
                )}
            </div>

            <div className='order-form__atc'>
                <div className='order-form__atc__wrapper wrapper'>
                    <p className='order-form__atc__msg'>{msg}</p>
                    <button className='order-form__btn order-form__btn--atc btn' onClick={handleAddToCart}>
                        {countProducts(checkout, productName) > 0 ? 'Submit Changes' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            <div className='order-form__other wrapper'>
                <h2>Shop Other Products</h2>
                <div className='shop__grid'>
                    {prices.map((product, i) => {
                        return product['Product'] !== productName ? (
                            <GridItem
                                key={i}
                                name={product['Product']}
                                image={productImages[product['Product']]}
                                alt={productAltText[product['Product']]}
                            />
                        ) : null
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderForm
