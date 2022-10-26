import React, { useContext, useEffect } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
    CLIENT_EMAIL,
    GOOGLE_COUPONS_ID,
    GOOGLE_ORDERS_ID,
    PRIVATE_KEY,
    SPREADSHEET_ID,
    SPECIAL_COUPON,
} from '../../../utils/configs';
import { Link, useHistory } from 'react-router-dom';
import { nextOrderDates } from '../../../utils/getDates';
import { Context } from '../../context';
import calculateTotal from '../../../utils/calculateTotal';
import CheckoutBasket from './CheckoutBasket';
import ContactInfo from './ContactInfo';
import CouponCode from './CouponCode';
import DeliveryOptions from './DeliveryOptions';
import sendToDiscord from '../../../utils/sendToDiscord';
import sendOrderEmail from '../../../utils/sendOrderEmail';
import moment from 'moment';
import addRow from '../../../utils/sheets/addRow';
import countProducts from '../../../utils/countProducts';
import getWeeklyFlavourNames from '../../../utils/getWeeklyFlavourNames';
import { formatString } from '../../../utils/formatString';
import { productAltText, productImages } from '../../../utils/productImages';

const Cart = ({ checkout, setCheckout, setCartCount }) => {
    const history = useHistory();
    const [state, dispatch] = useContext(Context);
    const {
        total,
        prices,
        delivery,
        couponList,
        couponCode,
        matchedCoupon,
        contactInfo,
        cart,
        pickup,
        deliveryAddress,
        flavours,
    } = state;

    const initialCart = () => {
        const weeklyCart = {
            'Box of 5': [],
            'MAC-A-GRAM': [],
            'Batch of 12': [],
            'Catering + Bulk': [],
        };

        const result = nextOrderDates(flavours.weekly).reduce((acc, curr) => {
            if (!acc[curr]) acc[curr] = weeklyCart;
            return acc;
        }, {});

        return result;
    };

    // promotions -------------------
    // const isWebLaunchDays =
    //     (parseInt(moment().format("DDD")) > 233 && parseInt(moment().format("DDD")) < 236) ||
    //     (parseInt(moment().format("DDD")) === 236 && parseInt(moment().format("H")) < 18)
    // const isTwoPlusBox5 =
    //     countProducts(checkout, "Box of 5", thisSaturday()) > 2 || countProducts(checkout, "Box of 5", nextSaturday()) > 2
    // promotions ---------end------------

    // reset sessionStorage and reload if the cart date doesnt exists yet
    // if (cart[thisSaturday()] === undefined || cart[nextSaturday()] === undefined) {
    //     sessionStorage.clear()
    //     window.location.reload()
    //     console.log("reload")
    // }

    const handleClear = (e) => {
        e.target.blur();
        setCheckout(initialCart());
        sessionStorage.clear();
        dispatch({ type: 'loading', data: false });
        dispatch({
            type: 'setCart',
            data: initialCart(),
        });
        dispatch({ type: 'setTotal', data: 0 });
        setCartCount(0);
    };

    const getCartAmountOnDate = (date) => {
        let count = 0;
        if (checkout[date]) {
            Object.values(checkout[date]).forEach((item, i) => {
                count += item.length || 0;
            });
        }
        return parseInt(count);
    };

    const totalCartAmount = nextOrderDates(flavours.weekly).reduce(
        (acc, curr) => {
            acc += getCartAmountOnDate(curr);
            return acc;
        },
        0
    );

    const packagesDetails = () => {
        let result = '';
        Object.keys(checkout).forEach((date, index) => {
            const boxHeaders = Object.keys(checkout[date]).reduce(
                (acc, curr) => {
                    const result = curr.toLowerCase().includes('box')
                        ? 'Box'
                        : curr.toLowerCase().includes('batch')
                        ? 'Batch'
                        : curr;

                    acc.push(result);
                    return acc;
                },
                []
            );
            // if the checkout of that date is not empty
            if (
                Object.values(checkout[date]).filter((item) => item.length > 0)
                    .length > 0
            ) {
                result += `${index > 0 ? '<br><br>' : ''}<strong>${moment(
                    date
                ).format('MMM Do')}</strong>`;
            }

            Object.keys(checkout[date]).forEach((product, productNumber) => {
                // if the product is not empty
                if (checkout[date][product].length > 0) {
                    checkout[date][product].forEach((box, i) => {
                        result += `<br>${boxHeaders[productNumber]} ${i + 1}`;

                        for (const [key, value] of Object.entries(
                            checkout[date][product][i]
                        )) {
                            result += `<br> --${key}: ${value}`;
                        }
                    });
                }
            });
        });
        return result;
    };

    const deleteCoupon = async () => {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        try {
            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            });
            await doc.loadInfo();
            const rows = await doc.sheetsById[GOOGLE_COUPONS_ID].getRows();
            // delete the row that matches the rowNumber of the matchedCoupon
            await rows[
                rows.indexOf(
                    rows.find(
                        (row) => row.rowNumber === matchedCoupon.rowNumber
                    )
                )
            ].delete();
        } catch (e) {
            console.error('Delete Error: ', e);
        }
    };

    const handleConfirm = (e) => {
        e.preventDefault();

        if (totalCartAmount < 1) {
            alert('Your cart is empty');
            return;
        }
        if (delivery === 'pickup' && !pickup['value']) {
            alert('Please choose your pickup time.');
            return;
        }
        if (
            matchedCoupon &&
            matchedCoupon['Code'] !== '' &&
            couponCode !== SPECIAL_COUPON &&
            couponCode !== 'BF20' &&
            couponCode !== 'VDAY' &&
            couponCode !== 'EAS15'
        ) {
            // delete coupon code on use
            deleteCoupon()
        }

        const deliveryDates = () => {
            const result = [];
            Object.keys(cart).forEach((date, i) => {
                if (
                    Object.values(cart[date]).filter((item) => item.length > 0)
                        .length > 0
                ) {
                    result.push(date);
                }
            });
            return result;
        };
        deliveryDates().forEach((date, dateIndex) => {
            const flavoursNames = getWeeklyFlavourNames(flavours.weekly, date);
            const getFlavourAmount = (date, flavourString) => {
                let result = 0;
                // if the checkout of that date is not empty
                if (
                    Object.values(checkout[date]).filter(
                        (item) => item.length > 0
                    ).length > 0
                ) {
                    Object.keys(checkout[date]).forEach(
                        (product, productNumber) => {
                            // if the product is not empty
                            if (checkout[date][product].length > 0) {
                                checkout[date][product].forEach((box, i) => {
                                    for (const [key, value] of Object.entries(
                                        checkout[date][product][i]
                                    )) {
                                        if (key === flavourString)
                                            result += value;
                                    }
                                });
                            }
                        }
                    );
                }
                return result;
            };

            setTimeout(
                () => {
                    addRow(GOOGLE_ORDERS_ID, {
                        Name: `${contactInfo['user-name']} ${
                            deliveryDates().length > 1
                                ? `${dateIndex + 1}/${deliveryDates().length}`
                                : ''
                        }`,
                        Date: date,
                        Email: contactInfo['user-email'],
                        Phone: contactInfo['user-cell'],
                        Price:
                            dateIndex === 0
                                ? total
                                : `x${dateIndex + 1}/${deliveryDates().length}`,
                        'Box of 5':
                            countProducts(checkout, 'Box of 5', date) === 0
                                ? ''
                                : countProducts(checkout, 'Box of 5', date),
                        'MAC-A-GRAM':
                            countProducts(checkout, 'MAC-A-GRAM', date) === 0
                                ? ''
                                : countProducts(checkout, 'MAC-A-GRAM', date),
                        'Batch of 12':
                            countProducts(checkout, 'Batch of 12', date) === 0
                                ? ''
                                : countProducts(checkout, 'Batch of 12', date),
                        'Catering + Bulk':
                            countProducts(checkout, 'Catering + Bulk', date) ===
                            0
                                ? ''
                                : countProducts(
                                      checkout,
                                      'Catering + Bulk',
                                      date
                                  ),
                        'Flavour 1': getFlavourAmount(date, flavoursNames[0]),
                        'Flavour 2': getFlavourAmount(date, flavoursNames[1]),
                        'Flavour 3': getFlavourAmount(date, flavoursNames[2]),
                        'Flavour 4': getFlavourAmount(date, flavoursNames[3]),
                        'Flavour 5':
                            flavoursNames.length > 4
                                ? getFlavourAmount(date, flavoursNames[4])
                                : null,
                        Coupon: matchedCoupon['Type'] !== '' ? couponCode : '',
                        Pickup: delivery === 'pickup' ? pickup['value'] : '',
                        Delivery:
                            delivery === 'delivery' ? deliveryAddress : '',
                    });
                },
                dateIndex > 0 ? 3000 : 0
            );
        });
        history.push('/thankyou');
        sendToDiscord(state);
        sendOrderEmail(e);

        handleClear(e);
    };

    const currCoupon = couponList.find(
        (coupon) => coupon['Code'] === couponCode
    );

    const amountToFreeDelivery = (
        40 - calculateTotal(state.prices, checkout, currCoupon, 'pickup')
    ).toFixed(2);

    const GridItem = ({ name = '', price = '', image = '', alt = '' }) => (
        // a lot of customization needed. maybe should just be plain html
        <Link
            to={`/shop/${formatString(name, 'kebab')}`}
            className='shop__grid-item'
        >
            <div className='shop-item__image-container'>
                <img className='shop__grid-item__image' src={image} alt={alt} />
            </div>
            <div className='shop__grid-item__info'>
                <h3 className='shop__grid-item__name'>
                    {name.includes('Bulk') ? 'Bulk Order' : name}
                </h3>
                <p className='shop__grid__price'>{price}</p>
            </div>
        </Link>
    );

    useEffect(() => {
        dispatch({
            type: 'setTotal',
            data: calculateTotal(state.prices, checkout, currCoupon, delivery)
        })
    }, [checkout, delivery, total, couponCode, dispatch, state.prices, currCoupon])

    return (
        <>
            <form className='cart' onSubmit={handleConfirm}>
                <div className='cart__free'>
                    <p className='cart__free__p wrapper'>
                        {amountToFreeDelivery > 0
                            ? `$${amountToFreeDelivery} away from FREE delivery`
                            : `Free delivery!`}
                    </p>
                </div>
                <div className='wrapper'>
                    <h2 className='cart__h2 h2'>Cart</h2>

                    {totalCartAmount < 1 && <p>Your cart is currently empty</p>}
                    {totalCartAmount > 0 &&
                        Object.keys(checkout).map((date, i) =>
                            countProducts(checkout, 'all', date) > 0 ? (
                                <div key={i} className='cart__date'>
                                    <h3 className='cart__h3 cart__h3--date'>
                                        {moment(date).format('MMM Do')}
                                    </h3>
                                    {(delivery === 'pickup' && total !== 0) ||
                                    (delivery === 'delivery' && total > 5) ? (
                                        <CheckoutBasket
                                            checkout={checkout}
                                            date={date}
                                        />
                                    ) : null}
                                </div>
                            ) : null
                        )}

                    <div className='cart__grid cart__grid--info-options'>
                        <div className='cart__contact'>
                            <h2 className='cart__h2 cart__h2--contact'>
                                Your Info
                            </h2>
                            <ContactInfo />
                        </div>

                        <div className='cart__delivery'>
                            <h2 className='cart__h2 cart__h2--delivery'>
                                Delivery Options
                            </h2>
                            <DeliveryOptions />
                        </div>
                    </div>

                    <h3 className='cart__total cart__h3--total'>{`Total: $${total.toFixed(
                        2
                    )}`}</h3>

                    <div className='cart_coupon'>
                        <CouponCode />
                    </div>
                </div>

                <div className='cart__exit'>
                    <button
                        className='cart__btn cart__btn--confirm btn'
                        // onClick={handleConfirm}
                        type='submit'
                    >
                        Confirm Order
                    </button>
                    <button
                        className='cart__btn cart__btn--clear btn'
                        onClick={handleClear}
                    >
                        Clear Cart
                    </button>
                </div>

                {/* hidden inputs to send to emailjs */}
                <input
                    defaultValue={contactInfo['user-email']}
                    name='emailjs-email'
                    className='hidden'
                    aria-hidden
                />
                <input
                    defaultValue={contactInfo['user-name']}
                    name='emailjs-name'
                    className='hidden'
                    aria-hidden
                />
                <input
                    defaultValue={packagesDetails()}
                    name='package-details'
                    className='hidden'
                    aria-hidden
                />
                <input
                    value={total}
                    name='emailjs-total'
                    className='hidden'
                    readOnly
                    aria-hidden
                />
                <input
                    defaultValue={
                        delivery === 'pickup'
                            ? pickup['value']
                            : delivery === 'delivery'
                            ? deliveryAddress
                            : `please contact us because we didn't get your pickup/delivery details`
                    }
                    name='method-details'
                    className='hidden'
                    aria-hidden
                />
            </form>
            <div className='order-form__other wrapper'>
                <h2>Continue Shopping</h2>
                <div className='shop__grid'>
                    {prices.map((product, i) => (
                        <GridItem
                            key={i}
                            name={product['Product']}
                            image={productImages[product['Product']]}
                            alt={productAltText[product['Product']]}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Cart;
