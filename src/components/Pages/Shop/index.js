import React, { useContext } from "react"
import { Context } from "../../context"
import { Link } from "react-router-dom"
import { formatString } from "../../../utils/formatString"
import { productImages, productAltText } from "../../../utils/productImages"

const Shop = props => {
    const [{ prices }] = useContext(Context)
    // const altText = [
    //     "a row of 5 macarons on their side placed inside a kraft paper box",
    //     "2 macarons stacked inside a clear cube shaped box",
    //     "alternative rows of macaron top and bottom shells on a baking tray",
    //     "bulk"
    // ]

    const GridItem = ({ name = "", price = "", image = "", alt = "" }) =>
        // a lot of customization needed. maybe should just be plain html
        name === "MAC-A-GRAM oos" ? (
            <div className="shop__grid-item">
                <div className="shop-item__image-container">
                    <div className="shop__grid-item__oos">
                        <p className="shop__grid-item__oos__text">Out of Stock</p>
                    </div>
                    <img className="shop__grid-item__image" src={image} alt={alt} />
                </div>
                <div className="shop__grid-item__info">
                    <h3 className="shop__grid-item__name">{name}</h3>
                    <p className="shop__grid-item__price">{price}</p>
                </div>
            </div>
        ) : (
            <Link to={`/shop/${formatString(name, "kebab")}`} className="shop__grid-item">
                <div className="shop-item__image-container">
                    <img className="shop__grid-item__image" src={image} alt={alt} />
                </div>
                <div className="shop__grid-item__info">
                    <h3 className="shop__grid-item__name">{name}</h3>
                    <p className="shop__grid-item__price">{price}</p>
                </div>
            </Link>
        )

    return (
        <div className="shop">
            <div className="shop__wrapper wrapper">
                <h2>Shop Now</h2>
                <div className="shop__grid">
                    {prices.map((product, i) => {
                        const priceText =
                            product["Product"] === "Box of 5"
                                ? `$${product["Single"]}`
                                : product["Product"] === "MAC-A-GRAM"
                                ? `$${product["Single"]}`
                                : product["Product"] === "Batch of 12"
                                ? `$${product["Single"]}`
                                : product["Product"] === "Catering + Bulk"
                                ? `DM or Email for quote`
                                : ""
                        return (
                            <GridItem
                                key={i}
                                name={product["Product"]}
                                price={priceText}
                                image={productImages[product["Product"]]}
                                alt={productAltText[product["Product"]]}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Shop
