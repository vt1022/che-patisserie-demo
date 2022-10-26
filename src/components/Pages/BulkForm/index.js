import React from 'react'
// import { productImages, productAltText } from '../../../utils/productImages'
import ContactInfo from '../Cart/ContactInfo'
import DeliveryOptions from '../Cart/DeliveryOptions'

const BulkForm = ({ location }) => {
    const { day } = location
    console.log('day', day)
    if (!day) return null

    const handleConfirm = () => {}
    const handleClear = () => {}

    return (
        <>
            <form className='bulk-form' onSubmit={handleConfirm}>
                <div className='wrapper'>
                    {/* minimum 20 per flavour. 5 flavours max */}
                    <h2 className='bulk-form__h2 h2'>Bulk Order Form</h2>
                    <p className='bulk-form__date'>{day.format('MM/DD/YYYY')}</p>

                    <div className='bulk-form__grid bulk-form__grid--info-options'>
                        <div className='bulk-form__contact'>
                            <h2 className='bulk-form__h2 bulk-form__h2--contact'>Your Info</h2>
                            <ContactInfo />
                        </div>

                        <div className='bulk-form__delivery'>
                            <h2 className='bulk-form__h2 bulk-form__h2--delivery'>Delivery Options</h2>
                            <DeliveryOptions data={{ livesIn: 'bulk', day: day }} />
                        </div>
                    </div>

                    {/* <h3 className='bulk-form__total bulk-form__h3--total'>{`Total: $${total.toFixed(2)}`}</h3> */}
                </div>

                <div className='bulk-form__exit'>
                    <button
                        className='bulk-form__btn bulk-form__btn--confirm btn'
                        // onClick={handleConfirm}
                        type='submit'>
                        Send Details
                    </button>
                    <button className='bulk-form__btn bulk-form__btn--clear btn' onClick={handleClear}>
                        Clear Form
                    </button>
                </div>

                {/* hidden inputs to send to emailjs */}
                {/* <input defaultValue={contactInfo['user-email']} name='emailjs-email' className='hidden' aria-hidden />
                <input defaultValue={contactInfo['user-name']} name='emailjs-name' className='hidden' aria-hidden />
                <input defaultValue={packagesDetails()} name='package-details' className='hidden' aria-hidden />
                <input defaultValue={total} value={total} name='emailjs-total' className='hidden' aria-hidden />
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
                /> */}
            </form>
            {/* fix classes below */}
            <div className='products__btn-container'>
                <div className='wrapper'>
                    <button className='products__btn btn'>Submit</button>
                </div>
            </div>
        </>
    )
}

export default BulkForm
