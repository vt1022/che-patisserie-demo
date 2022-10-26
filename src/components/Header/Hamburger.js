import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "../context/index"

const Hamburger = () => {
    const [state, dispatch] = useContext(Context)
    const toggleNav = e => {
        e.target.blur()
        dispatch({ type: "toggleNav" })
    }
    const animateClass = state.showHamburger ? "animate" : ""
    return (
        <>
            <a href="#home" className="skip-link visuallyHidden">
                skip to main content
            </a>
            <nav className="nav">
                {/* <!-- hamburger checkbox starts --> */}
                <button className="nav__hamburger" onClick={e => toggleNav(e)}>
                    <div
                        className={`nav__hamburger__line nav__hamburger__line--top ${animateClass}`}></div>
                    <div
                        className={`nav__hamburger__line nav__hamburger__line--mid ${animateClass}`}></div>
                    <div
                        className={`nav__hamburger__line nav__hamburger__line--bot ${animateClass}`}></div>
                </button>
                <ul className={`nav__links ${animateClass}`}>
                    <li className={animateClass}>
                        <Link
                            to="/"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Home
                        </Link>
                    </li>
                    <li className={animateClass}>
                        <Link
                            to="/flavours"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Flavours
                        </Link>
                    </li>
                    <li className={animateClass}>
                        <Link
                            to="/products"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Products
                        </Link>
                    </li>
                    {/* <li className={animateClass}>
                        <Link
                            to="/reviews"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Reviews
                        </Link>
                    </li> */}
                    <li className={animateClass}>
                        <Link
                            to="/shop"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Shop
                        </Link>
                    </li>
                    <li className={animateClass}>
                        <Link
                            to="/cart"
                            className="nav__links__item"
                            onClick={toggleNav}>
                            Cart
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Hamburger
