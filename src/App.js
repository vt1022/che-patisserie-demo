import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from './components/context/index'

import GetSheets from './components/GetSheets/index'
import Header from './components/Header/index'
import Home from './components/Pages/Home/index'
import AllFlavours from './components/Pages/AllFlavours/index'
import Products from './components/Pages/Products'
import Cart from './components/Pages/Cart/index'
import Footer from './components/Footer/index'
import FlavourInfo from './components/Pages/FlavourInfo'
import ScrollToTop from './utils/ScrollToTop'
import Shop from './components/Pages/Shop'
import BulkForm from './components/Pages/BulkForm'
import OrderForm from './components/Pages/Shop/OrderForm'
import ThankYou from './components/Pages/ThankYou'

import './style/style.css'

const App = () => {
    const [cartCount, setCartCount] = useState(0)
    const [checkout, setCheckout] = useState(() => JSON.parse(sessionStorage.getItem('checkout')) || {})

    useEffect(() => {
        // add up the length of the checkout arrays to count how many things are in cart
        let count = 0

        for (let i = 0; i < Object.values(checkout).length; i++) {
            const productsInCart = Object.values(Object.values(checkout)[i])

            for (let j = 0; j < productsInCart.length; j++) {
                count += productsInCart[j].length || 0
            }
        }
        
        setCartCount(count)
    }, [checkout])

    return (
        <Provider>
            <Router>
                <ScrollToTop />
                <GetSheets setCheckout={setCheckout} />
                <Header cartCount={cartCount} />
                <Switch>
                    <Route path='/thankyou'>
                        <ThankYou />
                    </Route>
                    <Route path='/flavours/:flavourName' component={FlavourInfo} />
                    <Route path='/flavours'>
                        <AllFlavours />
                    </Route>
                    <Route path='/products'>
                        <Products />
                    </Route>
                    <Route
                        path='/shop/:product'
                        component={props => <OrderForm {...props} checkout={checkout} setCheckout={setCheckout} />}
                    />
                    <Route path='/shop'>
                        <Shop />
                    </Route>
                    <Route path='/bulk-form' component={BulkForm} />
                    <Route path='/cart'>
                        <Cart checkout={checkout} setCheckout={setCheckout} setCartCount={setCartCount} />
                    </Route>
                    <Route path='/'>
                        <Home checkout={checkout} />
                    </Route>
                </Switch>
                <Footer />
            </Router>
        </Provider>
    )
}

export default App
