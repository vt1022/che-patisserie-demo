import React, { useContext } from 'react'
import { Context } from '../../context'

const DeliveryOptions = ({ data }) => {
    const [{ delivery, pickupOptions, deliveryAddress, pickup }, dispatch] = useContext(Context)
    // if selected date is xxx, then these times?
    // const bulkDeliveryTimes = ['Saturday between 3:30pm-6:30pm', 'Saturday between 3:30pm-6:30pm']

    const handleOption = e => {
        e.preventDefault()
        dispatch({
            type: 'setDelivery',
            data: e.target.innerText.toLowerCase()
        })
    }

    const pickupHandler = e => {
        dispatch({
            type: 'setPickup',
            data: { value: e.target.value, index: e.target.dataset.i }
        })
    }

    const deliveryAddressHandler = e => {
        dispatch({
            type: 'setAddress',
            data: e.target.value
        })
    }

    return (
        <div className='delivery-options'>
            <button
                className={`delivery-options__btn delivery-options__btn--delivery btn${delivery === 'delivery' ? ' active' : ''}`}
                onClick={handleOption}>
                Delivery
            </button>
            <button
                className={`delivery-options__btn delivery-options__btn--delivery btn${delivery === 'pickup' ? ' active' : ''}`}
                onClick={handleOption}>
                Pickup
            </button>

            {delivery === 'pickup' && (
                <div className='delivery-options__choice'>
                    <p className='delivery-options__p'>
                        Markham:{' '}
                        <a
                            className='form__method__link link'
                            href='https://goo.gl/maps/1V6Gfqj2T31BUfjWA'
                            target='_blank'
                            rel='noreferrer'>
                            First Markham Place
                        </a>
                    </p>
                    {pickupOptions.map((option, i) => (
                        <label key={i} className='delivery-options__control delivery-options__control-radio'>
                            {`${option['Location']} ${option['Time']}`}
                            <input
                                type='radio'
                                data-i={i}
                                name={`radio--pickup`}
                                value={`${option['Location']} ${option['Time']}`}
                                onClick={pickupHandler}
                                checked={parseInt(pickup['index']) === i}
                                // required={i === 0 ? true : false}
                                readOnly
                            />
                            <div className='delivery-options__control-indicator'></div>
                        </label>
                    ))}
                </div>
            )}

            {delivery === 'delivery' && (
                <div className='delivery-options__choice'>
                    <p className='delivery-options__p'>
                        $7 delivery within this{' '}
                        <a
                            className='footer__links__social link'
                            href='https://www.google.com/maps/d/u/0/edit?mid=1aUrtlRxe7HBX87pm3d9JTY_7e7IcCDJq&usp=sharing'
                            target='_blank'
                            rel='noreferrer'>
                            MAP
                        </a>
                    </p>
                    <p className='delivery-options__p'>
                        <a
                            className='footer__links__social link'
                            href='https://www.instagram.com/che.macarons/'
                            target='_blank'
                            rel='noreferrer'>
                            DM
                        </a>{' '}
                        for quote outside our area
                    </p>

                    {data?.livesIn === 'bulk' ? (
                        <>
                            <label className='delivery-options__control delivery-options__control-radio'>
                                {`Saturday between 3:30pm-6:30pm`}
                                <input type='radio' name='radio' checked readOnly />
                                <div className='delivery-options__control-indicator'></div>
                            </label>
                        </>
                    ) : (
                        <label className='delivery-options__control delivery-options__control-radio'>
                            {`Saturday between 3:30pm-6:30pm`}
                            <input type='radio' name='radio' checked readOnly />
                            <div className='delivery-options__control-indicator'></div>
                        </label>
                    )}

                    <div className='delivery-options__info__item flying-label-item'>
                        <input
                            className='flying-label-item__input delivery-options__input'
                            type='text'
                            value={deliveryAddress}
                            onChange={deliveryAddressHandler}
                            required
                        />
                        <label className='flying-label-item__label delivery-options__label'>Address</label>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryOptions
