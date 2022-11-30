import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Hamburger from './Hamburger'
import che from '../../assets/che.svg'
import cart from '../../assets/cart.svg'

const Header = ({ cartCount }) => {
    const [msgActive, setMsgActive] = useState(false)
    const classes = cartCount > 0 ? `active` : ''

    return (
        <header className='header'>
            <div className='header__wrapper wrapper'>
                <Hamburger />
                <Link className='header__che' to='/'>
                    <img className='header__img' src={che} alt='Ché Pâtisserie logo' />
                </Link>
                <Link to='/cart' className='header__cart '>
                    <p aria-label='items in shopping cart' className={`header__cart__count ${classes}`}>
                        {cartCount}
                    </p>
                    <div className='header__img-container'>
                        <img className='header__img' src={cart} alt='cart' />
                    </div>
                </Link>
            </div>
            {msgActive && (
                <div className='header__top-message'>
                    <div className='header__top-message__wrapper wrapper'>
                        <p className='header__p'>
                            {/* 10% OFF {moment(preOrderDates(flavours.weekly)[0]).format("MMM DD")} pre orders. LIMITED spots left! */}
                            NOTICE: Due to rising gas prices, we
                            <br /> have adjusted our delivery fee to <strong>$7</strong>
                        </p>
                        <button className='header__top-message__btn' onClick={() => setMsgActive(false)}>
                            X
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
