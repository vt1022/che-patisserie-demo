import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { productImages, productAltText } from "../../../utils/productImages"
import { Context } from "../../context"
import { formatString } from "../../../utils/formatString"

const Products = () => {
    const [{ prices }] = useContext(Context)

    return (
        <section className="products">
            <div className="wrapper">
                <h2>Products</h2>
                <div className="products__item-container">
                    {prices.map((product, i) => {
                        const formattedName = formatString(product["Product"], "kebab")

                        return (
                            <div className={`products__item products__item--${formattedName}`} key={i}>
                                {formattedName === "mac-a-gram oos" ? (
                                    <div className="products__item__image-container">
                                        <div className="products__item__oos">
                                            <p className="products__item__oos__text">Out of Stock</p>
                                        </div>
                                        <img
                                            className="products__item__image"
                                            src={productImages[product["Product"]]}
                                            alt={productAltText[product["Product"]]}
                                        />
                                    </div>
                                ) : (
                                    <Link to={`/shop/${formattedName}`} className="products__item__image-container">
                                        <img
                                            className="products__item__image"
                                            src={productImages[product["Product"]]}
                                            alt={productAltText[product["Product"]]}
                                        />
                                    </Link>
                                )}
                                <div className="products__item__info">
                                    <h3 className="products__item__name">{product["Product"]}</h3>
                                    <p className="products__item__description">{product["Description"]}</p>
                                    {product["Description 2"] && (
                                        <p className="products__item__description">*{product["Description 2"]}</p>
                                    )}
                                    {product["Description 3"] && (
                                        <p className="products__item__description">*{product["Description 3"]}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="products__btn-container">
                <div className="wrapper">
                    <Link to="/shop" className="products__btn btn">
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Products
