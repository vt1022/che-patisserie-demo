import React, { useContext } from 'react'
import { Context } from '../../context/index'
import EmblaCarousel from '../../EmblaCarousel/EmblaCarousel'
import Flavours from '../Flavours'
import ShopItem from '../ShopItem'
import { nextOrderDates } from '../../../utils/getDates'
import { productAltText, productImages } from '../../../utils/productImages'
import moment from 'moment'
import awayMessage from '../../../utils/awayMessage'
// import Calendar from '../../Calender'

const SLIDE_COUNT = 5
const slides = Array.from(Array(SLIDE_COUNT).keys())

const Home = () => {
    const [{ flavours, prices }] = useContext(Context)

    const upcomingFlavours = () => {
        const result = []
        // console.log('nextOrderDates(flavours.weekly)', nextOrderDates(flavours.weekly));
        nextOrderDates(flavours.weekly).forEach(week => {
            result.push(flavours.weekly.filter(entry => entry['Date'] === week))
        })

        return result
    }

    return (
        <section className='home'>
            <EmblaCarousel slides={slides} />
            <div className='wrapper'>
                {/* Todo: bulk order Calendar */}
                {/* <Calendar /> */}
                <div className='home__believe'>
                    <h2 className='home__h2 home__h2--believe'>
                        Taste of Extravagance <span className='nowrap'>and Luxury</span>
                    </h2>
                    <p className='home__p home__p--sub-title'>
                        —using traditional techniques <span className='nowrap'>with modern flavours</span>
                    </p>

                    <p>
                        We aspire to bring freshness to this iconic, decadent French pastry that has been well-loved for
                        centuries. Our premium macarons are made with high-quality ingredients, prepared fresh every week, and
                        handled with the utmost care. Our recipes have been adapted to be less sweet with the pairing of more
                        sophisticated choices of fillings and creams. With our attention to detail, individually hand-decorated
                        macarons, and the incorporation of new and trendy flavours, we hope to deliver a modern, yet luxurious
                        experience in each bite.
                    </p>
                </div>

                {nextOrderDates(flavours.weekly).length < 1 && (
                    <div className='home__away'>
                        <h2 className='home__h2 home__h2--away'>DM Us to Order</h2>
                        <p>{awayMessage}</p>
                    </div>
                )}

                {upcomingFlavours().map((weeklyNames, i) => (
                    <Flavours
                        key={i}
                        className='this-week'
                        h2={`${moment(nextOrderDates(flavours.weekly)[i]).format('MMM Do')} Flavours`}
                        weeklyFlavours={weeklyNames}
                    />
                ))}

                <h2>Products & Prices</h2>
                <div className='home__products'>
                    {prices.map((product, i) => (
                        <ShopItem
                            key={i}
                            image={productImages[product['Product']]}
                            altText={productAltText[product['Product']]}
                            name={product['Product']}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Home
